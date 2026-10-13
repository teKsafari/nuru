import Link from "next/link";
import { Plus, School } from "lucide-react";

import { Button } from "@nuru/ui/components/button";
import { listAssignableModules, listMadarasa } from "@/app/actions/madarasa";
import { getServerDict } from "@/lib/lang";
import { requireEducator } from "@/lib/permissions";
import { PageHead, EmptyState } from "@/components/shared/page-head";
import { CreateDarasaForm } from "@/components/madarasa/create-darasa-form";
import { DarasaCard } from "@/components/madarasa/darasa-card";
import { madarasaStrings } from "@/components/madarasa/strings";

export const dynamic = "force-dynamic";

export default async function MadarasaPage() {
	const [me, madarasa, modules, { t, lang }] = await Promise.all([requireEducator(), listMadarasa(), listAssignableModules(), getServerDict()]);
	const s = madarasaStrings(lang);
	const othersVisible = me.isSuperAdmin && madarasa.some((d) => !d.isMine);

	return (
		<div className="space-y-8 pb-12">
			<PageHead
				eyebrow={s.eyebrow}
				title={othersVisible ? s.titleAll : s.title}
				lead={s.lead}
				actions={
					<Button asChild size="lg" className="lg:hidden">
						<Link href="#fungua">
							<Plus />
							{s.create}
						</Link>
					</Button>
				}
			/>

			<div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
				<section aria-label={s.title}>
					{madarasa.length === 0 ? (
						<EmptyState icon={<School />} title={s.empty} body={s.emptyBody} />
					) : (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{madarasa.map((d, i) => (
								<DarasaCard key={d.id} d={d} index={i} s={s} showTeacher={othersVisible} />
							))}
						</div>
					)}
				</section>
				<aside className="lg:sticky lg:top-6">
					<CreateDarasaForm modules={modules} />
				</aside>
			</div>
		</div>
	);
}
