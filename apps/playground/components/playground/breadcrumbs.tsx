import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbsProps {
  items: {
    label: string
    href?: string
    current?: boolean
  }[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-xs font-medium text-muted-foreground mb-4", className)}>
      <Link 
        href="/" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-3 w-3 mr-1" />
        <span className="sr-only">Nyumbani</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
          {item.href && !item.current ? (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] sm:max-w-[150px]"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              "whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] sm:max-w-[150px]",
              item.current ? "text-foreground font-bold" : ""
            )}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
