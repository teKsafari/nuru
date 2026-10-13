import type { PichaId } from "@/lib/darasa/shared";

// The nine picture-password pictures. Flat Kanga drawings: ink outlines, one
// saturated fill each, so they read on a cheap phone in sunlight.

const S = { stroke: "#15120f", strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const DRAWINGS: Record<PichaId, React.ReactNode> = {
	simba: (
		<>
			<circle cx="32" cy="33" r="24" fill="#c8553d" {...S} />
			<circle cx="32" cy="35" r="15" fill="#ffc93c" {...S} />
			<circle cx="20" cy="22" r="4.5" fill="#ffc93c" {...S} />
			<circle cx="44" cy="22" r="4.5" fill="#ffc93c" {...S} />
			<circle cx="26.5" cy="32" r="2" fill="#15120f" />
			<circle cx="37.5" cy="32" r="2" fill="#15120f" />
			<path d="M29 38.5h6l-3 3.5z" fill="#15120f" {...S} strokeWidth={1.5} />
			<path d="M28 44c2.5 2 5.5 2 8 0" fill="none" {...S} strokeWidth={2} />
		</>
	),
	tembo: (
		<>
			<path d="M14 18c-8 2-10 18-2 24 4 3 9 1 10-2" fill="#9aa1ad" {...S} />
			<path d="M50 18c8 2 10 18 2 24-4 3-9 1-10-2" fill="#9aa1ad" {...S} />
			<path d="M20 26c0-9 5-14 12-14s12 5 12 14c0 6-3 10-6 12v12c0 4-3 6-6 6-2 0-3-2-3-4" fill="#b9bfc8" {...S} />
			<circle cx="26.5" cy="27" r="2" fill="#15120f" />
			<circle cx="37.5" cy="27" r="2" fill="#15120f" />
			<path d="M22 38c-2 2-2 5 0 6" fill="none" {...S} />
		</>
	),
	twiga: (
		<>
			<path d="M24 58V30l-6-6c-2-2-1-6 2-7l10-3c3-1 6 1 6 4v40" fill="#ffc93c" {...S} />
			<path d="M24 14l-1-6M30 13l1-6" {...S} />
			<circle cx="23" cy="7" r="2" fill="#c8553d" {...S} strokeWidth={1.5} />
			<circle cx="31" cy="6" r="2" fill="#c8553d" {...S} strokeWidth={1.5} />
			<circle cx="25" cy="19" r="1.8" fill="#15120f" />
			<rect x="27" y="30" width="5" height="5" rx="1.5" fill="#c8553d" />
			<rect x="27" y="41" width="5" height="5" rx="1.5" fill="#c8553d" />
			<rect x="25" y="50" width="5" height="5" rx="1.5" fill="#c8553d" />
			<rect x="31" y="22" width="3.5" height="4" rx="1" fill="#c8553d" />
		</>
	),
	pundamilia: (
		<>
			<path d="M20 58V34c0-12 4-22 13-24l4-4 2 6c6 4 9 12 9 20 0 4-2 7-6 7h-6v19" fill="#ffffff" {...S} />
			<path d="M22 30l8 3M21 38l9 2M21 47l9 1M36 18l4 6M30 18l3 8M27 22l2 7" stroke="#15120f" strokeWidth="3.2" strokeLinecap="round" />
			<circle cx="40" cy="25" r="1.8" fill="#15120f" />
			<path d="M43 36h2" {...S} strokeWidth={2} />
			<path d="M29 12c-4 1-8 5-9 10" fill="none" stroke="#15120f" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 3" />
		</>
	),
	kuku: (
		<>
			<path d="M12 36c0-10 8-14 16-12l4-10c6 0 10 4 10 10 0 3-1 5-2 7 8 0 12 6 12 12 0 7-8 12-20 12S12 48 12 36z" fill="#ffffff" {...S} />
			<path d="M33 14c-1-4 2-7 5-6 0-3 4-4 6-1 2-1 4 1 3 4" fill="#ff5a4e" {...S} strokeWidth={2} />
			<path d="M42 19l7 2-7 3" fill="#ff9a3c" {...S} strokeWidth={2} />
			<circle cx="37" cy="19" r="1.8" fill="#15120f" />
			<path d="M40 26c1 3 0 5-2 6" fill="#ff5a4e" {...S} strokeWidth={1.5} />
			<path d="M20 40c4 3 10 3 14 0" fill="none" {...S} strokeWidth={2} />
			<path d="M28 55v5M34 55v5" {...S} stroke="#ff9a3c" strokeWidth={3} />
		</>
	),
	samaki: (
		<>
			<path d="M8 32c8-12 22-16 34-10 4 2 7 6 9 10-2 4-5 8-9 10-12 6-26 2-34-10z" fill="#3b7bff" {...S} />
			<path d="M50 32l8-10v20z" fill="#3b7bff" {...S} />
			<circle cx="19" cy="29" r="2.4" fill="#15120f" />
			<path d="M28 23c3 5 3 13 0 18M35 24c2 5 2 11 0 16" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
		</>
	),
	embe: (
		<>
			<path d="M22 14c10-4 24 2 28 16 4 13-2 24-13 26-9 2-14-4-18-10-3-5-9-8-9-16 0-7 5-13 12-16z" fill="#ff9a3c" {...S} />
			<path d="M22 14c6-2 13-1 18 3-3 5-10 7-17 5-3-1-4-5-1-8z" fill="#22a565" {...S} strokeWidth={2} />
			<path d="M42 30c3 4 4 9 2 14" fill="none" stroke="#ffc93c" strokeWidth="3" strokeLinecap="round" />
			<path d="M24 14c-1-3 0-6 2-8" fill="none" {...S} />
			<path d="M27 7c5-4 12-3 15 1-5 3-11 3-15-1z" fill="#22a565" {...S} strokeWidth={2} />
		</>
	),
	nazi: (
		<>
			<circle cx="32" cy="34" r="22" fill="#8a5a3b" {...S} />
			<path d="M16 28c4-4 9-6 16-6M14 38c3 2 6 3 9 3" fill="none" stroke="#5e3b24" strokeWidth="2.2" strokeLinecap="round" />
			<circle cx="26" cy="30" r="3" fill="#2b1a10" />
			<circle cx="38" cy="30" r="3" fill="#2b1a10" />
			<circle cx="32" cy="39" r="3" fill="#2b1a10" />
		</>
	),
	ndizi: (
		<>
			<path d="M10 22c4 18 18 30 36 28 6-1 9-4 10-8-4 2-8 3-12 2C30 42 20 32 16 18c-1-3-6-2-6 4z" fill="#ffc93c" {...S} />
			<path d="M16 26c5 10 13 17 24 19" fill="none" stroke="#e0a800" strokeWidth="2.2" strokeLinecap="round" />
			<path d="M11 19l-1-5 4 0 2 4" fill="#5e3b24" {...S} strokeWidth={2} />
			<path d="M56 42l3 2" {...S} />
		</>
	),
};

export function Picha({ id, className }: { id: PichaId; className?: string }) {
	return (
		<svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
			{DRAWINGS[id]}
		</svg>
	);
}

/** Swahili names for the pictures; shown under each tile in both languages. */
export const PICHA_MAJINA: Record<PichaId, string> = {
	simba: "simba",
	tembo: "tembo",
	twiga: "twiga",
	pundamilia: "punda milia",
	kuku: "kuku",
	samaki: "samaki",
	embe: "embe",
	nazi: "nazi",
	ndizi: "ndizi",
};

/** Flat tile colour behind each picture, so learners can also remember by colour. */
export const PICHA_RANGI: Record<PichaId, string> = {
	simba: "bg-tint-jua",
	tembo: "bg-tint-bahari",
	twiga: "bg-tint-chungwa",
	pundamilia: "bg-tint-zambarau",
	kuku: "bg-tint-pilipili",
	samaki: "bg-tint-bahari",
	embe: "bg-tint-mwani",
	nazi: "bg-tint-udongo",
	ndizi: "bg-tint-jua",
};
