import { Bricolage_Grotesque, Lexend, JetBrains_Mono } from "next/font/google";

// Type stack. Display: Bricolage Grotesque. Body: Lexend, designed to
// reduce visual stress for new readers. Code: JetBrains Mono.
const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-bricolage",
});

const lexend = Lexend({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-lexend",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "700"],
	variable: "--font-jetbrains-mono",
});

export const appFonts = [bricolage.variable, lexend.variable, jetbrainsMono.variable].join(" ");
