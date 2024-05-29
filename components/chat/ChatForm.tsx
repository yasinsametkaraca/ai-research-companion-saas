"use client";

import {ChangeEvent, FormEvent} from "react";
import {ChatRequestOptions} from "ai";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {LucideSendHorizonal} from "lucide-react";

interface ChatFormProps {
    input: string;
    isLoading: boolean;
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
}

const ChatForm = ({input, isLoading, handleInputChange, onSubmit}: ChatFormProps) => {

    return (
        <form onSubmit={onSubmit} className="flex items-center border-primary/10 pb-0 pt-3 gap-x-2">
            <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message"
                disabled={isLoading}
                className="rounded-lg bg-primary/10"
            />
            <Button
                size="icon"
                variant="ghost"
                disabled={isLoading}
            >
                <LucideSendHorizonal />
            </Button>
        </form>
    );
};

export default ChatForm;
