import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CreateCustomerBody, CreateCustomerResponse, CustomerResponse } from "@/lib/customer";

const apiBaseUrl = process.env.BASE_URL!;

export async function GET(req: Request) {
    try {
        const token = (await cookies()).get("token");

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const page = searchParams.get("page") || "1";

        const res = await fetch(
            `${apiBaseUrl}/customers?search=${search}&page=${page}`,
            {
                headers: { Authorization: `Bearer ${token.value}` },
                cache: "no-store"
            }
        );

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}


export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("token");

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = (await req.json()) as CreateCustomerBody;

        const res = await fetch(`${apiBaseUrl}/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify(body),
        });

        const data: CreateCustomerResponse = await res.json();

        return NextResponse.json(data, { status: res.status });

    } catch (error: unknown) {
        let message = "Something went wrong";

        if (error instanceof Error) message = error.message;
        if (typeof error === "string") message = error;

        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}