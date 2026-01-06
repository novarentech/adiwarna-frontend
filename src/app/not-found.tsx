"use client";
import Image from "next/image"
import { FaCompass } from "react-icons/fa";

import { useRouter } from "next/navigation"

export default function NotFound() {
    const router = useRouter()
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">

            {/* Logo / Brand */}
            <div className="flex items-center gap-2 mb-8">
                <Image src={"/icon.png"} alt="logo" width={54} height={44} />
                <h1 className="text-lg font-semibold text-gray-700">
                    Adiwarna Pratama
                </h1>
            </div>

            {/* 404 */}
            <h2 className="text-6xl font-bold text-gray-900 mb-2">404</h2>
            <p className="text-lg text-gray-500 mb-8">Page Not Found</p>

            {/* Icon */}
            <div className="w-32 h-32 flex items-center justify-center rounded-full mb-6">
                <FaCompass className="w-32 h-32 text-[#31C6D4]"/>
            </div>

            {/* Message */}
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Look like you're lost
            </h3>
            <p className="text-gray-500 max-w-md mb-8">
                The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Button */}
            <div
                onClick={() => router.back()}
                className="bg-[#31C6D4] hover:bg-teal-600 text-white px-6 py-2 rounded-md transition"
            >
                Back
            </div>
        </div>
    )
}
