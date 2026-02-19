import pngToIco from "png-to-ico";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pngPath = path.join(root, "public", "images", "or-logo.png");
const icoPath = path.join(root, "src", "app", "favicon.ico");

// Normalize PNG with sharp (handles various encodings) then convert to ICO
const sizes = [256, 48, 32, 16];
const buffers = await Promise.all(
    sizes.map((size) =>
        sharp(pngPath)
            .resize(size, size)
            .png()
            .toBuffer()
    )
);
const icoBuf = await pngToIco(buffers);
fs.writeFileSync(icoPath, icoBuf);
console.log("Wrote", icoPath);
