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

        const res = await fetch(`${apiBaseUrl}/work-orders?per_page=99999&page=${page}&search=${search}`, {
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