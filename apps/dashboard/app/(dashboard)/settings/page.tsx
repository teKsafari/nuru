import { ExternalLink, Languages, Palette, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@nuru/ui/components/button";
import { getAuth } from "@/lib/auth.server";
import { getServerDict } from "@/lib/lang";
import { PageHead } from "@/components/shared/page-head";
import { LangToggle, ThemeToggle } from "@/components/layout/toggles";

function Panel({ icon, title, body, children }: { icon: ReactNode; title: string; body: string; children: ReactNode }) {
	return (
		<section className="kadi flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
			<span className="flex size-12 shrink-0 items-center justify-center rounded-md border-2 border-mstari bg-jua text-[#15120f] [&_svg]:size-6">{icon}</span>
			<div className="min-w-0 flex-1">
				<h2 className="font-display text-lg font-bold">{title}</h2>
				<p className="text-sm text-muted-foreground">{body}</p>
			</div>
			<div className="shrink-0">{children}</div>
		</section>
	);
}

export default async function SettingsPage() {
	const [{ claims }, { t }] = await Promise.all([getAuth(), getServerDict()]);
	const roles = ((claims?.roles as string[] | undefined) ?? []).join(", ");

	return (
		<div className="max-w-3xl space-y-8 pb-12">
			<PageHead title={t.settings.title} lead={t.settings.lead} />
			<div className="space-y-5">
				<Panel icon={<Languages />} title={t.settings.langTitle} body={t.settings.langBody}>
					<LangToggle />
				</Panel>
				<Panel icon={<Palette />} title={t.settings.themeTitle} body={t.settings.themeBody}>
					<ThemeToggle withLabel />
				</Panel>
				<section className="kadi overflow-hidden">
					<div className="flex items-center gap-4 p-5">
						<span className="flex size-12 shrink-0 items-center justify-center rounded-md border-2 border-mstari bg-bahari text-white [&_svg]:size-6">
							<UserRound />
						</span>
						<div>
							<h2 className="font-display text-lg font-bold">{t.settings.accountTitle}</h2>
							<p className="text-sm text-muted-foreground">{t.settings.accountBody}</p>
						</div>
					</div>
					<dl className="divide-y-2 divide-dashed divide-mstari/20 border-t-2 border-mstari px-5">
						{[
							[t.settings.name, (claims?.name as string) || (claims?.username as string) || "-"],
							[t.settings.email, (claims?.email as string) || "-"],
							[t.settings.roles, roles || "-"],
						].map(([k, v]) => (
							<div key={k} className="flex flex-wrap items-center justify-between gap-2 py-3">
								<dt className="text-sm text-muted-foreground">{k}</dt>
								<dd className="font-semibold break-all">{v}</dd>
							</div>
						))}
					</dl>
					<div className="border-t-2 border-mstari bg-karatasi-2 px-5 py-3">
						<Button asChild variant="outline">
							<a href="https://id.teksafari.com/account/security" target="_blank" rel="noopener noreferrer">
								<ExternalLink />
								{t.settings.manageAccount}
							</a>
						</Button>
					</div>
				</section>
			</div>
		</div>
	);
}
