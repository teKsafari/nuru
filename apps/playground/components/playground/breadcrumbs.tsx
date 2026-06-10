import * as React from "react"
import Link from "next/link"
import { ChevronRight, Folder } from "lucide-react"
import { cn } from "@nuru/ui/lib/utils";

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
    <nav className={cn("flex items-center space-x-1.5 text-[10px] font-mono tracking-widest text-muted-foreground mb-6 uppercase", className)}>
      <Link 
        href="/" 
        className="flex items-center hover:text-foreground transition-colors group"
      >
        <Folder className="h-3 w-3 mr-1.5 opacity-40 group-hover:opacity-100 transition-opacity" />
        <span className="sr-only">Nuru</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-2.5 w-2.5 shrink-0 opacity-20" />
          {item.href && !item.current ? (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-[180px] hover:underline decoration-border underline-offset-4"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              "whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-[180px]",
              item.current ? "text-primary font-black" : ""
            )}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
