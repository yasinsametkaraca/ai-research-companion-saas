import {Companion} from "@prisma/client";
import ChatMessage, {ChatMessageProps} from "@/components/chat/ChatMessage";
import {ElementRef, useEffect, useRef, useState} from "react";

interface ChatMessagesProps {
    companion: Companion;
    isLoading: boolean;
    messages: ChatMessageProps[];
}

const ChatMessages = ({companion, isLoading, messages = []}: ChatMessagesProps) => {
    const scrollRef = useRef<ElementRef<"div">>(null); // we are going to use this ref to scroll to the bottom of the chat messages.
    const [fakeLoading, setFakeLoading] = useState<boolean>(messages.length === 0) // if we have no message with this ai companion, we are going to show a loading. because first time talking let's show a loading to do a cool effect.

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false);
        }, 1000); // we are going to show loading for 1 second.

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({behavior: "smooth"});
    }, [messages.length]);

    return (
        <div className="flex-1 overflow-y-auto pr-3">
            <ChatMessage
                isLoading={fakeLoading}
                source={companion.source}
                role="system"
                content={`Hello, I'm ${companion.name}, ${companion.description}.`}
            />
            {messages.map((message, index) => (
                <ChatMessage
                    key={message.content}
                    role={message.role}
                    content={message.content}
                    source={companion.source}
                />
            ))}
            {isLoading && ( // if we are loading, that means that the AI is generating a response.
                <ChatMessage
                    isLoading
                    role="system"
                    source={companion.source}
                />
            )}
            <div ref={scrollRef} /> {/* we are going to scroll to this div when we have a new message. */}
        </div>
    );
};

export default ChatMessages;

// flex-1: flex-1 is a utility class that sets the flex-grow property to 1. This means that the element will grow to fill the available space in the flex container.