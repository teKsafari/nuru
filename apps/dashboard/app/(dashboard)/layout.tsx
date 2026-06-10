import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import { getAuthContextFromClaims } from "@/lib/auth.server";
import AuthProvider from "@/components/providers/auth-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

	if (!isAuthenticated || !claims) {
		redirect("/");
	}

	// Check for roles
	const roles = (claims.roles as string[]) || [];
	const isEducator = roles.includes("Educator") || roles.includes("Super Admin");

	if (!isEducator) {
		// If authenticated but not an educator, maybe redirect to a "not authorized" page or back home
		redirect("/");
	}

	const authContext = getAuthContextFromClaims(isAuthenticated, claims);

	return (
		<AuthProvider value={authContext}>
			<div className="flex h-screen overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
				<Sidebar />
				<div className="flex flex-1 flex-col overflow-hidden">
					{/* <Header /> */}
					<main className="flex-1 overflow-y-auto p-4 sm:p-8">
						<div className="mx-auto max-w-7xl">
							{children}
						</div>
					</main>
				</div>
			</div>
		</AuthProvider>
	);
}
