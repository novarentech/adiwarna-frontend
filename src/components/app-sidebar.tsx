"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { FaGear } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

export function AppSidebar({ collapsed, onCollapseChange }: { collapsed: boolean; onCollapseChange: () => void }) {
    // Update state on collapse change
    const handleCollapse = () => {
        onCollapseChange();
    };

    console.info(collapsed)

    return (
        <Sidebar side="left" collapsible="icon" className="bg-[#2A2A2A]" >
            <SidebarHeader className="border-b-black">
                <Link
                    href={"admin/dashboard"}
                    className="flex flex-row justify-center items-center space-x-1"
                >
                        

                    {/* Teks hanya muncul jika collapsed false */}
                    <h1 className={`text-xl ${collapsed ? 'hidden' : ''}`}>
                        Adiwarna Pramata
                    </h1>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton className="flex justify-center items-center"><FaGear /><p className={`text-xl ${collapsed ? 'hidden' : ''}`}>Operation</p></SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>aa</SidebarMenuSubItem>
                                    <SidebarMenuSubItem>aa</SidebarMenuSubItem>
                                    <SidebarMenuSubItem>aa</SidebarMenuSubItem>
                                    <SidebarMenuSubItem>aa</SidebarMenuSubItem>
                                    <SidebarMenuSubItem>aa</SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
