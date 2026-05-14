import { ServicesPath, type Service } from "@/components/ServicesPath"

const GRADIENT_COLORS = ["#000000", "#1A3EBF", "#B6FD6E", "#FFFFFF", "#1A3EBF", "#F43791", "#000000"]
const TEXT_COLORS = ["#FFFFFF", "#1A3EBF", "#B6FD6E", "#FFFFFF", "#1A3EBF", "#F43791", "#FFFFFF"]

const list1: Service[] = [
  {
    label: "Front End Design",
    description:
      "Thoughtfully designed, responsive interfaces that balance visual clarity, usability, and performance across every screen size.",
    trigger: 0.13,
  },
  {
    label: "Interactive Animation",
    description:
      "Custom motion and interactive experiences that bring digital products to life through purposeful, engaging animation.",
    trigger: 0.18,
  },
  {
    label: "Content Management",
    description:
      "Flexible content management systems that make it easy for teams to update, organize, and scale website content.",
    trigger: 0.24,
  },
  {
    label: "App Development",
    description:
      "Custom web applications built for speed, reliability, and seamless user experiences across modern devices and platforms.",
    trigger: 0.31,
  },
  {
    label: "Back End Integrations",
    description:
      "Reliable integrations connecting websites and applications with third-party platforms, APIs, databases, and business systems.",
    trigger: 0.36,
  },
]

const list2: Service[] = [
  {
    label: "Monthly Maintenance",
    description:
      "Website maintenance focused on security, performance, updates, backups, and ongoing support to keep your site stable, fast, and running smoothly.",
    trigger: 0.58,
  },
  {
    label: "Website Migrations",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    trigger: 0.63,
  },
  {
    label: "Creative Coding",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    trigger: 0.7,
  },
  {
    label: "Performance Analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    trigger: 0.77,
  },
  {
    placeholder: true,
    trigger: 0,
  },
]

export default function InteractiveServices() {
  return <ServicesPath list1={list1} list2={list2} gradientColors={GRADIENT_COLORS} textColors={TEXT_COLORS} />
}
