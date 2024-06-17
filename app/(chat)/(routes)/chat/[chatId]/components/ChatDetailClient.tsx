"use client";

import {Companion, Message} from "@prisma/client";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import { useRouter } from "next/navigation";
import {FormEvent, useState} from "react";
import {useCompletion} from "ai/react";
import ChatForm from "@/components/chat/ChatForm";
import ChatMessages from "@/components/chat/ChatMessages";
import {ChatMessageProps} from "@/components/chat/ChatMessage";

export interface ChatDetailClientProps { // & is a way to combine multiple types. In this case, we are combining the Companion type with an object that has messages and _count properties.
    companion: Companion & {
        messages: Message[];
        _count: {
            messages: number;
        }
    };
}

const ChatDetailClient = ({companion}: ChatDetailClientProps) => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);

    const {
        input,
        isLoading,
        handleInputChange,
        handleSubmit,
        setInput,
        error,
    } = useCompletion({
        api: `/api/chat/${companion.id}/`, // The API endpoint to call for completions
        onFinish(prompt, completion) { // onFinish is a callback that is called when the user selects a completion
            const systemMessage: ChatMessageProps = {
                role: "system",
                content: completion,
            } // we are going to create a message which came back from our AI model.
            setMessages((current) => [...current, systemMessage]);
            setInput(""); // We clear the input field which the user wrote.
            router.refresh(); // We refresh the page to show the new message.
        },
    }); // useCompletion is a hook provided by the AI team that allows you to get suggestions for code completions. The Vercel AI SDK is a library for building AI-powered streaming text and chat UIs. Easily stream API responses from AI models

    // system message: We are doing here is we are waiting for the response of our api which is going to generate the response of AI model.
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const userMessage: ChatMessageProps = {
            role: "user",
            content: input,
        } // we are going to create a message which came from the user.
        setMessages((current) => [...current, userMessage]);
        handleSubmit(e); // handle submit is ai package function which is going to call the api and get the response.
    }

    return (
        <div className="flex flex-col p-4 space-y-2 h-full">
            <ChatDetailHeader companion={companion} />
            <ChatMessages
                companion={companion}
                isLoading={isLoading}
                messages={messages}
            />
            {error && <div className="error">Error: {error.message}</div>}
            <ChatForm
                input={input}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default ChatDetailClient;
