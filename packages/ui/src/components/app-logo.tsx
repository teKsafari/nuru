"use client"

import React, { useId } from 'react'

interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 32, className = '' }: AppLogoProps) {
  const gradientId = useId();
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="Nuru Logo"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`fireGradient-${gradientId}`} x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff9900" />
          <stop offset="1" stopColor="#00b4d8" />
        </linearGradient>
      </defs>
    <g transform="translate(0,2) scale(1,0.85)">
      <path d="M16 12C16 12 23 17 23 22C23 27 19 30 16 30C13 30 9 27 9 22C9 17 16 12 16 12Z" fill="#00b4d8" />
      <path d="M16 2C16 2 19 6 19 8C19 10 16 12 16 12C16 12 13 10 13 8C13 6 16 2 16 2Z" fill="#ff9900" />
      <path d="M16 5C16 5 21 10 22 13C23 16 18 22 16 25C14 22 9 16 10 13C11 10 16 5 16 5Z" fill={`url(#fireGradient-${gradientId})`} />
      <path d="M16 17C19 19 21 22 19 25C18 27 17 28 16 28C15 28 14 27 13 25C11 22 13 19 16 17Z" fill="#fff" opacity="0.3" />
    </g>
    {/* Flat base platform */}
    <ellipse
      cx="16"
      cy="30.5"
      rx="10"
      ry="2"
      fill="#222"
      opacity="0.25"
    />
    </svg>
  )
}
