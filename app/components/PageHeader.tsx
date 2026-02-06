import Container from "./Container"

const PageHeader = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex min-h-[clamp(100px,84px+5vw,180px)] w-full items-center">
      <Container>
        <hgroup className="ml-(--spacing-xs)">{children}</hgroup>
      </Container>
    </div>
  )
}

export default PageHeader
