"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Check, ChevronRight, Menu, X } from "lucide-react";

import { cn } from "@nuru/ui/lib/utils";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@nuru/ui/components/drawer";
import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { useNavItems, Wordmark } from "@/components/tovuti/nav";
import { ThemeToggle } from "@/components/tovuti/theme-toggle";
import { moduleHref, rangiYaModuli } from "@/components/lessons-map/rangi";
import { useLocalProgress } from "@/components/lessons-map/progress-hook";

interface LessonsDrawerProps {
	modules?: { id: string; slug: string; title: { sw: string; en: string } }[];
	lang: "en" | "sw";
	dict: Dictionary;
}

// The phone menu: a bottom sheet (easy to reach with a thumb) with the main
// pages, the lesson modules with this device's progress, and the theme switch.
export function LessonsDrawer({ modules = [], lang, dict }: LessonsDrawerProps) {
	const [open, setOpen] = React.useState(false);
	const pathname = usePathname() ?? "";
	const nav = useNavItems(lang, dict);
	const progress = useLocalProgress(modules.map((m) => m.id));
	const close = () => setOpen(false);

	return (
		<Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
			<DrawerTrigger asChild>
				<button
					type="button"
					className="flex h-9 items-center gap-1.5 rounded-md border-2 border-mstari bg-card px-2.5 text-sm font-semibold transition-[transform,box-shadow] duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-kivuli-sm"
					aria-label={dict.header.menu}
				>
					<Menu className="size-4" aria-hidden />
					<span className="hidden sm:inline">{dict.header.menu}</span>
				</button>
			</DrawerTrigger>
			<DrawerContent className="max-h-[92dvh] rounded-t-[18px] border-2 border-b-0 border-mstari bg-karatasi">
				<div className="mx-auto flex w-full max-w-xl flex-col overflow-hidden">
					<div className="flex items-center justify-between px-4 pt-3 pb-2">
						<DrawerTitle asChild>
							<div>
								<Wordmark size={26} />
							</div>
						</DrawerTitle>
						<DrawerDescription className="sr-only">{dict.mobileMenu.navigation}</DrawerDescription>
						<DrawerClose asChild>
							<button
								type="button"
								aria-label={dict.header.closeMenu}
								className="flex size-10 items-center justify-center rounded-md border-2 border-mstari bg-card"
							>
								<X className="size-5" aria-hidden />
							</button>
						</DrawerClose>
					</div>

					<div className="overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
						<p className="lebo mt-2 mb-2 text-muted-foreground">{dict.mobileMenu.navigation}</p>
						<nav aria-label={dict.header.mainNav} className="grid grid-cols-2 gap-2.5">
							{nav.map((item, i) => (
								<Link
									key={item.key}
									href={item.href}
									onClick={close}
									aria-current={item.active ? "page" : undefined}
									className={cn(
										"bonyeza flex min-h-[4.5rem] flex-col justify-between gap-1 rounded-lg border-2 border-mstari p-3 shadow-kivuli-sm",
										item.active ? "bg-jua text-wino" : "bg-card",
										i === nav.length - 1 && nav.length % 2 === 1 && "col-span-2",
									)}
								>
									<span className="flex items-center gap-2 font-display text-lg leading-none font-bold">
										<item.icon className="size-[18px]" aria-hidden />
										{item.label}
									</span>
									<span className={cn("text-xs", item.active ? "text-wino/75" : "text-muted-foreground")}>
										{dict.mobileMenu.hint[item.key]}
									</span>
								</Link>
							))}
						</nav>

						{modules.length > 0 && (
							<>
								<p className="lebo mt-6 mb-2 text-muted-foreground">{dict.lessonsDrawer.title}</p>
								<ul className="flex flex-col gap-2">
									{modules.map((module, index) => {
										const href = moduleHref(lang, module.slug);
										const active = pathname.startsWith(href);
										const done = progress?.[module.id]?.size ?? 0;
										const rangi = rangiYaModuli(index);
										return (
											<li key={module.id}>
												<Link
													href={href}
													onClick={close}
													aria-current={active ? "page" : undefined}
													className={cn(
														"flex items-center gap-3 rounded-lg border-2 border-mstari bg-card p-2.5 pr-3 transition-colors hover:bg-karatasi-2",
														active && "shadow-kivuli-sm",
													)}
												>
													<span
														className={cn(
															"flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-mstari font-display text-base font-extrabold",
															rangi.bg,
															rangi.fg,
														)}
													>
														{index + 1}
													</span>
													<span className="min-w-0 flex-1">
														<span className="block truncate text-sm font-semibold">{module.title[lang] || module.title.sw}</span>
														{done > 0 && (
															<span className="flex items-center gap-1 text-xs text-muted-foreground">
																<Check className="size-3 text-mwani" aria-hidden />
																{done} {dict.mobileMenu.lessonsDone}
															</span>
														)}
													</span>
													<ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
												</Link>
											</li>
										);
									})}
								</ul>
							</>
						)}

						<div className="mt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-mstari/40 pt-4">
							<ThemeToggle
								withLabel
								labels={{ mchana: dict.header.mchana, usiku: dict.header.usiku, toUsiku: dict.header.toUsiku, toMchana: dict.header.toMchana }}
							/>
							<a href="https://teksafari.org" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-muted-foreground hover:text-foreground">
								{dict.mobileMenu.builtWith}
							</a>
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
