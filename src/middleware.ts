import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;
    const pathname = req.nextUrl.pathname;

    // hide agar tidak bisa akses daily activity report
    if (pathname === "/admin/daily-activity-report") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }


    // Jika route diawali dengan /admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
        // Jika belum login
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Jika bukan admin
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/teknisi", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/daily-activity-report", "/admin/:path*"], // Semua route /admin
};
