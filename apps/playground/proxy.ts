import { match } from "@formatjs/intl-localematcher"; // look out for https://github.com/tc39/proposal-intl-localematcher
import Negotiator from "negotiator";

let locales = ["en", "sw"];
let defaultLocale = "en";

import { NextResponse, NextRequest } from "next/server";

function getLocale(request: NextRequest) {
	const negotiatorHeaders: Record<string, string> = {};

	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

	let languages = new Negotiator({ headers: negotiatorHeaders }).languages();

	return match(languages, locales, defaultLocale); // -> 'en'
}

export function proxy(request: NextRequest) {
	// Check if there is any supported locale in the pathname
	const { pathname } = request.nextUrl;
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (pathnameHasLocale) return;

	// Redirect if there is no locale
	const locale = getLocale(request);
	// e.g. incoming request is /anza
	// The new URL is now /en/anza
	// TODO: change default locale to sw
	return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
	matcher: [
		// Skip all internal paths (_next)
		"/((?!_next).*)",
		// Optional: only run on root (/) URL
		// '/'
	],
};
