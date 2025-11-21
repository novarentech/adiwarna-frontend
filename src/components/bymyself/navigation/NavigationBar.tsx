"use client";
import { usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa6";

export default function CoolNavigationBar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const hidePrefixes = [
        "/admin/quotations/print/",
        "/admin/purchase-order/print/",
        "/admin/jobsheet/print/",
    ];

    const hideNavbarRoute = hidePrefixes.some(prefix =>
        pathname.startsWith(prefix)
    );


    return (
        <div className={`${hideNavbarRoute ? "hidden" : ""} w-full h-[60px] shadow-md flex justify-between items-center px-6`}>
            {children}
            <div className="flex space-x-3">
                <FaUser className="w-6 h-6 text-[#555555]" />
                {/* nama user */}
                <p className="text-[#555555] text-xl">Dzaki</p>
            </div>
        </div>
    )
}