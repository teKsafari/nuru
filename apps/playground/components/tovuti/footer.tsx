import Link from "next/link";
import { Send } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

import { AppLogo } from "@nuru/ui/components/app-logo";
import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";

export const TELEGRAM_URL = "https://t.me/NuruProgrammingChat";
export const GITHUB_URL = "https://github.com/NuruProgramming/Nuru";
export const TEKSAFARI_URL = "https://teksafari.org";
export const dashboardUrl = () => process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

// The ink band that closes content pages. It stays dark in both modes.
export function SiteFooter({ lang, dict }: { lang: string; dict: Dictionary }) {
	const f = dict.tovuti.footer;
	const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
		{
			title: f.learn,
			links: [
				{ label: dict.header.masomo, href: `/${lang}/masomo` },
				{ label: dict.header.anza, href: `/${lang}/anza` },
				{ label: dict.header.uwanja, href: `/${lang}/uwanja` },
				{ label: dict.header.kamusi, href: `/${lang}/kamusi` },
			],
		},
		{
			title: f.teachers,
			links: [
				{ label: dict.header.darasa, href: `/${lang}/darasa` },
				{ label: f.teachersRoom, href: `${dashboardUrl()}/educator/madarasa`, external: true },
			],
		},
		{
			title: f.community,
			links: [
				{ label: "Telegram", href: TELEGRAM_URL, external: true },
				{ label: "GitHub", href: GITHUB_URL, external: true },
				{ label: dict.tovuti.landing.contributors.title, href: `/${lang}#wachangiaji` },
			],
		},
	];

	return (
		<footer className="bg-[#15120f] text-[#fff3d6]">
			<div className="pindo text-jua" aria-hidden />
			<div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
				<div>
					<Link href={`/${lang}`} className="inline-flex items-center gap-2.5">
						<AppLogo size={34} />
						<span className="font-display text-3xl leading-none font-extrabold tracking-[-0.04em]">nuru</span>
					</Link>
					<p className="mt-3 max-w-xs text-sm text-[#fff3d6]/70">{f.tagline}</p>
					<div className="mt-5 flex gap-2">
						<a
							href={TELEGRAM_URL}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Telegram"
							className="flex size-10 items-center justify-center rounded-md border-2 border-[#fff3d6]/30 transition-colors hover:border-jua hover:text-jua"
						>
							<Send className="size-4" aria-hidden />
						</a>
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
							className="flex size-10 items-center justify-center rounded-md border-2 border-[#fff3d6]/30 transition-colors hover:border-jua hover:text-jua"
						>
							<SiGithub className="size-4" aria-hidden />
						</a>
					</div>
				</div>
				{columns.map((col) => (
					<nav key={col.title} aria-label={col.title}>
						<p className="lebo mb-3 text-jua">{col.title}</p>
						<ul className="space-y-2 text-sm">
							{col.links.map((link) => (
								<li key={link.href}>
									{link.external ? (
										<a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[#fff3d6]/80 hover:text-jua">
											{link.label}
										</a>
									) : (
										<Link href={link.href} className="text-[#fff3d6]/80 hover:text-jua">
											{link.label}
										</Link>
									)}
								</li>
							))}
						</ul>
					</nav>
				))}
			</div>
			<div className="border-t-2 border-[#fff3d6]/10">
				<div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-[#fff3d6]/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
					<p>
						{f.madeBy}{" "}
						<a href={TEKSAFARI_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#fff3d6] underline decoration-jua decoration-2 underline-offset-4 hover:text-jua">
							teKsafari
						</a>
					</p>
					<p>{f.openSource}</p>
				</div>
			</div>
		</footer>
	);
}
