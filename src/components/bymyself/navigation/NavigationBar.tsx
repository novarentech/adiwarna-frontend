"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getUserProfile, IUser, logoutRequest } from "@/lib/auth";

export default function CoolNavigationBar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [user, setUser] = useState<IUser | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [isPopoverOpen, setPopoverOpen] = useState(false); // Track popover state

    const router = useRouter();
    const pathname = usePathname();

    const hidePrefixes = [
        "/admin/quotations/print/",
        "/admin/purchase-order/print/",
        "/admin/jobsheet/print/",
    ];

    useEffect(() => {
        setHydrated(true);
    }, []);

    const hideNavbarRoute =
        hydrated && hidePrefixes.some(prefix => pathname.startsWith(prefix));

    // fetch user
    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserProfile();
            if (res.success) setUser(res.data);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const res = await logoutRequest();
        if (!res.success) return alert("Logout failed: " + res.message);

        alert("Logout successful");
        router.push("/");
    };

    const togglePopover = () => {
        setPopoverOpen(prev => !prev);
    };

    return (
        <div
            className={`${hideNavbarRoute ? "hidden" : ""} 
              w-full h-[60px] shadow-md flex justify-between items-center px-6`}
        >
            {children}
            <div className="flex space-x-3 cursor-pointer relative">
                <FaUser className="w-6 h-6 text-[#555555]" />

                {/* Popover Trigger */}
                <div
                    onClick={togglePopover}
                    className={`text-[#555555] text-xl w-fit inline-block cursor-pointer ${!user ? "opacity-50 pointer-events-none" : ""
                        }`}
                >
                    {user?.name ?? "Loading..."}
                </div>

                {/* Popover Content */}
                <div className={`w-28 top-10 ${isPopoverOpen ? "right-2" : "-right-80"} absolute bg-white shadow-lg rounded-md border p-4 transition-all`}>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 rounded-sm w-20 h-10 text-white cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
