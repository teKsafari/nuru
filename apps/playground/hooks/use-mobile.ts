import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onChange: () => void) {
	const mql = window.matchMedia(QUERY);
	mql.addEventListener("change", onChange);
	window.addEventListener("resize", onChange);
	return () => {
		mql.removeEventListener("change", onChange);
		window.removeEventListener("resize", onChange);
	};
}

/**
 * Phone layout or not. `undefined` during server rendering and hydration, so a
 * page can show a neutral frame instead of flashing the wrong layout.
 */
export function useMobileLayout(): boolean | undefined {
	return React.useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => undefined,
	);
}

export function useIsMobile() {
	return !!useMobileLayout();
}
