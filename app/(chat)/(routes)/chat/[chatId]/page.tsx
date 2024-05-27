import React from 'react';
import {auth, redirectToSignIn} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prismadb from "@/lib/prismadb";
import ChatDetailClient from "@/app/(chat)/(routes)/chat/[chatId]/components/ChatDetailClient";

interface ChatDetailPageProps {
    params: {
        chatId: string;
    }
}

// searchParams is next.js's way of passing query parameters to a page. Params is next.js's way of passing dynamic parameters to a page.
const ChatDetailPage = async ({params}: ChatDetailPageProps) => {
    const { userId} = auth();

    if (!userId) {
        return redirectToSignIn()
    }

    const companion = await prismadb.companion.findUnique({
        where: {
            id: params.chatId // fetch companion by id. localhost:3000/chat/1 -> fetch companion with id 1. After that, we define the chat model in the database.
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc'
                },
                where: {
                    userId,
                }
            },
            _count: {  // count the number of messages for companion
                select: {
                    messages: true
                }
            }
        }
    }); // we are only going to load messages between this companion and the current (logged in) user.

    if (!companion) {
        return redirect('/')
    }

    return (
        <ChatDetailClient companion={companion} />
    );
};

export default ChatDetailPage;
