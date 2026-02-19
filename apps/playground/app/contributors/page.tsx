"use client";

import { useEffect, useState, useCallback } from "react";
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
      {/* Glow ring */}
      <div
        className="absolute -inset-1.5 rounded-2xl transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            "conic-gradient(from 0deg, rgba(0,180,216,0.5), transparent, rgba(0,180,216,0.5))",
          animation: hovered ? "spin 3s linear infinite" : "none",
        }}
      />
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
  // Duplicate list for seamless loop
  const items = [...contributors, ...contributors];

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, hsl(222.2, 84%, 4.9%), transparent)" }}
      />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, hsl(222.2, 84%, 4.9%), transparent)" }}
      />

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

// ─── Particle dots ───────────────────────────────────────────────────────────
function Particles() {
  const [dots, setDots] = useState<
    { id: number; x: number; y: number; size: number; dur: number; delay: number; opacity: number }[]
  >([]);

  useEffect(() => {
    setDots(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        dur: Math.random() * 30 + 20,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.4 + 0.05,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            background: `rgba(0, 180, 216, ${d.opacity})`,
            boxShadow: `0 0 ${d.size * 3}px rgba(0, 180, 216, ${d.opacity * 0.5})`,
            animation: `floatUp ${d.dur}s linear infinite`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    fetch("/contributors.json")
      .then((r) => r.json())
      .then((data: Contributor[]) => {
        setContributors(data);
        requestAnimationFrame(() => setLoaded(true));
      });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  }, []);

  // Split contributors into three rows
  const third = Math.ceil(contributors.length / 3);
  const row1 = contributors.slice(0, third);
  const row2 = contributors.slice(third, third * 2);
  const row3 = contributors.slice(third * 2);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center"
      style={{
        background: `
          radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(0,180,216,0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 0%, rgba(0,180,216,0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 100%, rgba(0,90,108,0.03) 0%, transparent 50%),
          hsl(222.2, 84%, 4.9%)
        `,
      }}
    >
      <Particles />

      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,180,216,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Cursor glow */}
      <div
        className="fixed pointer-events-none z-50 w-[400px] h-[400px] rounded-full"
        style={{
          left: `calc(${mousePos.x}% - 200px)`,
          top: `calc(${mousePos.y}% - 200px)`,
          background:
            "radial-gradient(circle, rgba(0,180,216,0.04) 0%, transparent 70%)",
          transition: "left 0.15s ease-out, top 0.15s ease-out",
        }}
      />

      {/* Slideshow */}
      <div
        className="relative z-10 w-full flex flex-col gap-2 sm:gap-4"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
      >
        {row1.length > 0 && (
          <MarqueeRow contributors={row1} direction="left" speed={30} />
        )}
        {row2.length > 0 && (
          <MarqueeRow contributors={row2} direction="right" speed={36} />
        )}
        {row3.length > 0 && (
          <MarqueeRow contributors={row3} direction="left" speed={33} />
        )}
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(15px);
            opacity: 0;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
