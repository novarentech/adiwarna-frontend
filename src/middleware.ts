// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//     const token = req.cookies.get("token")?.value;
//     const role = req.cookies.get("role")?.value;

//     // Jika route diawali dengan /admin
//     if (req.nextUrl.pathname.startsWith("/admin")) {
//         // Jika belum login
//         if (!token) {
//             return NextResponse.redirect(new URL("/", req.url));
//         }

//         // Jika bukan admin
//         if (role !== "admin") {
//             return NextResponse.redirect(new URL("/teknisi", req.url));
//         }
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/admin/:path*"], // Semua route /admin
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;
    const { pathname } = req.nextUrl;

    // Daftar halaman yang boleh diakses tanpa login
    const publicPaths = ["/"];

    // Jika mengakses halaman private dan belum login → lempar ke "/"
    if (!publicPaths.includes(pathname) && !token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Middleware khusus ADMIN
    if (pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/teknisi", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"], // semua route
};
