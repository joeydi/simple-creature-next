import Image from "next/image"
import James from "@/../public/about-jk.png"
import GreenBackground from "@/../public/about-bg-green.jpg"

export default function AboutJoe() {
  return (
    <>
      <Image className="absolute inset-0 w-full" src={GreenBackground} quality={90} alt="" />
      <div
        className="absolute inset-0 w-full opacity-20 mix-blend-darken"
        style={{ backgroundImage: "url(/noise.gif)" }}
      ></div>
      <Image className="absolute inset-0 w-full" src={James} alt="" />
    </>
  )
}
