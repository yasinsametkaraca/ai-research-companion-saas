"use client";

import React from 'react';
import {Menu, Sparkles} from "lucide-react";
import Link from "next/link";
import {Inter} from "next/font/google";
import {cn} from "@/lib/utils";
import {SignedIn, UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {ModeToggle} from "@/components/general/ModeToggle";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

const font = Inter({
    weight: "800",
    subsets: ["latin"],
});

const Navbar = () => {
    return (
        <div className="flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary bg w-full fixed z-50">
            <div className="flex items-center h-12">
                <MobileSidebar />
                <Link href="/">
                    <h1 className={cn("hidden md:block text-xl md:text-2xl font-bold text-primary", font.className)}>ysk.ai</h1>
                </Link>
            </div>
            <div className="flex items-center gap-x-3">
                <Button variant="upgrade" size="sm">
                    Upgrade
                    <Sparkles className="ml-2 fill-white text-white h-4 w-4"/>
                </Button>
                <ModeToggle />
                <SignedIn>
                    <UserButton afterSignOutUrl="/"/>
                </SignedIn>
            </div>
        </div>
    );
};

export default Navbar;
