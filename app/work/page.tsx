import PageHeader from "@/components/PageHeader";
import MaskHeading from "@/components/MaskHeading";
import { RemoteImage } from "@/components/RemoteImage";

export default function Work() {
  return (
    <>
      <PageHeader>
        <h1>
          <MaskHeading>Our Work</MaskHeading>
        </h1>
      </PageHeader>
      <RemoteImage
        src="https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/website/nissan/nissan-1.jpg"
        alt=""
      />
    </>
  );
}
