"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Container from "@/components/Container"
import Logo from "@/components/Logo"
import Row from "@/components/Row"
import Column from "@/components/Column"
import { FluidSim } from "@/lib/FluidSim"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const FluidSimAPI = useRef<{ multipleSplats: (amount: number) => void } | null>(null)

  useGSAP(() => {
    if (!footerRef.current || !canvasRef.current) {
      return
    }

    FluidSimAPI.current = FluidSim(canvasRef.current, footerRef.current)

    ScrollTrigger.create({
      trigger: canvasRef.current,
      start: "top bottom",
      onEnter: () => {
        FluidSimAPI.current && FluidSimAPI.current.multipleSplats(10)
      },
    })
  })

  return (
    <footer ref={footerRef} className="py-(--spacing-lg) relative">
      <canvas ref={canvasRef} className="absolute inset-0 size-full"></canvas>
      <Container className="relative">
        <p className="text-h2" data-lag="0.2">
          Have a project in mind? <br />
          <a className="font-medium" href="mailto:hello@simplecreature.us">
            hello@simplecreature.us
          </a>
        </p>
        <div data-lag="0.4">
          <Logo className="my-(--spacing-lg) w-full text-white" />
        </div>
        <Row className="items-end">
          <Column sm="6">
            <p data-lag="0.2">
              47 Maple Street, Suite 220
              <br />
              Burlington, Vermont 05401
            </p>
          </Column>
          <Column sm="6">
            <ul className="flex gap-8 sm:justify-end" data-lag="0.2">
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
          </Column>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
