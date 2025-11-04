import { projects } from "@/data/projects";
import PageHeader from "@/components/PageHeader";
import MaskHeading from "@/components/MaskHeading";
import { RemoteImage } from "@/components/RemoteImage";
import Container from "@/components/Container";

// Use the built-in PageProps helper with your route literal
export default async function Project(
  props: PageProps<"/work/[slug]">
) {
  const { slug } = await props.params;        // <-- await params
  const project = projects.find((p) => p.slug === slug);

  // const pageData = await getPageData(653);
  // console.log({ pageData });

  if (!project) return null;

  return (
    <>
      <PageHeader>
        <h1 className="h2">
          <MaskHeading>{project.title}</MaskHeading>
        </h1>
      </PageHeader>
      <Container className="section-margin-bottom">
        {project.media.map((m) => (
          <RemoteImage key={m.src} src={m.src} alt={m.alt} />
        ))}
      </Container>
    </>
  );
}

// async function getPageData(id: number) {
//   const res = await fetch(`http://qcdg.localhost/wp-json/wp/v2/pages/${id}`);
//   return res.json();
// }

// This stays the same
export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
