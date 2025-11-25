"use client";
import { usePathname, useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa6";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getUserProfile, IUser, logoutRequest } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function CoolNavigationBar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [user, setUser] = useState<IUser | null>(null);

    const router = useRouter();
    const pathname = usePathname();
    const hidePrefixes = [
        "/admin/quotations/print/",
        "/admin/purchase-order/print/",
        "/admin/jobsheet/print/",
    ];

    const hideNavbarRoute = hidePrefixes.some(prefix =>
        pathname.startsWith(prefix)
    );


    // handle get current user
    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserProfile();

            if (res.success) {
                setUser(res.data);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        const res = await logoutRequest();

        if (!res.success) {
            alert("Logout failed: " + res.message);
            return;
        }

        // Optional: pop up message
        alert("Logout successful");

        router.push("/");
    };

    return (
        <div className={`${hideNavbarRoute ? "hidden" : ""} w-full h-[60px] shadow-md flex justify-between items-center px-6`}>
            {children}
            <div className="flex space-x-3 cursor-pointer">
                <FaUser className="w-6 h-6 text-[#555555]" />
                {/* nama user */}
                <Popover>
                    <PopoverTrigger className={`${user ? "" : "hidden"}`}>
                        <p className="text-[#555555] text-xl cursor-pointer">{user ? user.name : "Loading..."}</p>
                    </PopoverTrigger>
                    <PopoverContent className="w-28 mr-4 mt-2"><button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 rounded-sm w-20 h-10 text-white cursor-pointer">Logout</button></PopoverContent>
                </Popover>
            </div>
        </div>
    )
}