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

  if (!project) {
    return null;
  }

  return (
    <>
      <PageHeader>
        <h1 className="h2">
          <MaskHeading>{project.title}</MaskHeading>
        </h1>
      </PageHeader>
      <Container className="section-margin-bottom">
        {project.media.map((media) => {
          return <RemoteImage key={media.src} src={media.src} alt={media.alt} />;
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
