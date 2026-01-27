import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CreateUserResponse, UsersListResponse } from "@/lib/account";

const BASE_URL = process.env.BASE_URL!;

export async function GET(req: Request) {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";
    const per_page = searchParams.get("per_page") ?? "10";

    try {
        const res = await fetch(
            `${BASE_URL}/users?per_page=${per_page}&page=${page}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                cache: "no-store"
            }
        );

        const data: UsersListResponse = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const body = await req.json();

    try {
        const res = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        });

        const data: CreateUserResponse = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}