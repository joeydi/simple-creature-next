import probe from "probe-image-size";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export const RemoteImage = async ({ src, alt }: Props) => {
  const result = await probe(src);

  return <Image src={result.url} alt={alt} width={result.width} height={result.height} />;
};
