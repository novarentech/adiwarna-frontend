import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginResponse, LoginResult } from "@/lib/auth";

const BASE_URL = process.env.BASE_URL ?? "{{base_url}}";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result: LoginResponse = await response.json();

        if (!response.ok || !result.success) {
            const fail: LoginResult = {
                success: false,
                message: result.message || "Login failed",
            };
            return NextResponse.json(fail, { status: 401 });
        }

        // Simpan token ke cookie (HTTP-only)
        (await cookies()).set("token", result.data.token, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 60 * 60 * 24, // 1 hari
        });

        (await cookies()).set("role", result.data.user.usertype, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return NextResponse.json({
            success: true,
            message: "Login successful",
            user: result.data.user,
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
