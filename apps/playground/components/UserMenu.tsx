"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";

import { signInAction, signOutAction } from "@/app/actions/auth";
import { AuthContext } from "@/components/providers/auth-provider";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@nuru/ui/components/avatar";
import { Button } from "@nuru/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@nuru/ui/components/dropdown-menu";
import { User, Sprout, UserCogIcon, LogOutIcon, LogInIcon } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

type UserMenuLabels = { signIn: string; signOut: string; account: string; user: string };

const defaultLabels: UserMenuLabels = { signIn: "Ingia", signOut: "Toka", account: "Akaunti yako", user: "Mtumiaji" };

export default function UserMenu({ labels = defaultLabels }: { labels?: UserMenuLabels }) {
	const { isAuthenticated, claims } = useContext(AuthContext);

	const [postAuthRedirectUri, setRedirectUri] = useState("");

	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (typeof window !== "undefined") {
			setRedirectUri(window.location.href);
		}
	}, [pathname, searchParams]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label={isAuthenticated && claims ? claims.name : labels.user}
					className="size-9 overflow-hidden rounded-full border-2 border-mstari bg-card p-0 hover:bg-karatasi-2"
				>
					{isAuthenticated && claims ? (
						<Avatar className="size-full">
							<AvatarImage src={claims.picture || undefined} />
							<AvatarFallback>
								{claims.name
									.split(" ")
									.map((el) => el[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
					) : (
						<User className="size-[18px]" aria-hidden />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56 rounded-lg border-2 border-mstari bg-card p-1.5 shadow-kivuli">
				{isAuthenticated && claims ? (
					<>
						<DropdownMenuLabel className="flex flex-col">
							{claims.name}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
					</>
				) : null}

				<DropdownMenuItem asChild className="mb-1 rounded-lg">
					<a
						href="https://github.com/NuruProgramming"
						target="_blank"
						rel="noopener noreferrer"
						className="flex cursor-pointer items-center gap-2 py-2"
					>
						<SiGithub className="h-4 w-4" />
						<span>GitHub</span>
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem asChild className="mb-1 rounded-lg">
					<a
						href="https://teksafari.org"
						target="_blank"
						rel="noopener noreferrer"
						className="flex cursor-pointer items-center gap-2 py-2"
					>
						<Sprout className="h-4 w-4 text-mwani" />
						<span>teKsafari</span>
					</a>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				{isAuthenticated ? (
					<>
						<DropdownMenuItem asChild className="rounded-md">
							<a href="https://id.teksafari.org/account/security" target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-2 py-2">
								<UserCogIcon size={16} />
								{labels.account}
							</a>
						</DropdownMenuItem>
						<form action={signOutAction}>
							<input
								type="text"
								className="hidden"
								name="redirectURI"
								readOnly
								value={postAuthRedirectUri}
							/>
							<Button
								className="h-auto w-full justify-start rounded-lg px-2 py-1.5 font-normal"
								type="submit"
								variant="ghost"
							>
								<LogOutIcon size={16} />
								{labels.signOut}
							</Button>
						</form>
					</>
				) : (
					<form action={signInAction}>
						<input
							type="text"
							className="hidden"
							name="postRedirectUri"
							readOnly
							value={postAuthRedirectUri}
						/>
						<Button
							className="h-auto w-full justify-start rounded-lg px-2 py-1.5 font-normal"
							type="submit"
							variant="ghost"
						>
							<LogInIcon size={16} />
							{labels.signIn}
						</Button>
					</form>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
