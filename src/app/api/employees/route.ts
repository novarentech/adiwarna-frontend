import { GetEmployeeListResponse } from "@/lib/employee";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "15";
    const search = searchParams.get("search") || "";

    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return Response.json({ success: false, message: "Unauthenticated" }, { status: 401 });
    }

    try {
        const res = await fetch(`${process.env.BASE_URL}/employees?per_page=${per_page}&page=${page}&search=${search}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            cache: "no-store",
        });

        const data: GetEmployeeListResponse = await res.json();

        return Response.json(data, { status: res.status });
    } catch (error) {
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return Response.json({ success: false, message: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();

    try {
        const res = await fetch(`${process.env.BASE_URL}/employees`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        return Response.json(data, { status: res.status });
    } catch (error) {
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}