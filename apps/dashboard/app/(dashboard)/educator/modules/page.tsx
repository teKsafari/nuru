import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { getEducatorModules, deleteModule } from "@/app/actions/modules";
import { getServerDict } from "@/lib/lang";
import { PageHead, EmptyState } from "@/components/kanga/page-head";
import { ConfirmDelete } from "@/components/kanga/confirm-delete";
import { ModuleCard } from "@/components/modules/module-card";

export const dynamic = "force-dynamic";

export default async function EducatorModulesPage() {
	const [modules, { t, lang }] = await Promise.all([getEducatorModules(), getServerDict()]);

	return (
		<div className="space-y-8 pb-12">
			<PageHead
				title={t.modules.title}
				lead={t.modules.lead}
				actions={
					<Button asChild size="lg">
						<Link href="/educator/modules/create">
							<Plus />
							{t.modules.create}
						</Link>
					</Button>
				}
			/>

			{modules.length === 0 ? (
				<EmptyState
					icon={<BookOpen />}
					title={t.modules.empty}
					body={t.modules.emptyBody}
					methali={t.app.methaliEmpty}
					action={
						<Button asChild variant="outline">
							<Link href="/educator/modules/create">
								<Plus />
								{t.modules.create}
							</Link>
						</Button>
					}
				/>
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
					{modules.map((module, i) => (
						<ModuleCard
							key={module.id}
							module={module}
							index={i}
							href={`/educator/modules/${module.id}`}
							t={t}
							lang={lang}
							footer={<ConfirmDelete action={deleteModule.bind(null, module.id)} label={t.modules.delete} confirmLabel={t.modules.confirmDelete} />}
						/>
					))}
				</div>
			)}
		</div>
	);
}
