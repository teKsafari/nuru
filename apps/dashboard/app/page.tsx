import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import { redirect } from "next/navigation";
import { Button, Card, CardHeader, CardTitle, CardContent, AppLogo } from "@nuru/ui";
import { signInAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
	const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

	if (isAuthenticated && claims) {
		const roles = (claims.roles as string[]) || [];
		console.log({claims});
		
		if (roles.includes("Educator") || roles.includes("Super Admin")) {
			redirect("/educator/modules");
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24 bg-muted/20">
			<Card className="w-[450px] shadow-xl border-t-4 border-t-primary">
				<CardHeader className="flex flex-col items-center pb-2">
					<AppLogo size={64} className="mb-4" />
					<CardTitle className="text-2xl font-bold">Nuru Educator Dashboard</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-6 text-center">
					<p className="text-muted-foreground">
						Empowering educators to build and share interactive programming curricula.
					</p>
					
					<div className="flex flex-col gap-3">
						<form action={signInAction}>
							<Button size="lg" className="w-full font-bold">
								Sign In to Dashboard
							</Button>
						</form>
						<p className="text-xs text-muted-foreground">
							Don't have an account? Contact your organization administrator.
						</p>
					</div>

					<div className="pt-6 border-t flex justify-center gap-4 text-sm text-muted-foreground">
						<a href="https://nuruprogramming.org" className="hover:text-primary transition-colors">Website</a>
						<span>•</span>
						<a href="https://nuruprogramming.org/docs" className="hover:text-primary transition-colors">Documentation</a>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
