"use client"

import { useState } from "react"
import Image from "next/image"
import JoeBG from "@/../public/about-jd.png"
import Joe from "@/images/props/lego-joe.png"
import PurpleBackground from "@/../public/about-bg-purple.jpg"
import styles from "./AboutJoe.module.scss"

import Cup1 from "@/images/props/cup-1.png"
import Cup2 from "@/images/props/cup-2.png"
import Laptop1 from "@/images/props/laptop-1.png"
import Laptop2 from "@/images/props/laptop-2.png"
import Laptop3 from "@/images/props/laptop-3.png"
import Laptop4 from "@/images/props/laptop-4.png"
import Mug1 from "@/images/props/mug-1.png"
import Mug2 from "@/images/props/mug-2.png"

export default function AboutJoe() {
  const [rotation, setRotation] = useState(0)

  return (
    <>
      <Image className="absolute inset-0 w-full" src={PurpleBackground} quality={90} alt="" />
      <div
        className="absolute inset-0 w-full opacity-20 mix-blend-darken"
        style={{ backgroundImage: "url(/noise.gif)" }}
      ></div>
      {/* <Image className="absolute inset-0 w-full" src={JoeBG} alt="" /> */}
      <input
        style={{
          position: "absolute",
          zIndex: 10,
        }}
        type="range"
        min={-45}
        max={45}
        value={rotation}
        onChange={(e) => setRotation(Number(e.target.value))}
      />
      <div className={styles.scene}>
        <div className={styles.props} style={{ transform: `rotateY(${rotation}deg)` }}>
          <Image
            style={{ rotate: `y ${-rotation}deg`, translate: `${-rotation * 0.1}%` }}
            className="w-full"
            src={Joe}
            alt=""
          />
          <Image style={{ rotate: `y ${-rotation}deg` }} className={styles.cup1} src={Cup1} alt="" />
          <Image style={{ rotate: `y ${-rotation}deg` }} className={styles.cup2} src={Cup2} alt="" />
          <Image style={{ rotate: `y ${-rotation}deg` }} className={styles.laptop1} src={Laptop1} alt="" />
          <Image style={{ rotate: `y ${-rotation}deg` }} className={styles.laptop2} src={Laptop2} alt="" />
          <Image style={{ rotate: `y ${-rotation}deg` }} className={styles.laptop3} src={Laptop3} alt="" />
          <Image style={{ rotate: `y ${-rotation}deg` }} className={styles.laptop4} src={Laptop4} alt="" />
          <Image style={{ rotate: `y ${-rotation}deg` }} className={styles.mug1} src={Mug1} alt="" />
          <Image style={{ rotate: `y ${-rotation}deg` }} className={styles.mug2} src={Mug2} alt="" />
        </div>
      </div>
    </>
  )
}
