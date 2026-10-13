import confetti from "canvas-confetti";

const COLOURS = ["#ffc93c", "#ff5a4e", "#3b7bff", "#22a565", "#9b7bff", "#ff9a3c", "#15120f"];

/** Confetti in the Nuru palette, from both lower corners. Skipped for reduced motion. */
export function celebrate() {
	if (typeof window === "undefined") return;
	if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
	const base = { particleCount: 70, spread: 65, startVelocity: 55, colors: COLOURS, shapes: ["square", "circle"] as confetti.Shape[], scalar: 1.1, zIndex: 60 };
	confetti({ ...base, angle: 60, origin: { x: 0, y: 0.9 } });
	confetti({ ...base, angle: 120, origin: { x: 1, y: 0.9 } });
	setTimeout(() => confetti({ ...base, particleCount: 50, angle: 90, spread: 100, origin: { x: 0.5, y: 0.7 } }), 250);
}
