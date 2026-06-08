import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@nuru/ui";

import Link from "next/link";

import { getAllPublicModules } from "@/app/actions/modules";
import { ShoppingBag, BookOpen, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
	const modules = await getAllPublicModules();

	return (
		<div className="container mx-auto py-10 space-y-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<ShoppingBag className="h-8 w-8 text-primary" />
					Nuru Marketplace
				</h1>
				<p className="text-muted-foreground text-lg">
					Discover and import interactive programming modules created by the community.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{modules.length === 0 ? (
					<div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
						<BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-medium">No public modules yet</h3>
						<p className="text-muted-foreground mt-2">
							Be the first to publish a module to the marketplace!
						</p>
					</div>
				) : (
					modules.map((module) => (
						<Card key={module.id} className="group hover:shadow-md transition-all overflow-hidden flex flex-col border-muted/60">
							<CardHeader className="pb-4 border-b bg-muted/10">
								<div className="flex justify-between items-start">
									<CardTitle className="text-xl group-hover:text-primary transition-colors">
										{typeof module.title === 'string' ? module.title : (module.title as any).en}
									</CardTitle>
									<Badge className="capitalize">{module.difficulty}</Badge>
								</div>
							</CardHeader>
							<CardContent className="flex-1 py-6 flex flex-col">
								<p className="text-muted-foreground line-clamp-3 mb-6">
									Interactive module designed for {module.difficulty} learners. 
									Includes customized {module.executorType} environment.
								</p>
								
								<div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
									<span className="flex items-center gap-1">
										<BookOpen className="h-4 w-4" />
										Interactive
									</span>
								</div>

								<div className="mt-auto flex gap-3">
									<Button className="flex-1" asChild>
										<Link href={`/marketplace/${module.id}`}>
											View Details
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
