import React from "react";

interface AppLogoProps {
	size?: number;
	className?: string;
	/** Draw the outline in the current text colour instead of ink. */
	outline?: "ink" | "current";
}

// The Nuru sun: a jua disc with eight short rays, outlined in ink.
// Nuru means light.
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
			<g stroke={stroke} strokeWidth="2.2" strokeLinecap="round">
				{SUN_RAYS.map((deg) => (
					<line key={deg} x1="16" y1="2.2" x2="16" y2="5.4" transform={`rotate(${deg} 16 16)`} />
				))}
			</g>
			<circle cx="16" cy="16" r="7.6" fill="#ffc93c" stroke={stroke} strokeWidth="1.4" />
			<path d="M12.3 15.4 a3.8 3.8 0 0 1 3.7 -3.4" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
		</svg>
	);
}
