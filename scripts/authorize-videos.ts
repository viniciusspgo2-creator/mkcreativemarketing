// Autoriza os 6 vídeos Vimeo da MK na galeria local (sqlite de dev)
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const IDS = ["1235119820","1235119783","1235119744","1235119740","1235119739","1235119738"];
async function main() {
  for (const id of IDS) {
    const r = await db.indoorMedia.updateMany({
      where: { vimeoId: id },
      data: { authorized: true, origin: "own", videoUrl: `https://vimeo.com/${id}` },
    });
    console.log(`vimeo ${id}: ${r.count} atualizado(s)`);
  }
  // atualiza settings media/content se existirem com chaves novas (merge é feito em runtime)
  console.log("OK");
}
main().finally(() => db.$disconnect());
