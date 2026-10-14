// Renders every line of shirts.txt as white PP Mori SemiBold text to docs/<text>.svg + .png and rebuilds docs/index.html.
import { Resvg } from '@resvg/resvg-js'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import opentype from 'opentype.js'

const FONT =
  process.env.FONT ?? new URL('../../solana-mobile/solana-mobile-brand/font-pp-mori/otf/PPMori-Semibold.otf', import.meta.url).pathname
const LETTER_SPACING = -0.01 // em, matches the wallet's "devrel.skr" label
const PAD = 20 // font units of 1000-unit em, keeps antialiased edges inside the canvas
const PNG_WIDTH = 4500 // 15in at 300dpi, print-shop friendly

const font = opentype.parse(readFileSync(FONT).buffer)
const shirts = readFileSync('shirts.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean)
if (shirts.some((s) => !/^[\w.-]+$/.test(s))) throw new Error('shirts.txt lines may only contain letters, digits, ".", "-", "_"')

mkdirSync('docs', { recursive: true })
for (const text of shirts) {
  // Outlined paths so the SVG needs no font installed at the print shop.
  const path = font.getPath(text, 0, 0, 1000, { letterSpacing: LETTER_SPACING })
  const b = path.getBoundingBox()
  const [x, y, w, h] = [b.x1 - PAD, b.y1 - PAD, b.x2 - b.x1 + 2 * PAD, b.y2 - b.y1 + 2 * PAD]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}"><path fill="#ffffff" d="${path.toPathData(2)}"/></svg>\n`
  writeFileSync(`docs/${text}.svg`, svg)
  writeFileSync(`docs/${text}.png`, new Resvg(svg, { fitTo: { mode: 'width', value: PNG_WIDTH } }).render().asPng())
  console.log(`docs/${text}.{svg,png}`)
}

const cards = shirts
  .map((t) => `<li><img src="${t}.png" alt="${t}"><p>${t} · <a href="${t}.svg">svg</a> · <a href="${t}.png">png</a></p></li>`)
  .join('\n')
writeFileSync(
  'docs/index.html',
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SKR Shirts</title>
<style>
body { background: #010101; color: #f6f6f5; font-family: system-ui, sans-serif; margin: 0 auto; max-width: 960px; padding: 16px; }
a { color: #81c5b0; }
img { display: block; max-width: 100%; }
li { border: 1px solid #333; border-radius: 12px; padding: 32px; }
ul { display: grid; gap: 16px; list-style: none; padding: 0; }
</style>
</head>
<body>
<h1>SKR Shirts</h1>
<ul>
${cards}
</ul>
</body>
</html>
`,
)
