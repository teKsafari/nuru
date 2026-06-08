"use server";

import { signIn, signOut } from "@logto/next/server-actions";

import { logtoConfig } from "@/app/logto";

export async function signInAction(formData: FormData) {
	let postRedirectUri = formData.get("postRedirectUri")?.toString();
	console.log({postRedirectUri})
	if (postRedirectUri) {
		await signIn(logtoConfig, {
			redirectUri: new URL("/callback", process.env.LOGTO_BASE_URL!.toString()),
			postRedirectUri: postRedirectUri,
		});
	}
	await signIn(logtoConfig);
}

export async function signOutAction(formData: FormData) {
	let redirectURI = formData.get("redirectURI")?.toString();
	console.log({redirectURI}, "logout")

	if (redirectURI) {
		await signOut(logtoConfig, redirectURI);
	}
	await signOut(logtoConfig);
}
