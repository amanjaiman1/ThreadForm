import * as THREE from "three";
import { SILHOUETTES, type ModelId } from "./garments";

/* three.js-dependent geometry builder. Imported ONLY by the lazy 3D scene so
 * the engine never lands in the page bundle. Ready to be swapped for compressed
 * GLTF models (Draco/meshopt) without touching the UI layer. */

function shapeFromPoints(pts: [number, number][]) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  return s;
}

export type BuiltGarment = {
  geom: THREE.ExtrudeGeometry;
  frontZ: number;
  topY: number;
};

export function buildGarmentGeometry(model: ModelId): BuiltGarment {
  const def = SILHOUETTES[model];
  const shape = shapeFromPoints(def.pts);

  const first = def.pts[0];
  const last = def.pts[def.pts.length - 1];
  shape.moveTo(last[0], last[1]);
  shape.quadraticCurveTo(0, def.neckY, first[0], first[1]);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: def.depth,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelSegments: 4,
    curveSegments: 36,
  });
  geom.center();
  geom.computeBoundingBox();
  const bb = geom.boundingBox!;
  return { geom, frontZ: bb.max.z, topY: bb.max.y };
}
