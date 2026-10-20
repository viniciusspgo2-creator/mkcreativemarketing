// Converte os criativos do RAR em WebP otimizado para a web
import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import path from "path";

const SRC = "/home/z/my-project/upload/imagens-extracted";
const OUT = "/home/z/my-project/public/criativos";
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// mapa: arquivo original -> nome final (pulando os com marca errada MIX/PLAY)
const MAP: Record<string, string> = {
  "PixVerse_Image_Effect_prompt_Faça um criativo (1).png": "criativo-indoor-movimento",
  "PixVerse_Image_Effect_prompt_Faça um criativo (4).png": "criativo-google-seo",
  "PixVerse_Image_Effect_prompt_Faça um criativo (5).png": "criativo-google-pin",
  "PixVerse_Image_Effect_prompt_Faça um criativo (6).png": "criativo-sites-resultado",
  "PixVerse_Image_Effect_prompt_Faça um criativo (8).png": "criativo-sites-nivel",
  "PixVerse_Image_Effect_prompt_Faça um criativo (9).png": "criativo-indoor-totem",
  "PixVerse_Image_Effect_prompt_Faça um criativo (13).png": "criativo-redes-sociais",
  "PixVerse_Image_Effect_prompt_Faça um criativo (2).png": "criativo-sites-portrait",
  "PixVerse_Image_Effect_prompt_Faça um criativo (3).png": "criativo-indoor-portrait",
  "PixVerse_Image_Effect_prompt_Faça um criativo (7).png": "criativo-sites-experiencias",
  "PixVerse_Image_Effect_prompt_Faça um criativo (11).png": "criativo-indoor-vista",
  "PixVerse_Image_Effect_prompt_Faça um criativo (14).png": "criativo-redes-portrait",
};

async function run() {
  for (const [file, name] of Object.entries(MAP)) {
    const input = path.join(SRC, file);
    const meta = await sharp(input).metadata();
    const isPortrait = (meta.height ?? 0) > (meta.width ?? 0);
    const targetW = isPortrait ? 1000 : 1600;
    const out = path.join(OUT, `${name}.webp`);
    await sharp(input)
      .rotate()
      .resize({ width: targetW, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(out);
    const done = await sharp(out).metadata();
    console.log(`${name}.webp  ${done.width}x${done.height}`);
  }
  console.log("OK — criativos convertidos");
}
run().catch((e) => { console.error(e); process.exit(1); });
