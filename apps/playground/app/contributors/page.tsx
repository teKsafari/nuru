"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Contributor {
  username: string;
  profile_picture: string;
  profile_url: string;
}

// ─── Single Avatar ───────────────────────────────────────────────────────────
function Avatar({ contributor }: { contributor: Contributor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={contributor.profile_url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative shrink-0 group flex flex-col items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-3 rounded-2xl transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          background: "radial-gradient(circle, rgba(0,180,216,0.15) 0%, transparent 70%)",
        }}
      />
      {/* Image */}
      <div
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all duration-500"
        style={{
          border: hovered
            ? "2px solid rgba(0, 180, 216, 0.6)"
            : "2px solid rgba(255, 255, 255, 0.06)",
          boxShadow: hovered
            ? "0 0 24px rgba(0, 180, 216, 0.25)"
            : "none",
        }}
      >
        <Image
          src={contributor.profile_picture}
          alt={contributor.username}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="64px"
        />
      </div>
      {/* Name tag */}
      <span
        className="text-[9px] sm:text-[10px] tracking-wider truncate max-w-[72px] text-center transition-colors duration-300"
        style={{
          color: hovered ? "rgba(0, 180, 216, 0.9)" : "rgba(255, 255, 255, 0.35)",
        }}
      >
        {contributor.username}
      </span>
    </a>
  );
}

// ─── Marquee Row ─────────────────────────────────────────────────────────────
function MarqueeRow({
  contributors,
  direction,
  speed,
}: {
  contributors: Contributor[];
  direction: "left" | "right";
  speed: number;
}) {
  // Repeat 3x — animation shifts by 1/3 (33.333%) for seamless circular loop
  const items = [...contributors, ...contributors, ...contributors];

  return (
    <div className="relative w-full overflow-hidden py-4">
      <div
        className="flex items-start gap-6 sm:gap-10 w-max"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {items.map((c, i) => (
          <Avatar key={`${c.username}-${i}`} contributor={c} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/contributors.json")
      .then((r) => r.json())
      .then((data: Contributor[]) => {
        setContributors(data);
        requestAnimationFrame(() => setLoaded(true));
      });
  }, []);

  // Shuffle a copy of the array using a seeded approach
  // Each row gets a differently shuffled version of the full list
  const shuffle = (arr: Contributor[], seed: number): Contributor[] => {
    const shuffled = [...arr];
    let s = seed;
    for (let i = shuffled.length - 1; i > 0; i--) {
      s = (s * 16807 + 0) % 2147483647;
      const j = s % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const row1 = shuffle(contributors, 1);
  const row2 = shuffle(contributors, 2);
  const row3 = shuffle(contributors, 3);

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center"
      style={{
        background: "hsl(222.2, 84%, 4.9%)",
      }}
    >

      {/* Slideshow */}
      <div
        className="relative z-10 w-full flex flex-col gap-2 sm:gap-4"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
      >
        {row1.length > 0 && (
          <MarqueeRow contributors={row1} direction="left" speed={79} />
        )}
        {row2.length > 0 && (
          <MarqueeRow contributors={row2} direction="right" speed={66} />
        )}
        {row3.length > 0 && (
          <MarqueeRow contributors={row3} direction="left" speed={28} />
        )}
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }


      `}</style>
    </div>
  );
}
