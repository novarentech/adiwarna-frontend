import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GetAllPurchaseRequisitionResponse } from "@/lib/purchase-requisitions";


const apiBaseUrl = process.env.BASE_URL;

export async function GET(req: Request) {
    try {
        // Cek token dari cookies
        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Ambil searchParams dari URL request
        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || "1";  // Default page = 1
        const search = searchParams.get("search") || "";  // Default search = ""
        const perPage = searchParams.get("per_page") || "15";  // Default per_page = 15

        // Fetch data dari API dengan parameter yang diambil dari URL
        const res = await fetch(`${apiBaseUrl}/purchase-requisitions?per_page=${perPage}&page=${page}&search=${search}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Parse response JSON
        const data: GetAllPurchaseRequisitionResponse = await res.json();

        // Return data dengan status response
        return NextResponse.json(data, { status: res.status });

    } catch (err: any) {
        // Error handling
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

        const res = await fetch(`${apiBaseUrl}/purchase-requisitions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
            cache: "no-store",
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