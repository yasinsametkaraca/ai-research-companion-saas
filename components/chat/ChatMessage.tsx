"use client";

import {useToast} from "@/components/ui/use-toast";
import {useTheme} from "next-themes";
import {cn} from "@/lib/utils";
import CompanionAvatar from "@/components/chat/CompanionAvatar";
import {BeatLoader} from "react-spinners";
import UserAvatar from "@/components/chat/UserAvatar";
import {Button} from "@/components/ui/button";
import {Copy} from "lucide-react";

export interface ChatMessageProps {
    role: "system" | "user";
    content?: string;
    isLoading?: boolean;
    source?: string;
}

const ChatMessage = ({role, content, isLoading, source}: ChatMessageProps) => {
    const {toast} = useToast();
    const {theme} = useTheme(); // useTheme is a hook that allows you to access the current theme of your application. It returns an object with the current theme and a function to switch between themes.

    const onCopy = () => {
        if (!content) return;

        navigator.clipboard.writeText(content); // The Clipboard API provides the ability to respond to clipboard commands (cut, copy, and paste) as well as to asynchronously read from and write to the system clipboard.
        toast({
            title: "Message copied to clipboard",
            description: content,
        });
    }

    return (
        <div
            className={cn(
                "group flex items-start gap-x-3 py-4 w-full",
                role === "user" && "justify-end",
            )}
        >
            {role !== "user" && source && <CompanionAvatar source={source} />}
            <div className="rounded-md px-4 py-2 text-sm bg-primary/10 max-w-sm">
                {
                    isLoading ? <BeatLoader size={7} color={theme === "light" ? "blue" : "white"} /> : content
                }
            </div>
            {role === "user" && <UserAvatar />}
            {role !== "user" && !isLoading && (
                <Button
                    onClick={onCopy}
                    className="opacity-0 group-hover:opacity-100 transition"
                    size="icon"
                    variant="ghost"
                >
                    <Copy className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
};

export default ChatMessage;

// group: The group class is a utility class that allows you to apply styles to a group of elements. It is used to apply styles to a group of elements that are siblings of each other.
// group-hover: The group-hover class is a utility class that allows