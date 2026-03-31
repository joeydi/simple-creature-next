import Main from "@/components/main"
import AboutJoe from "../about-joe"
import AboutJames from "../about-james"

export default function AboutTest() {
  return (
    <Main className="pb-(--spacing-xxl)">
      <div className="my-(--spacing-xxl) relative aspect-video overflow-hidden">
        <AboutJoe />
      </div>
      <div className="my-(--spacing-xxl) relative aspect-video overflow-hidden">
        <AboutJames />
      </div>
    </Main>
  )
}
