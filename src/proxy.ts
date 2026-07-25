import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL! || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || "placeholder-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // 1. Differentiate internal configurations and base application tracks
  const isInternal = url.pathname.startsWith("/_next") || url.pathname.startsWith("/api") || url.pathname.match(/\.(.*)$/);
  const isDashboardRoute = url.pathname.startsWith("/dashboard");
  const isAuthRoute = url.pathname.startsWith("/login") || url.pathname.startsWith("/signup");

  if (isInternal) {
    return response;
  }

  // Define your platform's main deployment domains
  const baseDomains = ["localhost:3000", "saas-platform.com", "www.saas-platform.com"];
  const isBaseDomain = baseDomains.includes(hostname);

  let targetSubdomain = "";

  if (!isBaseDomain) {
    // Check if it's a structural subdomain format (e.g., shop.localhost:3000 or shop.saas-platform.com)
    if (hostname.includes(".localhost:3000")) {
      targetSubdomain = hostname.split(".localhost:3000")[0];
    } else if (hostname.includes(".saas-platform.com")) {
      targetSubdomain = hostname.split(".saas-platform.com")[0];
    }
    
    // If it doesn't contain the platform domain tokens, it's a Custom Vanity Domain! (e.g., www.abigailboutique.com)
    if (!targetSubdomain && !hostname.startsWith("www.")) {
      // Look up the database to find which tenant owns this custom domain
      const { data: customTenant } = await supabase
        .from("tenants")
        .select("subdomain")
        .eq("custom_domain", hostname)
        .single();

      if (customTenant) {
        targetSubdomain = customTenant.subdomain;
      }
    }
  }

  // 🚨 2. Execute dynamic URL rewrite for subdomains and custom domains
  if (targetSubdomain && targetSubdomain !== "www") {
    url.pathname = `/store/${targetSubdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // 3. Standard Main Branch Authentication Guards
  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};