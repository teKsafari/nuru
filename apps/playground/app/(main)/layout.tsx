import { SiteHeader } from "@/components/header";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<SiteHeader />
			{/*
			h-0 sets an explicit height so that the height of the div is not derived from the height
			of child elements. flex-1 allows the div to grow to cover the rest of the available space.
			This creates a situation where this div is always h-[100dvh] - <SiteHeader height>
			regardless of the size of the child elements.
			*/}
			<div className="h-0 flex flex-col flex-1">{children}</div>
		</>
	);
}
