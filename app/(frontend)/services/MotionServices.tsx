import { ServicesPath, type Service } from "@/components/ServicesPath"

const GRADIENT_COLORS = ["#000000", "#FB374E", "#6EFDFD", "#FFFFFF", "#CC3B5A", "#EFF271", "#000000"]
const TEXT_COLORS = ["#FFFFFF", "#FB374E", "#6EFDFD", "#FFFFFF", "#CC3B5A", "#EFF271", "#FFFFFF"]

const list1: Service[] = [
  {
    label: "2D Motion Graphics",
    description:
      "Kinetic typography, stylized characters, broadcast graphics, and animated transitions tailored to elevate any brand.",
    trigger: 0.16,
  },
  {
    label: "3D Product Tours",
    description:
      "Photorealistic or stylized 3D visuals and camera animations crafted to elevate every detail of your product.",
    trigger: 0.21,
  },
  {
    label: "3D Dynamic Simulations",
    description:
      "Particles, smoke, fire, fluids, and soft body simulations that evolve and react naturally to create cinematic, immersive visuals.",
    trigger: 0.26,
  },
  {
    label: "Explainer Videos",
    description:
      "We immerse ourselves in your brand’s world, distilling complex concepts into visually compelling storylines that captivate your audience.",
    trigger: 0.31,
  },
  {
    label: "Social Media Content",
    description:
      "The art of capturing attention in an increasingly fast-paced digital landscape. We create bold, concise messaging that freezes thumbs and drives engagement.",
    trigger: 0.37,
  },
]

const list2: Service[] = [
  {
    label: "Interactive Components",
    description:
      "Not all buttons are created equal. Our interactive elements combine thoughtful motion, detail, and responsiveness to create memorable user experiences.",
    trigger: 0.1,
  },
  {
    label: "Photo-Real Rendering",
    description:
      "Photoreal product renderings crafted for any environment, atmosphere, or lighting style and tailored to fit your brand vision.",
    trigger: 0.58,
  },
  {
    label: "Live Action Integration",
    description:
      "Advanced camera tracking and cinematic lighting techniques seamlessly integrate live actors into richly imagined 3D environments.",
    trigger: 0.69,
  },
  {
    placeholder: true,
    trigger: 0.82,
  },
  {
    placeholder: true,
    trigger: 0.82,
  },
]

export default function MotionServices() {
  return <ServicesPath list1={list1} list2={list2} gradientColors={GRADIENT_COLORS} textColors={TEXT_COLORS} />
}
