/**
 * One-off image optimizer: converts heavy public/images assets to WebP
 * (and downscales logo/favicon), then deletes the original PNGs.
 * Run: npx tsx src/scripts/optimize-images.ts
 */
import sharp from "sharp"
import { promises as fs } from "node:fs"
import path from "node:path"

const DIR = path.join(process.cwd(), "public", "images")

type Task = {
  src: string
  out: string
  /** resize config passed to sharp, if any */
  resize?: { width?: number; height?: number; fit?: "cover" | "contain" | "fill" | "inside" | "outside" }
  /** quality for lossy formats */
  quality?: number
}

const tasks: Task[] = [
  // Desktop heroes: cap at 1920w (covers 1080p + modest retina)
  { src: "Hero1.png", out: "hero1.webp", resize: { width: 1920 }, quality: 80 },
  { src: "Hero2.png", out: "hero2.webp", resize: { width: 1920 }, quality: 80 },
  { src: "Hero3.png", out: "hero3.webp", resize: { width: 1920 }, quality: 80 },
  // Mobile hero (LCP): 1200x1800 max for retina
  {
    src: "Hero-Mobile.png",
    out: "hero-mobile.webp",
    resize: { width: 1200, height: 1800, fit: "inside" },
    quality: 78,
  },
  // Logo: display ~145x64, 2x retina = 290x128, keep PNG (simple lossless)
  {
    src: "uisbLogo.png",
    out: "uisb-logo@2x.png",
    resize: { width: 290, height: 128, fit: "inside" },
  },
]

async function kb(file: string): Promise<number> {
  try {
    const s = await fs.stat(file)
    return s.size / 1024
  } catch {
    return 0
  }
}

async function main() {
  let saved = 0
  for (const t of tasks) {
    const srcPath = path.join(DIR, t.src)
    const outPath = path.join(DIR, t.out)
    const before = await kb(srcPath)
    if (before === 0) {
      console.warn(`skip (missing): ${t.src}`)
      continue
    }
    let img = sharp(srcPath)
    if (t.resize) img = img.resize(t.resize)
    if (t.out.endsWith(".webp")) {
      await img.webp({ quality: t.quality ?? 80 }).toFile(outPath)
    } else if (t.out.endsWith(".png")) {
      await img.png({ compressionLevel: 9 }).toFile(outPath)
    } else {
      await img.toFile(outPath)
    }
    const after = await kb(outPath)
    saved += before - after
    console.log(`${t.src} (${before.toFixed(0)}KB) -> ${t.out} (${after.toFixed(0)}KB)`)
    // Delete original when output name differs
    if (path.resolve(srcPath) !== path.resolve(outPath)) {
      await fs.unlink(srcPath)
    }
  }
  console.log(`\nTotal saved: ~${(saved / 1024).toFixed(2)}MB`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
