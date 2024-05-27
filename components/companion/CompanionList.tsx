import React from 'react';
import {Companion} from "@prisma/client";
import Image from "next/image";
import {
    Card,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import Link from "next/link";
import {MessageSquareMoreIcon} from "lucide-react";

interface CompanionListProps {
    data: (
        Companion & {
            _count: {
                messages: number;
            }
        }
    )[];
} // data is an array of companions. Each companion has a _count field that contains the number of messages for that companion. & is a way to merge two types.

const CompanionList = ({data}: CompanionListProps) => {
    if (data.length === 0) {
        return (
            <div className="pt-9 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="relative w-60 h-60">
                    <Image
                        fill
                        alt="No companion found"
                        src="/no-companion.png"
                    />
                </div>
                <p className="text-muted-foreground">No ai companions found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 pb-10">
            {data.map((companion) => (
                <Card key={companion.id} className="bg-primary/10 border-0 cursor-pointer rounded-xl hover:opacity-80 transition shadow-lg">
                    <Link href={`/chat/${companion.id}/`}>
                        <CardHeader className="flex justify-center text-center items-center text-muted-foreground">
                            <div className="relative w-32 h-32">
                                <Image
                                    fill
                                    alt={companion.name}
                                    src={companion.source}
                                    className="rounded-xl object-cover"
                                />
                            </div>
                            <p className="font-medium text-lg">
                                {companion.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {companion.description}
                            </p>
                        </CardHeader>
                        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                            <p className="lowercase">
                                @{companion.userName}
                            </p>
                            <div className="flex items-center">
                                <MessageSquareMoreIcon className="mr-1 w-5 h-5"/>
                                <p>
                                    {companion._count.messages}
                                </p>
                            </div>
                        </CardFooter>
                    </Link>
                </Card>
            ))}
        </div>
    );
};

export default CompanionList;
