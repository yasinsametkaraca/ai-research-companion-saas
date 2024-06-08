import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

export type CompanionKey = {
    companionId: string;
    modelName: string;
    userId: string;
};

export class MemoryManager { // MemoryManager class to manage chat history and vectors
    private static instance: MemoryManager; // Singleton instance of MemoryManager class
    private history: Redis; // Redis instance to store chat history
    private vectorDBClient: Pinecone; // Pinecone instance to store and search vectors. Vectors is a data structure that stores a list of numbers. Each number represents a feature of the data point.

    public constructor() { // Constructor to initialize Redis and Pinecone clients
        this.history = Redis.fromEnv(); // fromEnv() is a static method that creates a Redis client from environment variables
        this.vectorDBClient = new Pinecone({ // Create a Pinecone client to store and search vectors
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }

    // public async init() {
    //     if (this.vectorDBClient instanceof Pinecone) {
    //         await this.vectorDBClient.init({
    //             apiKey: process.env.PINECONE_API_KEY!,
    //         });
    //     }
    // }

    public async vectorSearch( // Method to search for similar vectors in the Pinecone database
        recentChatHistory: string,
        companionFileName: string,
    ) {
        const pineconeClient = <Pinecone>this.vectorDBClient; // Type assertion to Pinecone

        const pineconeIndex = pineconeClient.Index( // Create a Pinecone index. An index is a data structure that stores vectors and allows for fast search and retrieval of similar vectors.
            process.env.PINECONE_INDEX! || "",
        );

        const vectorStore = await PineconeStore.fromExistingIndex( // PineconeStore is a class that provides methods to store and search vectors in a Pinecone index.
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }), // OpenAIEmbeddings is a class that provides methods to generate embeddings for text data using the OpenAI API. Embeddings are numerical representations of text data that capture semantic information.
            { pineconeIndex },
        ); // vectorStore is an instance of PineconeStore that uses the Pinecone index to store and search vectors.

        const similarDocs = await vectorStore // search for similar vectors in the Pinecone index. The similaritySearch method returns the top k similar vectors to the input vector.
            .similaritySearch(recentChatHistory, 3, { fileName: companionFileName }) // The input vector is the recent chat history, and the number of similar vectors to return is 3. File name is used to identify the companion.
            .catch((err) => {
                console.log("ERROR: failed to get vector search results.", err);
            });
        return similarDocs;
    }

    public static async getInstance(): Promise<MemoryManager> { // Method to get the singleton instance of MemoryManager class. Returns a Promise of MemoryManager instance.
        if (!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();
        }
        return MemoryManager.instance;
    }

    private generateRedisCompanionKey(companionKey: CompanionKey): string { // Method to generate a unique key for storing chat history in Redis
        return `${companionKey.companionId}-${companionKey.modelName}-${companionKey.userId}`;
    } // redis stores the data in key-value pairs. The key is generated using the companionId, modelName, and userId. Values are stored as chat history in Redis.

    public async writeToHistory(text: string, companionKey: CompanionKey) { // Method to write chat history to Redis. Our models can adapt to new information by storing and retrieving chat history.
        if (!companionKey || typeof companionKey.userId == "undefined") {
            console.log("Companion key set incorrectly");
            return "";
        }

        // history is instance of Redis.
        const key = this.generateRedisCompanionKey(companionKey);
        const result = await this.history.zadd(key, { // zadd method adds a member with a score to a sorted set in Redis
            score: Date.now(), // score is the timestamp of the chat message
            member: text, // member is the chat message text
        }); // The chat history is stored as a sorted set in Redis, with the timestamp as the score and the chat message as the member.
        return result;
    }

    public async clearHistory(companionKey: CompanionKey) {
        if (!companionKey || typeof companionKey.userId == "undefined") {
            console.log("Companion key set incorrectly");
            return "";
        }

        const key = this.generateRedisCompanionKey(companionKey);

        await this.history.del(key);
    }

    public async readLatestHistory(companionKey: CompanionKey): Promise<string> { // Method to read (fetch) the latest chat history from Redis. Returns a Promise of the latest chat history.
        if (!companionKey || typeof companionKey.userId == "undefined") {
            console.log("Companion key set incorrectly");
            return "";
        }

        const key = this.generateRedisCompanionKey(companionKey);
        let result = await this.history.zrange(key, 0, Date.now(), { // zrange method retrieves members from a sorted set in Redis within a range of scores.
            byScore: true, // 0 is the start index, Date.now() is the end index, byScore is set to true to retrieve members (history) by score.
        }); // The chat history is retrieved from Redis as a list of chat messages sorted by timestamp. key is the unique key for the take existing chat history.

        result = result.slice(-30).reverse(); // Get the latest 30 chat messages and reverse the order to show the most recent messages first.
        const recentChats = result.reverse().join("\n"); // Join the chat messages with a newline character to create a single string of chat history. The chat history is stored as a string in Redis. Splitting the text because the way it's stores in database the way it's strored in Vector database is different.
        return recentChats;
    }

    // seedChatHistory method seeds the chat history of a companion with example conversation data.
    public async seedChatHistory( // Companion creation we have two fields, one is the instructions and the other is the seed chat (the example conversation). So we are going to use that example conversation to seed that information into the vector database. So we can create a memory for our companion. So companion knows how to behave in a conversation.
        seedContent: String, // Seed content is the example conversation to seed into the vector database
        delimiter: string = "\n", // Delimiter is the character used to split the seed content into individual chat messages
        companionKey: CompanionKey,
    ) {
        const key = this.generateRedisCompanionKey(companionKey);
        if (await this.history.exists(key)) {
            console.log("User already has chat history");
            return;
        }

        const content = seedContent.split(delimiter); // Split the seed content into individual chat messages using the delimiter
        let counter = 0;
        for (const line of content) { // Iterate over each chat message in the seed content
            await this.history.zadd(key, { score: counter, member: line }); // Add each chat message to the chat history in Redis. The score is the index of the chat message.
            counter += 1;
        }
    }
}

// In memory manager class, we are going to store the chat history and vectors.
// We are going to use Redis to store the chat history and Pinecone to store and search vectors.
// The MemoryManager class provides methods to write chat history to Redis, read the latest chat history, search for similar vectors in the Pinecone database, and seed chat history with example conversation data.
// The getInstance method returns a singleton instance of the MemoryManager class.
// The generateRedisCompanionKey method generates a unique key for storing chat history in Redis.
// The writeToHistory method writes chat history to Redis.
// The clearHistory method clears the chat history for a companion.
// The readLatestHistory method reads the latest chat history from Redis.
// The seedChatHistory method seeds the chat history of a companion with example conversation data.
// The MemoryManager class is used to manage chat history and vectors for AI companions.
// Redis and pinecone difference in memory manager class, Redis is used to store chat history and Pinecone is used to store and search vectors.