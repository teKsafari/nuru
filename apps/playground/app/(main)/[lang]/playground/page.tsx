import { redirect } from "next/navigation";

// The old playground route now lives at /uwanja. Share links keep their #hash
// because the browser carries the fragment across the redirect.
export default async function PlaygroundRedirect({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params;
	redirect(`/${lang}/uwanja`);
}
