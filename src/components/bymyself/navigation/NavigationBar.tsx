"use client";
import { FaUser } from "react-icons/fa6";

export default function CoolNavigationBar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return(
        <div className="w-full h-[60px] shadow-md flex justify-between items-center px-6">
            {children}
            <div className="flex space-x-3">
                <FaUser className="w-6 h-6 text-[#555555]"/>
                {/* nama user */}
                <p className="text-[#555555] text-xl">Dzaki</p>
            </div>
        </div>
    )
}