import { NextResponse, NextRequest } from "next/server";

const locales = ["sw", "en"];
const defaultLocale = "sw";

// Nuru is Swahili-first. Many learners' phones are set to English, so we do not
// follow Accept-Language: a visitor sees Swahili until they pick English, and
// that choice is remembered in the `nuru-lang` cookie.
function getLocale(request: NextRequest) {
	const chosen = request.cookies.get("nuru-lang")?.value;
	return chosen && locales.includes(chosen) ? chosen : defaultLocale;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const pathnameLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

	if (pathnameLocale) {
		const res = NextResponse.next();
		if (request.cookies.get("nuru-lang")?.value !== pathnameLocale) {
			res.cookies.set("nuru-lang", pathnameLocale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
		}
		return res;
	}

	return NextResponse.redirect(new URL(`/${getLocale(request)}${pathname}`, request.url));
}

export const config = {
	matcher: [
		// Skip Next internals, auth callback, API routes and static runtime assets.
		"/((?!_next|callback|api|nuru/|main\\.wasm|sw\\.js|manifest\\.json|favicon|.*\\.(?:svg|png|jpg|ico|wasm|js|json|webmanifest)$).*)",
	],
};
