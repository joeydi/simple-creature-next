interface Image {
  src: string;
  alt: string;
}

interface Project {
  slug: string;
  title: string;
  description: string;
  industry: string;
  services: string[];
  media: Image[];
}

export const projects: Project[] = [
  {
    slug: "nissan",
    title: "Nissan",
    description:
      "Simple Creature Designed and animated all the interior UI for Nissan’s “IMS” concept car. Initially, the client direction was “retro future Tokyo”, and we were operating in a very free-form way, favoring aesthetics first and functionality second. Over the course of the project, form and function became of equal importance, but starting unconstrained allowed us to fully explore wild and unconventional ideas and visuals.",
    industry: "Automotive",
    services: ["Design", "UX", "Illustration", "3D Modeling", "Motion Graphics"],
    media: [
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-1.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-2.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-3.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-4.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-5.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-6.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-7.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-8.jpg",
        alt: "",
      },
    ],
  },
];
