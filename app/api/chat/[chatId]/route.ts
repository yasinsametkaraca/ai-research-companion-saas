import { rateLimit } from "@/lib/rate-limit";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';
import { MemoryManager } from "@/lib/memory";
import { LangChainStream, StreamingTextResponse } from "ai"; // LangChainStream is a class that is used to create a stream of text responses from the AI model. StreamingTextResponse is a class that is used to create a streaming text response.
import {CallbackManager} from "@langchain/core/callbacks/manager" // CallbackManager is a class that is used to manage callbacks for the Replicate API.
import { Replicate } from "@langchain/community/llms/replicate" // replicate.com is a platform that provides AI models for natural language processing tasks. The Replicate class is used to call the Replicate API for inference.


// This is an example of a POST request handler. For sending a message to a companion. Endpoint: /api/chat/[chatId]/
export async function POST(request: Request, { params }: { params: { chatId: string } }) {
    try {
        const { prompt } = await request.json(); // Parse the request body as JSON. The prompt is the message sent by the user to the companion.
        const user = await currentUser();

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const identifier = `${request.url}-${user.id}`; // Create a unique identifier for the rate limit. Rate limit is used to prevent abuse of the API. Rate limit for every single user.
        const { success } = await rateLimit(identifier); // Check if the rate limit is exceeded. If the rate limit is exceeded, return a 429 status code. 10 requests per 10 seconds.
        if (!success) {
            return new NextResponse("Rate limit exceeded", { status: 429 });
        }

        const companion = await prismadb.companion.update({ // Update the companion with the user message.
            where: {
                id: params.chatId,
                userId: user.id
            },
            data: {
                messages: {
                    create: {
                        content: prompt, // user message
                        role: "user", // user role in the conversation
                        userId: user.id
                    }
                }
            }
        });

        if (!companion) {
            return new NextResponse("Companion not found", { status: 404 });
        }

        const companion_file_name = `${companion.id}.txt`;

        const companionKey = {
            companionId: companion.id,
            userId: user.id,
            modelName: 'llama2-13b'
        };

        const memoryManager = await MemoryManager.getInstance();

        const records = await memoryManager.readLatestHistory(companionKey); // Read the latest chat history from Redis. If any memory for this companion already exists, we are going to fetch that memory.

        if (records.length === 0) { // if there is no memory for this companion, we are going to seed the chat history. Seed chat history is the example conversation that we are going to seed into the vector database.
            await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
        }

        await memoryManager.writeToHistory(`User: ${prompt}\n`, companionKey); // Write the user message to the chat history in Redis. The user message is stored as a chat message with the role "user".

        const recentChatHistory = await memoryManager.readLatestHistory(companionKey); // read the latest chat history from Redis.

        // Query Pinecone
        const similarDocs = await memoryManager.vectorSearch(recentChatHistory, companion_file_name); // Search for similar documents in Pinecone. Pinecone is a vector database that stores chat history as vectors. We are going to search for similar documents in the vector database based on the recent chat history.
        console.log("Similar Docs", similarDocs);
        let relevantHistory = ""; // relevant history is the chat history of the companion that is relevant to the current conversation.

        if (!!similarDocs && similarDocs.length !== 0) { // if there are similar documents found in Pinecone, we are going to fetch the chat history of the companion that is relevant to the current conversation.
            relevantHistory = similarDocs.map(doc => doc.pageContent).join("\n");
        }

        const { handlers } = LangChainStream(); // Create a LangChainStream instance to manage callbacks for the Replicate API.

        // Call Replicate for inference
        const model = new Replicate({ // Create a new Replicate instance to call the Replicate API for inference. The Replicate API is a platform that provides AI models for natural language processing tasks.
            model: "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        // Turn verbose on for debugging
        model.verbose = true;

        const response = await model
            .call(`
                  ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 

                 ${companion.instructions}

                  Below are relevant details about ${companion.name}'s past and the conversation you are in.
                  ${relevantHistory}


                  ${recentChatHistory}\n${companion.name}:`
            )
            .catch(console.error);

        const cleaned = response?.replaceAll(",", "");
        const chunks = cleaned?.split("\n");
        const responseBody = chunks?.[0];
        await memoryManager.writeToHistory("" + responseBody?.trim(), companionKey);
        var Readable = require('stream').Readable;

        let s = new Readable();
        s.push(responseBody);
        s.push(null)

        if (responseBody && responseBody.length > 1) {
            await memoryManager.writeToHistory(`${responseBody.trim()}`, companionKey);

            await prismadb.companion.update({
                where: {
                    id: params.chatId,
                },
                data: {
                    messages: {
                        create: {
                            content: responseBody.trim(),
                            role: 'system',
                            userId: user.id
                        }
                    }
                }
            });
        }

        return new StreamingTextResponse(s);
    } catch (error) {
        console.log("[CHAT_ERROR]", error);
        return new NextResponse("Internal Server", { status: 500 });
    }
}

// const {
//     input,
//     isLoading,
//     handleInputChange,
//     handleSubmit,
//     setInput
// } = useCompletion({
//     api: `/api/chat/${companion.id}/`, // The API endpoint to call for completions
//     onFinish(prompt, completion) { // onFinish is a callback that is called when the user selects a completion
//         const systemMessage: ChatMessageProps = {
//             role: "system",
//             content: completion,
//         } // we are going to create a message which came back from our AI model.
//         setMessages((current) => [...current, systemMessage]);
//         setInput(""); // We clear the input field which the user wrote.
//         router.refresh(); // We refresh the page to show the new message.
//     },
// });
