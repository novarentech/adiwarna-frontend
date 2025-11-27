import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
        const page = searchParams.get("page") || "1";   // Default page = 1
        const search = searchParams.get("search") || "";   // Default search = ""
        const perPage = searchParams.get("per_page") || "15";   // Default per_page = 15

        // Ambil parameter tanggal dari searchParams
        const startDate = searchParams.get("start_date") || "";  // Default start_date = ""
        const endDate = searchParams.get("end_date") || "";      // Default end_date = ""

        // Menggunakan encodeURIComponent untuk parameter search
        const encodedSearch = encodeURIComponent(search);

        // Fetch data dari API dengan semua parameter (termasuk tanggal) menggunakan template literals
        // URL Target: {{base_url}}/track-records?per_page=15&page=1&start_date=...&end_date=...&search=...
        const res = await fetch(`${apiBaseUrl}/track-records?per_page=${perPage}&page=${page}&start_date=${startDate}&end_date=${endDate}&search=${encodedSearch}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Parse response JSON
        const data = await res.json();

        // Return data dengan status response
        return NextResponse.json(data, { status: res.status });

    } catch (err: any) {
        // Error handling
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}