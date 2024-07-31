import Navbar from "@/components/header/Navbar";
import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import {checkSubscription} from "@/lib/subscription";

export default async function HomeLayout({children}:{
    children: React.ReactNode;
}) {
    const isPremium = await checkSubscription();

    return (
        <div className="h-full">
            <Navbar isPremium={isPremium} />
            <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
                <Sidebar isPremium={isPremium} />
            </div>
            <main className="md:pl-20 pt-16 h-full">
                {children}
            </main>
        </div>
    );
}
