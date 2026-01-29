"use client";

import { AppSidebar } from "@/components/app-sidebar";
import CoolNavigationBar from "@/components/bymyself/navigation/NavigationBar";
import CoolSidebar from "@/components/bymyself/navigation/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

export default function LayoutAdmin({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(false);

    // Initialize collapsed state based on checking window width (client-side only)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        }

        // Run once on mount
        handleResize();

        // Optional: Listen for resize if you want dynamic behaviour
        // window.addEventListener('resize', handleResize);
        // return () => window.removeEventListener('resize', handleResize);
    }, []);

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