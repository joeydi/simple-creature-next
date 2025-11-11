"use client"

import { useMenu } from "@/contexts/MenuContext"
import { cn } from "@/lib/utils"

export default function FooterContent() {
  const { isActive } = useMenu()

  return (
    <div className="text-white">
      <p
        className={cn(
          "left-(--container-padding) text-h2 duration-600 fixed top-10 transition-all ease-out",
          isActive ? "delay-250 translate-none opacity-100 blur-none" : "-translate-y-24 opacity-0 blur-md delay-0",
        )}
      >
        <a className="font-medium" href="mailto:hello@simplecreature.us">
          hello@simplecreature.us
        </a>
      </p>
      <p
        className={cn(
          "left-(--container-padding) duration-600 fixed bottom-10 font-medium text-white transition-all ease-out",
          isActive ? "delay-250 translate-none opacity-100 blur-none" : "translate-y-24 opacity-0 blur-md delay-0",
        )}
      >
        47 Maple Street, Suite 220
        <br />
        Burlington, Vermont 05401
      </p>
      <ul
        className={cn(
          "right-(--container-padding) duration-600 fixed bottom-10 flex gap-8 font-medium text-white transition-all ease-out sm:justify-end",
          isActive ? "delay-250 translate-none opacity-100 blur-none" : "translate-y-24 opacity-0 blur-md delay-0",
        )}
      >
        <li>
          <a href="https://x.com/_simplecreature" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/simple.creature/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/company/simplecreature/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
      </ul>
    </div>
  )
}
