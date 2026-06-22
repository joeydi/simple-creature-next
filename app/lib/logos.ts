import type { StaticImageData } from "next/image"

import astonMartin from "@/images/logos/aston-martin.svg"
import arizonaStateUninversity from "@/images/logos/arizona-state-uninversity.svg"
import capitalOne from "@/images/logos/capital-one.svg"
import dell from "@/images/logos/dell.svg"
import fantasy from "@/images/logos/fantasy.svg"
import ford from "@/images/logos/ford.svg"
import generalMills from "@/images/logos/general-mills.svg"
import huge from "@/images/logos/huge.svg"
import keurig from "@/images/logos/keurig.svg"
import lincoln from "@/images/logos/lincoln.svg"
import mamava from "@/images/logos/mamava.svg"
import meta from "@/images/logos/meta.svg"
import nickelodeon from "@/images/logos/nickelodeon.svg"
import nissan from "@/images/logos/nissan.svg"
import nokianTyres from "@/images/logos/nokian-tyres.svg"
import olg from "@/images/logos/olg.svg"
import onePercent from "@/images/logos/one-percent.svg"
import popularScience from "@/images/logos/popular-science.svg"
import principal from "@/images/logos/principal.svg"
import ramble from "@/images/logos/ramble.svg"
import razorfish from "@/images/logos/razorfish.svg"
import sandwich from "@/images/logos/sandwich.svg"
import zeiss from "@/images/logos/zeiss.svg"

export interface LogoEntry {
  logo: StaticImageData
  link?: string
  title?: string
}

export const logos: LogoEntry[] = [
  { logo: astonMartin, title: "Aston Martin" },
  { logo: arizonaStateUninversity, title: "Arizona State University" },
  { logo: capitalOne, title: "CapitalOne" },
  { logo: dell, title: "Dell" },
  { logo: fantasy, title: "Fantasy" },
  { logo: ford, title: "Ford" },
  { logo: generalMills, link: "/work/general-mills-chefs-on-the-line", title: "General Mills Chefs on the Line" },
  { logo: huge, title: "Huge" },
  { logo: keurig, title: "Keurig" },
  { logo: lincoln, title: "Lincoln" },
  { logo: mamava, link: "/work/mamava-product-tour", title: "Mamava Product Tour" },
  { logo: meta, link: "/work/meta", title: "Meta Reels" },
  { logo: nickelodeon, title: "Nickelodeon" },
  { logo: nissan, link: "/work/nissan-ims-concept-car", title: "Nissan IMs Concept Car" },
  { logo: nokianTyres, title: "Nokian Tyres" },
  { logo: olg, link: "/work/olg-level-up" },
  { logo: onePercent, link: "/work/1-percent-for-the-planet", title: "OLG Level Up" },
  { logo: popularScience, link: "/work/popular-science-series", title: "Popular Science Series" },
  { logo: principal, title: "Principal" },
  { logo: ramble, title: "Ramble Maps" },
  { logo: razorfish, title: "Razorfish" },
  { logo: sandwich, link: "/work/what-is-0x", title: "Sandwich What is 0x?" },
  { logo: zeiss, link: "/work/zeiss-neurology", title: "Zeiss Neurology" },
]
