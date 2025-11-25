import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LogoutResponse } from "@/lib/auth";


const BASE_URL = process.env.BASE_URL ?? "{{base_url}}";

export async function POST() {
    try {
        const token = (await cookies()).get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not logged in" } as LogoutResponse,
                { status: 400 }
            );
        }

        // Panggil backend logout
        const res = await fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result: LogoutResponse = await res.json();

        // Hapus cookie
        (await cookies()).delete("token");
        (await cookies()).delete("role");

        return NextResponse.json(result);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Internal server error" } as LogoutResponse,
            { status: 500 }
        );
    }
}
