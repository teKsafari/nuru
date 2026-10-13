import { Store } from "lucide-react";
import { getAllPublicModules } from "@/app/actions/modules";
import { getServerDict } from "@/lib/lang";
import { PageHead, EmptyState } from "@/components/kanga/page-head";
import { ModuleCard } from "@/components/modules/module-card";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
	const [modules, { t, lang }] = await Promise.all([getAllPublicModules(), getServerDict()]);

	return (
		<div className="space-y-8 pb-12">
			<PageHead title={t.soko.title} lead={t.soko.lead} />
			{modules.length === 0 ? (
				<EmptyState icon={<Store />} title={t.soko.empty} body={t.soko.emptyBody} methali={t.app.methaliEmpty} />
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
					{modules.map((module, i) => (
						<ModuleCard key={module.id} module={module} index={i} href={`/marketplace/${module.id}`} t={t} lang={lang} showVisibility={false} />
					))}
				</div>
			)}
		</div>
	);
}
