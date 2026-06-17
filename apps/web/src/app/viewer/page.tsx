import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GarmentViewer } from "@/features/viewer/garment-viewer";
import { STUDIO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "3D Garment Viewer",
  description:
    "Explore ThreadForm garments in interactive 3D — crew neck, oversized and hoodie, with multiple camera angles, materials and colors.",
  robots: { index: false, follow: true },
};

const capabilities = [
  { title: "3 garment models", body: "Crew neck, oversized tee and hoodie — switch instantly." },
  { title: "5 camera angles", body: "Front, back, left, right and isometric presets." },
  { title: "3 materials", body: "Cotton, premium cotton and hoodie fleece finishes." },
  { title: "Touch & gestures", body: "Drag to rotate, pinch to zoom — tuned for mobile." },
];

export default function ViewerPage() {
  return (
    <section className="pt-[calc(var(--header-h)+2.5rem)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-volt-500" />
            3D Garment Viewer
          </span>
          <h1 className="mt-5 text-h1">
            See every stitch in{" "}
            <span className="text-gradient-brand">real-time 3D</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lead text-ink-500">
            The same engine that powers the design studio. Spin the garment,
            switch angles, try materials and colors — all rendered on demand for
            buttery performance.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <GarmentViewer />
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-line-200 bg-surface-50 p-5"
            >
              <h2 className="text-base font-semibold text-ink-900">{c.title}</h2>
              <p className="mt-1 text-sm text-ink-500">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center pb-8">
          <Button href={STUDIO_URL} variant="cta" size="lg" magnetic>
            Design on these garments
          </Button>
        </div>
      </Container>
    </section>
  );
}
