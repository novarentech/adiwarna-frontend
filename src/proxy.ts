import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const pathname = req.nextUrl.pathname;

  const BASE_URL = process.env.BASE_URL!;

  // hide agar tidak bisa akses daily activity report
  if (pathname === "/admin/daily-activity-report") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Jika route diawali dengan /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 🔥 CEK KE BACKEND
    const check = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ❌ token sudah mati / logout di device lain
    if (!check.ok) {
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete("token");
      res.cookies.delete("role");
      return res;
    }

    // Jika bukan admin
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/teknisi", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/daily-activity-report", "/admin/:path*"],
};



// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//     const token = req.cookies.get("token")?.value;
//     const role = req.cookies.get("role")?.value;
//     const pathname = req.nextUrl.pathname;
    

//     // hide agar tidak bisa akses daily activity report
//     if (pathname === "/admin/daily-activity-report") {
//         return NextResponse.redirect(new URL("/admin/dashboard", req.url));
//     }

//     // if (pathname === "/admin/payroll-managements") {
//     //     return NextResponse.redirect(new URL("/admin/dashboard", req.url));
//     // }


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
//     matcher: ["/admin/daily-activity-report", "/admin/:path*"], // Semua route /admin
// };
