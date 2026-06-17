import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/components/seo/og-template";

export const alt = "ThreadForm — design custom apparel your whole crew will wear";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage();
}
