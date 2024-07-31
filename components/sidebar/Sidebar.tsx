"use client";

import React from 'react';
import {Home, Plus, Settings} from "lucide-react";
import {cn} from "@/lib/utils";
import {usePathname, useRouter} from "next/navigation"; // cn is a utility function that combines classnames with a space separator. It is used to conditionally apply classes to elements.
import { useProModal } from '@/hooks/useProModal';

const Sidebar = ({isPremium}: {isPremium: boolean}) => {
    const pathname = usePathname();
    const router = useRouter();
    const proModal = useProModal();
    const routes = [
        {
            label: "Home",
            href: "/",
            icon: Home,
            premium: false,
        },
        {
            label: "Create",
            href: "/companion/new",
            icon: Plus,
            premium: true,
        },
        {
            label: "Settings",
            href: "/settings",
            icon: Settings,
            premium: false,
        },
    ];

    const onNavigate = (url:string, premium: boolean) => {
        if (premium && !isPremium) {
            return proModal.onOpen(); // if the user is not premium, open the pro modal. 
        }

        return routes.find((route) => route.href === url && route.premium === premium) ? router.push(url) : null;
    }

    return (
        <div className="flex flex-col space-y-4 h-full text-primary bg-secondary">
            <div className="p-3 flex flex-1 justify-center">
                <div className="space-y-2">
                    {routes.map((route, index) => (
                        <div
                            onClick={() => onNavigate(route.href, route.premium)}
                            key={route.href}
                            className={cn(
                            "flex justify-start rounded-lg transition font-medium hover:text-primary hover:bg-primary/10 text-muted-foreground text-xs group cursor-pointer w-full p-3"
                            ,pathname === route.href && "bg-primary/10 text-primary")}
                        >
                            <div className="flex flex-col items-center flex-1 gap-y-2">
                                <route.icon className="h-5 w-5" />
                                {route.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
