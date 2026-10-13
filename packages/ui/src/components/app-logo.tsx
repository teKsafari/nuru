import React from "react";

interface AppLogoProps {
	size?: number;
	className?: string;
	/** Draw the outline in the current text colour instead of ink. */
	outline?: "ink" | "current";
}

// The Nuru sun: a jua disc ringed with eight kanga-border triangles, outlined
// in ink like a sticker. Nuru means light.
export const SUN_RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

export function AppLogo({ size = 32, className = "", outline = "ink" }: AppLogoProps) {
	const stroke = outline === "ink" ? "#15120f" : "currentColor";
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 32 32"
			fill="none"
			className={className}
			role="img"
			aria-label="Nuru"
			style={{ display: "block" }}
		>
			<g stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" fill="#ffc93c">
				{SUN_RAYS.map((deg) => (
					<path key={deg} d="M12.9 7 L16 0.9 L19.1 7 Z" transform={`rotate(${deg} 16 16)`} />
				))}
				<circle cx="16" cy="16" r="7.2" />
			</g>
			<path d="M12.5 15.4 a3.6 3.6 0 0 1 3.5 -3.2" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
		</svg>
	);
}
