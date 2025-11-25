import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.BASE_URL!;

export async function GET() {
    try {
        const token = (await cookies()).get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token not found" },
                { status: 401 }
            );
        }

        const res = await fetch(`${BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
