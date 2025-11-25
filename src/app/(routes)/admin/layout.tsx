"use client";

import { AppSidebar } from "@/components/app-sidebar";
import CoolNavigationBar from "@/components/bymyself/navigation/NavigationBar";
import CoolSidebar from "@/components/bymyself/navigation/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

export default function LayoutAdmin({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(false);

    // Fungsi untuk mengubah state collapsed
    // const handleCollapseChange = () => {
    //     setTimeout(() => {
    //         setCollapsed(prev => !prev);
    //     }, 50);
    // };
    const handleCollapseChange = () => {
        setCollapsed(prev => !prev);
    };


    return (
        <div className="w-full h-full flex">
            {/* <SidebarProvider >
                <AppSidebar collapsed={collapsed} onCollapseChange={handleCollapseChange} />
                <main>
                    <SidebarTrigger onClick={handleCollapseChange} />
                    {children}                    
                </main>
            </SidebarProvider> */}
            <CoolSidebar collapsed={collapsed} onCollapseChange={handleCollapseChange} />
            <div className="w-full overflow-y-auto overflow-x-clip">

                <CoolNavigationBar>
                    <button className="cursor-pointer" onClick={handleCollapseChange}><RxHamburgerMenu className="w-6 h-6" /></button>
                </CoolNavigationBar>
                {children}
            </div>
        </div>
    )
}