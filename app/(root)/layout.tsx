import Navbar from "@/components/header/Navbar";
import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";

export default function HomeLayout({children}:{
    children: React.ReactNode;
}) {
    return (
        <div className="h-full">
            <Navbar />
            <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
                <Sidebar />
            </div>
            <main className="md:pl-20 pt-16 h-full">
                {children}
            </main>
        </div>
    );
}
