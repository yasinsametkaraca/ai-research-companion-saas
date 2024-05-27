"use client";

import {Companion, Message} from "@prisma/client";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";

export interface ChatDetailClientProps { // & is a way to combine multiple types. In this case, we are combining the Companion type with an object that has messages and _count properties.
    companion: Companion & {
        messages: Message[];
        _count: {
            messages: number;
        }
    };
}

const ChatDetailClient = ({companion}: ChatDetailClientProps) => {
    return (
        <div className="flex flex-col p-4 space-y-2 h-full">
            <ChatDetailHeader companion={companion} />
        </div>
    );
};

export default ChatDetailClient;
