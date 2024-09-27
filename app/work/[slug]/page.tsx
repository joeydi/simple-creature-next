import { projects } from "@/data/projects";
import PageHeader from "@/components/PageHeader";
import MaskHeading from "@/components/MaskHeading";
import { RemoteImage } from "@/components/RemoteImage";
import Container from "@/components/Container";

interface Props {
  params: {
    slug: string;
  };
}

export default function Project({ params }: Props) {
  const project = projects.find((project) => project.slug === params.slug);

  return (
    <>
      <PageHeader>
        <h1>
          <MaskHeading>Our Work</MaskHeading>
        </h1>
      </PageHeader>
      <Container>
        {project?.media.map((media) => {
          return <RemoteImage src={media.src} alt={media.alt} />;
        })}
      </Container>
    </>
  );
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
