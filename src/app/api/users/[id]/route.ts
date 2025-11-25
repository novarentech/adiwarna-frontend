import { DeleteUserResponse } from "@/lib/account";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL!;

// ===================== GET =====================
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const token = (await cookies()).get("token");
        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: accountId } = await context.params;

        const res = await fetch(`${BASE_URL}/users/${accountId}`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });

    } catch (error: unknown) {
        let message = "Something went wrong";

        if (error instanceof Error) message = error.message;
        else if (typeof error === "string") message = error;

        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}

// ===================== PUT =====================
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const token = (await cookies()).get("token");
        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: accountId } = await context.params;
        const body = await req.json();

        const res = await fetch(`${BASE_URL}/users/${accountId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token.value}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });

    } catch (error: unknown) {
        let message = "Something went wrong";

        if (error instanceof Error) message = error.message;
        else if (typeof error === "string") message = error;

        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const token = (await cookies()).get("token");
        if (!token) {
            return NextResponse.json<DeleteUserResponse>(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        const res = await fetch(`${BASE_URL}/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token.value}`,
                "Content-Type": "application/json"
            }
        });

        const data: DeleteUserResponse = await res.json();

        return NextResponse.json<DeleteUserResponse>(data, { status: res.status });

    } catch (error) {
        let message = "Something went wrong";

        if (error instanceof Error) message = error.message;
        else if (typeof error === "string") message = error;

        return NextResponse.json<DeleteUserResponse>(
            { success: false, message },
            { status: 500 }
        );
    }
}