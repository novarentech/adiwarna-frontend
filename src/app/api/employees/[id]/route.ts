import { cookies } from "next/headers";

const apiBaseUrl = process.env.BASE_URL;

// GET /api/employees/:id
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const token = (await cookies()).get("token")?.value;

        const { id } = await context.params; // <-- WAJIB await karena Promise

        if (!token) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const res = await fetch(`${apiBaseUrl}/employees/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: "no-store",
        });

        const data = await res.json();

        return Response.json(data, { status: res.status });
    } catch (err: any) {
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// PUT /api/employees/:id
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const token = (await cookies()).get("token")?.value;

        const { id } = await context.params; // <-- WAJIB await karena Promise

        if (!token) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const res = await fetch(`${apiBaseUrl}/employees/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        return Response.json(data, { status: res.status });
    } catch (err: any) {
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}


export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const token = (await cookies()).get("token")?.value;
        const { id } = await context.params;

        if (!token) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const res = await fetch(`${apiBaseUrl}/employees/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        return Response.json(data, { status: res.status ?? 200 });

    } catch (err: any) {
        return Response.json(
            { success: false, message: err?.message || "Server error" },
            { status: 500 }
        );
    }
}

