"use client"

import { cn } from "@/lib/utils"

type Props = React.ComponentProps<"canvas">

export default function Main({ children, className, ...rest }: Props) {
  return (
    <main className={cn(className)} {...rest}>
      {children}
    </main>
  )
}
