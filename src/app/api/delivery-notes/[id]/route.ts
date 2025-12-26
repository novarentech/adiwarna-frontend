import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GetDeliveryNoteGetByIdResponse } from "@/lib/delivery-notes";

const apiBaseUrl = process.env.BASE_URL;

// GET 
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params; // <-- WAJIB await karena Promise

        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const res = await fetch(`${apiBaseUrl}/delivery-notes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data: GetDeliveryNoteGetByIdResponse = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, message: err.message || "Error" },
            { status: 500 }
        );
    }
}

// PUT
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params; // <-- WAJIB await

        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const res = await fetch(`${apiBaseUrl}/delivery-notes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, message: err.message || "Error" },
            { status: 500 }
        );
    }
}


// DELETE /api/customers/:id
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const token = (await cookies()).get("token")?.value;

        const { id } = await context.params; // <-- WAJIB await

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const res = await fetch(`${apiBaseUrl}/delivery-notes/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });

    } catch (err: any) {
        return NextResponse.json(
            { success: false, message: err.message || "Error deleting/delivery-notes" },
            { status: 500 }
        );
    }
}
