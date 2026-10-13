import { getAuth, getAuthContextFromClaims } from "@/lib/auth.server";
import AuthProvider from "@/components/providers/auth-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, claims } = await getAuth();

	if (!isAuthenticated || !claims) {
		redirect("/");
	}

	const roles = (claims.roles as string[]) || [];
	const isEducator = roles.includes("Educator") || roles.includes("Super Admin");

	if (!isEducator) {
		redirect("/");
	}

	const authContext = getAuthContextFromClaims(isAuthenticated, claims);

	return (
		<AuthProvider value={authContext}>
			<div className="flex h-dvh overflow-hidden bg-karatasi">
				<Sidebar />
				<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
					<main className="flex-1 overflow-y-auto">
						<Header />
						<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-10">{children}</div>
					</main>
				</div>
			</div>
		</AuthProvider>
	);
}
