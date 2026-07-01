const fs = require('fs');

const arrowArt = [
  "X               ",
  "XX              ",
  "XDX             ",
  "XDXX            ",
  "XDLLX           ",
  "XDLLLX          ",
  "XDLLLLX         ",
  "XDLLLLLX        ",
  "XDLLLLLLX       ",
  "XDLLLLLLLX      ",
  "XDLLLLLLLLX     ",
  "XDLLLLLLLLLX    ",
  "XDLLLLLLLLLLX   ",
  "XDLLLLLLXLLLLX  ",
  "XDLLLXXLLXXLLLX ",
  "XDLLX  XLLLXLLLX",
  "XDLX   XLLLXLLLX",
  "XXX     XLLXLLLX",
  "        XLLXLLX ",
  "         XX XX  "
];

const handArt = [
  "     XX         ",
  "    XLLX        ",
  "    XDLX        ",
  "    XDLX        ",
  "    XDLX        ",
  "    XDLX XX     ",
  "    XDLXXLLX XX ",
  " XX XDLXDLXX XLL",
  "XLLXXDLLLLLX XDL",
  "XDLLXDLLLLLLXXDL",
  " XDLLLLLLLLLLLLL",
  " XDLLLLLLLLLLLLL",
  "  XLLLLLLLLLLLLX",
  "  XLLLLLLLLLLLLX",
  "   XLLLLLLLLLLX ",
  "   XLLLLLLLLLLX ",
  "    XXXXXXXXXX  "
];

const colors = {
  'X': '#000000', // Black Border
  'D': '#a855f7', // Dark Purple
  'L': '#c084fc'  // Light Purple
};

function generateSVG(art, hotspotX, hotspotY) {
  let rects = '';
  for (let y = 0; y < art.length; y++) {
    for (let x = 0; x < art[y].length; x++) {
      const char = art[y][x];
      if (colors[char]) {
        rects += `<rect x="${x}" y="${y}" width="1.1" height="1.1" fill="${colors[char]}" />`;
      }
    }
  }
  
  const width = art[0].length;
  const height = art.length;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height * 2}" viewBox="0 0 ${width} ${height}">${rects}</svg>`;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `url('data:image/svg+xml;base64,${base64}') ${hotspotX * 2} ${hotspotY * 2}, auto`;
}

const arrowCSS = generateSVG(arrowArt, 0, 0);
const handCSS = generateSVG(handArt, 5, 0);

const cssContent = `
/* Hardcoded Purple Pixel Custom Cursor - EXACT 100% REPLICA */
body, html {
  cursor: ${arrowCSS} !important;
}

/* Make sure all clickable elements use the custom hand variant */
a, button, [role="button"], select, input[type="range"]::-webkit-slider-thumb, label, .cursor-pointer {
  cursor: ${handCSS} !important;
}
`;

fs.writeFileSync('generated_cursors.css', cssContent);
console.log("Cursors generated successfully!");
