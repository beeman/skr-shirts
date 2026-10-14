# skr-shirts

White PP Mori SemiBold shirt prints (SVG + 4500px PNG) for black shirts, published from `docs/` via GitHub Pages.

Add a line to `shirts.txt`, then:

```sh
bun install
bun run generate
```

The font is read from `../../solana-mobile/solana-mobile-brand/font-pp-mori/otf/PPMori-Semibold.otf`; override with `FONT=/path/to/PPMori-Semibold.otf`. Text is outlined, so the font itself is never published.
