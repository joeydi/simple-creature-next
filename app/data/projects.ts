interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  featured: boolean;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  industry: string;
  services: string[];
  featuredImage: ProjectImage;
  media: ProjectImage[];
}

export const projects: Project[] = [
  {
    featured: true,
    slug: "nissan",
    title: "Nissan",
    shortDescription: "Lorem ipsum dolor sit amet",
    description:
      "Simple Creature Designed and animated all the interior UI for Nissan’s “IMS” concept car. Initially, the client direction was “retro future Tokyo”, and we were operating in a very free-form way, favoring aesthetics first and functionality second. Over the course of the project, form and function became of equal importance, but starting unconstrained allowed us to fully explore wild and unconventional ideas and visuals.",
    industry: "Automotive",
    services: ["Design", "UX", "Illustration", "3D Modeling", "Motion Graphics"],
    featuredImage: {
      src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-1.jpg",
      alt: "",
    },
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
  {
    featured: true,
    slug: "mamava",
    title: "Mamava",
    shortDescription: "Lorem ipsum dolor sit amet",
    description:
      "Our friends at Mamava asked if we could create an interactive component that allowed users to view their products in 3D. We not only provided a robust and interactive 3D product tour, but completely updated their product pages, giving users a holistic view of the benefits of Mamava products.",
    industry: "Health and Wellness",
    services: ["3D Product Rendering", "Motion Graphics", "Web Design", "CSS", "Hubspot Integration"],
    featuredImage: {
      src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/mamava/mamava-1.jpg",
      alt: "",
    },
    media: [
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/mamava/mamava-1.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/mamava/mamava-2.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/mamava/mamava-3.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/mamava/mamava-4.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/mamava/mamava-5.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/mamava/mamava-6.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/mamava/mamava-7.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/mamava/mamava-8.jpg",
        alt: "",
      },
    ],
  },
  {
    featured: true,
    slug: "olg",
    title: "OLG Level Up",
    shortDescription: "TV Commercial",
    description:
      "Working alongside Reactive, Toronto we designed an animated several 3D, holographic user interfaces and incorporated them with live action talent. We enlisted the designs of quintessential cassino games to inform our creative direction and design choices. Once designed, our superimposed 3D holograms were animated to react to the actor’s gestures and touch.",
    industry: "Online Gaming",
    services: ["Graphic Design", "3D Modeling", "Motion Graphics", "Live Action Compositing"],
    featuredImage: {
      src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/olg/olg-1.jpg",
      alt: "",
    },
    media: [
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/olg/olg-1.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/olg/olg-2.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/olg/olg-3.jpg",
        alt: "",
      },
      {
        src: "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/olg/olg-4.jpg",
        alt: "",
      },
    ],
  },
];
