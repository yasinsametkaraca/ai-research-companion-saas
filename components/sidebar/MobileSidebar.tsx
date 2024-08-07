import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Menu} from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";

const MobileSidebar = ({isPremium}: {isPremium: boolean}) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-secondary pt-12 w-28">
                <Sidebar isPremium={isPremium} />
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
