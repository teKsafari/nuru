"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppLogo } from "@nuru/ui/components/app-logo";

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
			<div
				className={`relative h-14 w-14 overflow-hidden rounded-md border-2 border-mstari bg-karatasi-2 transition-transform duration-150 sm:h-16 sm:w-16 ${
					hovered ? "-translate-x-px -translate-y-px shadow-kivuli" : "shadow-kivuli-sm"
				}`}
			>
				<Image
					src={contributor.profile_picture}
					alt={contributor.username}
					fill
					className="object-cover"
					sizes="64px"
				/>
			</div>
			{/* Name tag */}
			<span
				className={`max-w-[72px] truncate text-center font-mono text-[9px] tracking-wider transition-colors duration-150 sm:text-[10px] ${
					hovered ? "text-foreground" : "text-muted-foreground"
				}`}
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
			s = (s * 16807 + 0) % 2147483647; // Park-Miller step
			const j = s % (i + 1);
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	const row1 = shuffle(contributors, 1);
	const row2 = shuffle(contributors, 2);
	const row3 = shuffle(contributors, 3);

	return (
		<div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-karatasi">
			<div className="pindo absolute inset-x-0 top-0 text-jua" aria-hidden />
			<header className="relative z-10 mb-6 px-5 text-center sm:mb-10">
				<Link href="/" className="inline-flex items-center gap-2">
					<AppLogo size={30} />
					<span className="font-display text-2xl leading-none font-extrabold tracking-[-0.04em]">nuru</span>
				</Link>
				<h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.03em] sm:text-6xl">
					<span className="alama-jua">Wachangiaji</span>
				</h1>
				<p className="mt-3 text-foreground/75">
					Asanteni kwa kujenga Nuru pamoja.{contributors.length > 0 && ` (${contributors.length})`}
				</p>
			</header>
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

			<div className="pindo absolute inset-x-0 bottom-0 rotate-180 text-jua" aria-hidden />

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
