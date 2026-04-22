import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PNG } from "pngjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(rootDir, "assets");

const colors = {
  background: "#f5f7f6",
  accent: "#087f79",
  accentDark: "#055b57",
  accentSoft: "#dff3ef",
  white: "#ffffff",
};

function parseHex(hex, alpha = 255) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
    a: alpha,
  };
}

function createCanvas(width, height, background) {
  const png = new PNG({ width, height });
  const fill = background ? parseHex(background) : { r: 0, g: 0, b: 0, a: 0 };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      setPixel(png, x, y, fill);
    }
  }

  return png;
}

function setPixel(png, x, y, color) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;

  const index = (png.width * y + x) << 2;
  const alpha = color.a / 255;
  const inverse = 1 - alpha;

  png.data[index] = Math.round(color.r * alpha + png.data[index] * inverse);
  png.data[index + 1] = Math.round(color.g * alpha + png.data[index + 1] * inverse);
  png.data[index + 2] = Math.round(color.b * alpha + png.data[index + 2] * inverse);
  png.data[index + 3] = Math.min(255, Math.round(color.a + png.data[index + 3] * inverse));
}

function drawCircle(png, centerX, centerY, radius, color) {
  const fill = parseHex(color);
  const startX = Math.floor(centerX - radius);
  const endX = Math.ceil(centerX + radius);
  const startY = Math.floor(centerY - radius);
  const endY = Math.ceil(centerY + radius);
  const radiusSquared = radius * radius;

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx * dx + dy * dy <= radiusSquared) setPixel(png, x, y, fill);
    }
  }
}

function drawRoundedRect(png, left, top, width, height, radius, color) {
  const fill = parseHex(color);
  const right = left + width;
  const bottom = top + height;
  const radiusSquared = radius * radius;

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const cornerX = x < left + radius ? left + radius : x >= right - radius ? right - radius - 1 : x;
      const cornerY = y < top + radius ? top + radius : y >= bottom - radius ? bottom - radius - 1 : y;
      const dx = x - cornerX;
      const dy = y - cornerY;
      if (dx * dx + dy * dy <= radiusSquared) setPixel(png, x, y, fill);
    }
  }
}

function drawPawMark(png, centerX, centerY, scale, primary = colors.accent, secondary = colors.white) {
  drawCircle(png, centerX - scale * 0.4, centerY - scale * 0.55, scale * 0.2, secondary);
  drawCircle(png, centerX, centerY - scale * 0.68, scale * 0.22, secondary);
  drawCircle(png, centerX + scale * 0.4, centerY - scale * 0.55, scale * 0.2, secondary);
  drawCircle(png, centerX - scale * 0.18, centerY - scale * 0.22, scale * 0.22, secondary);
  drawCircle(png, centerX + scale * 0.18, centerY - scale * 0.22, scale * 0.22, secondary);
  drawCircle(png, centerX, centerY + scale * 0.18, scale * 0.43, secondary);

  drawCircle(png, centerX - scale * 0.22, centerY + scale * 0.06, scale * 0.06, primary);
  drawCircle(png, centerX + scale * 0.22, centerY + scale * 0.06, scale * 0.06, primary);
}

function writePng(fileName, png) {
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.writeFileSync(path.join(assetsDir, fileName), PNG.sync.write(png));
}

function generateIcon() {
  const png = createCanvas(1024, 1024, colors.accent);
  drawRoundedRect(png, 184, 184, 656, 656, 152, colors.white);
  drawPawMark(png, 512, 555, 455, colors.accent, colors.accent);
  drawCircle(png, 742, 296, 64, colors.accentSoft);
  writePng("app-icon.png", png);
}

function generateAdaptiveIcon() {
  const png = createCanvas(1024, 1024);
  drawRoundedRect(png, 242, 242, 540, 540, 136, colors.white);
  drawPawMark(png, 512, 560, 390, colors.accent, colors.accent);
  writePng("adaptive-icon.png", png);
}

function generateMonochromeIcon() {
  const png = createCanvas(1024, 1024);
  drawPawMark(png, 512, 558, 520, colors.accentDark, colors.accentDark);
  writePng("adaptive-icon-monochrome.png", png);
}

function generateSplash() {
  const png = createCanvas(1242, 2436, colors.background);
  drawRoundedRect(png, 421, 846, 400, 400, 96, colors.accent);
  drawPawMark(png, 621, 1082, 280, colors.white, colors.white);
  drawCircle(png, 768, 936, 38, colors.accentSoft);
  writePng("splash.png", png);
}

function generateFavicon() {
  const png = createCanvas(48, 48, colors.accent);
  drawPawMark(png, 24, 27, 25, colors.white, colors.white);
  writePng("favicon.png", png);
}

generateIcon();
generateAdaptiveIcon();
generateMonochromeIcon();
generateSplash();
generateFavicon();

console.log(`Generated app assets in ${assetsDir}`);
