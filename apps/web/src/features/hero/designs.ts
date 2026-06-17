/**
 * Apparel "designs" rendered to a 2D canvas — shared by the 3D decal texture
 * and the lightweight 2D fallback so both show identical, on-brand artwork.
 * Each design draws onto a transparent canvas (artwork only) and pairs with a
 * garment color so contrast always reads well.
 */

export type ApparelDesign = {
  id: string;
  label: string;
  garment: string; // shirt body color
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
};

const VOLT = "#A6F000";
const WHITE = "#FFFFFF";

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function centerText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  fill: string,
  letterSpacing = 0
) {
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (letterSpacing) {
    // manual letter spacing for crisp look
    const widths = text.split("").map((c) => ctx.measureText(c).width);
    const total =
      widths.reduce((a, b) => a + b, 0) + letterSpacing * (text.length - 1);
    let cx = x - total / 2;
    ctx.textAlign = "left";
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], cx, y);
      cx += widths[i] + letterSpacing;
    }
    ctx.textAlign = "center";
  } else {
    ctx.fillText(text, x, y);
  }
}

export const apparelDesigns: ApparelDesign[] = [
  {
    id: "fest",
    label: "College fest hoodie",
    garment: "#1A1A1A",
    draw: (ctx, w, h) => {
      const cx = w / 2;
      centerText(ctx, "SPRING", cx, h * 0.34, `800 ${w * 0.17}px Arial`, WHITE, 2);
      centerText(ctx, "FEST", cx, h * 0.48, `800 ${w * 0.23}px Arial`, VOLT, 2);
      centerText(ctx, "'26", cx, h * 0.62, `800 ${w * 0.13}px Arial`, WHITE, 4);
      ctx.strokeStyle = WHITE;
      ctx.lineWidth = w * 0.012;
      ctx.beginPath();
      ctx.moveTo(w * 0.22, h * 0.7);
      ctx.lineTo(w * 0.78, h * 0.7);
      ctx.stroke();
      centerText(ctx, "RIVERSIDE CAMPUS", cx, h * 0.76, `600 ${w * 0.055}px Arial`, WHITE, 3);
    },
  },
  {
    id: "club",
    label: "Club monogram tee",
    garment: "#2A1170",
    draw: (ctx, w, h) => {
      const cx = w / 2;
      ctx.strokeStyle = VOLT;
      ctx.lineWidth = w * 0.02;
      ctx.beginPath();
      ctx.arc(cx, h * 0.42, w * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      centerText(ctx, "RC", cx, h * 0.42, `800 ${w * 0.2}px Arial`, WHITE);
      centerText(ctx, "RIVERSIDE", cx, h * 0.66, `800 ${w * 0.1}px Arial`, WHITE, 3);
      centerText(ctx, "DESIGN CLUB", cx, h * 0.74, `600 ${w * 0.06}px Arial`, VOLT, 4);
    },
  },
  {
    id: "team",
    label: "Sports team jersey",
    garment: "#0B3D2E",
    draw: (ctx, w, h) => {
      const cx = w / 2;
      centerText(ctx, "TITANS", cx, h * 0.3, `800 ${w * 0.15}px Arial`, WHITE, 2);
      centerText(ctx, "10", cx, h * 0.55, `900 ${w * 0.42}px Arial`, VOLT);
      centerText(ctx, "MEERA", cx, h * 0.8, `800 ${w * 0.1}px Arial`, WHITE, 6);
    },
  },
  {
    id: "startup",
    label: "Startup launch tee",
    garment: "#0E0E12",
    draw: (ctx, w, h) => {
      const cx = w / 2;
      centerText(ctx, "MAKE", cx, h * 0.36, `800 ${w * 0.2}px Arial`, WHITE, 1);
      centerText(ctx, "IT", cx, h * 0.52, `800 ${w * 0.2}px Arial`, VOLT, 1);
      centerText(ctx, "YOURS", cx, h * 0.68, `800 ${w * 0.2}px Arial`, WHITE, 1);
      roundedRect(ctx, w * 0.3, h * 0.8, w * 0.4, h * 0.07, h * 0.035);
      ctx.fillStyle = VOLT;
      ctx.fill();
      centerText(ctx, "threadform.com", cx, h * 0.835, `700 ${w * 0.05}px Arial`, "#0E0E12", 1);
    },
  },
];
