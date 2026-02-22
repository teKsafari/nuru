"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Contributor {
	username: string;
	profile_picture: string;
	profile_url: string;
}

// ─── Single Avatar ───────────────────────────────────────────────────────────
function Avatar({ contributor }: { contributor: Contributor }) {
	const [hovered, setHovered] = useState(false);

	return (
		<a
			href={contributor.profile_url}
			target="_blank"
			rel="noopener noreferrer"
			className="group relative flex shrink-0 flex-col items-center gap-2"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* Outer glow */}
			<div
				className="pointer-events-none absolute -inset-3 rounded-2xl transition-opacity duration-500"
				style={{
					opacity: hovered ? 1 : 0,
					background:
						"radial-gradient(circle, rgba(0,180,216,0.15) 0%, transparent 70%)",
				}}
			/>
			{/* Image */}
			<div
				className="relative h-14 w-14 overflow-hidden rounded-xl transition-all duration-500 sm:h-16 sm:w-16"
				style={{
					border: hovered
						? "2px solid rgba(0, 180, 216, 0.6)"
						: "2px solid rgba(255, 255, 255, 0.06)",
					boxShadow: hovered ? "0 0 24px rgba(0, 180, 216, 0.25)" : "none",
				}}
			>
				<Image
					src={contributor.profile_picture}
					alt={contributor.username}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-110"
					sizes="64px"
				/>
			</div>
			{/* Name tag */}
			<span
				className="max-w-[72px] truncate text-center text-[9px] tracking-wider transition-colors duration-300 sm:text-[10px]"
				style={{
					color: hovered
						? "rgba(0, 180, 216, 0.9)"
						: "rgba(255, 255, 255, 0.35)",
				}}
			>
				{contributor.username}
			</span>
		</a>
	);
}

// ─── Marquee Row ─────────────────────────────────────────────────────────────
function MarqueeRow({
	contributors,
	direction,
	speed,
}: {
	contributors: Contributor[];
	direction: "left" | "right";
	speed: number;
}) {
	// Repeat 3x — animation shifts by 1/3 (33.333%) for seamless circular loop
	const items = [...contributors, ...contributors, ...contributors];

	return (
		<div className="relative w-full overflow-hidden py-4">
			<div
				className="flex w-max items-start gap-6 sm:gap-10"
				style={{
					animation: `marquee-${direction} ${speed}s linear infinite`,
				}}
			>
				{items.map((c, i) => (
					<Avatar key={`${c.username}-${i}`} contributor={c} />
				))}
			</div>
		</div>
	);
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ContributorsPage() {
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		fetch("/contributors.json")
			.then((r) => r.json())
			.then((data: Contributor[]) => {
				setContributors(data);
				requestAnimationFrame(() => setLoaded(true));
			});
	}, []);

	// Shuffle a copy of the array using a seeded approach
	// Each row gets a differently shuffled version of the full list
	const shuffle = (arr: Contributor[], seed: number): Contributor[] => {
		const shuffled = [...arr];
		let s = seed;
		for (let i = shuffled.length - 1; i > 0; i--) {
			s = (s * 16807 + 0) % 2147483647; // absolute voodoo
			const j = s % (i + 1);
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	const row1 = shuffle(contributors, 1);
	const row2 = shuffle(contributors, 2);
	const row3 = shuffle(contributors, 3);

	return (
		<div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-slate-100 dark:bg-background">
			{/* Slideshow */}
			<div
				className="relative z-10 flex w-full flex-col gap-2 sm:gap-4"
				style={{
					opacity: loaded ? 1 : 0,
					transition: "opacity 0.8s ease-out",
				}}
			>
				{row1.length > 0 && (
					<MarqueeRow contributors={row1} direction="left" speed={79} />
				)}
				{row2.length > 0 && (
					<MarqueeRow contributors={row2} direction="right" speed={66} />
				)}
				{row3.length > 0 && (
					<MarqueeRow contributors={row3} direction="left" speed={28} />
				)}
			</div>

			{/* Keyframes */}
			<style jsx global>{`
				@keyframes marquee-left {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-33.333%);
					}
				}

				@keyframes marquee-right {
					0% {
						transform: translateX(-33.333%);
					}
					100% {
						transform: translateX(0);
					}
				}
			`}</style>
		</div>
	);
}
