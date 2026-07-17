import { type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });

            response = NextResponse.next({ request });

            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          } catch {
            // Ignore error
          }
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Protect admin routes BUT avoid infinite redirect loop
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Only redirect to login if not already trying to log in
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
