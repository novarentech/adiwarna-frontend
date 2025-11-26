import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const apiBaseUrl = process.env.BASE_URL;

export async function GET(req: Request) {
    try {
        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || "1";
        const search = searchParams.get("search") || "";

        const res = await fetch(`${apiBaseUrl}/work-orders?per_page=15&page=${page}&search=${search}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });

    } catch (err: any) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("token")?.value;

        if (!token) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const res = await fetch(`${apiBaseUrl}/work-orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        return Response.json(data, { status: res.status });
    } catch (err) {
        return Response.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}