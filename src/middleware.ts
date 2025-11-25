import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

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
    matcher: ["/admin/:path*"], // Semua route /admin
};
