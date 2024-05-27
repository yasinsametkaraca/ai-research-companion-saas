"use client";

import {ChatDetailClientProps} from "@/app/(chat)/(routes)/chat/[chatId]/components/ChatDetailClient";
import {Button} from "@/components/ui/button";
import {ChevronLeft, Edit, MessageSquare, MoreVertical, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import CompanionAvatar from "@/components/chat/CompanionAvatar";
import {useUser} from "@clerk/nextjs";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useToast} from "@/components/ui/use-toast";
import axios from "axios";

const ChatDetailHeader = ({companion}: ChatDetailClientProps) => {
    const router = useRouter();
    const { user } = useUser(); // useUser is a hook provided by Clerk that returns the current user
    const { toast } = useToast(); // useToast is a hook provided by Clerk that allows you to show toasts

    const deleteCompanion = async () => {
        try {
            await axios.delete(`/api/companion/${companion.id}/`)
            toast({
                description: 'Companion deleted successfully.',
            })
            router.refresh();
            router.push('/');
        } catch (e) {
            console.error(e);
            toast({
                description: 'Something went wrong. Please try again later.',
                variant: 'destructive'
            });
        }
    }

    return (
        <div className="flex justify-between items-center border-b border-primary/10 pb-4 w-full">
            <div className="flex items-center gap-x-2">
                <Button onClick={() => router.back()} size="icon" variant="ghost">
                    <ChevronLeft className="h-10 w-10"/>
                </Button>
                <CompanionAvatar source={companion.source}/>
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <p className="font-bold">{companion.name}</p>
                        <div className="flex items-center text-muted-foreground text-xs">
                            <MessageSquare className="h-4 w-4 mr-1"/>
                            {companion._count.messages}
                        </div>
                    </div>
                    <p className="text-muted-foreground text-xs">Created by {companion.userName}</p>
                </div>
            </div>
            {
                user?.id === companion.userId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="secondary">
                                <MoreVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/companion/${companion.id}/`)}>
                                <Edit className="h-4 w-4 mr-2.5"/>Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteCompanion()}>
                                <Trash2 className="h-4 w-4 mr-2.5"/>Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        </div>
    );
};

export default ChatDetailHeader;
