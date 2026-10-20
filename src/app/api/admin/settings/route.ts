import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSiteData, invalidateSettings } from "@/lib/settings";
import { settingsSchema } from "@/lib/settings-schema";
import { requireAdmin, isResponse, audit } from "@/lib/auth";
import { db } from "@/lib/db";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){const user=await requireAdmin(req);if(isResponse(user))return user;return NextResponse.json(await getSiteData(),{headers:{"Cache-Control":"no-store"}});}
export async function PUT(req:NextRequest){
 const user=await requireAdmin(req);if(isResponse(user))return user;
 try{
  if(Number(req.headers.get("content-length")??0)>3_000_000)return NextResponse.json({error:"Conteúdo muito grande."},{status:413});
  const body=await req.json();const parsed=settingsSchema.safeParse(body);
  if(!parsed.success){const issue=parsed.error.issues[0];return NextResponse.json({error:`Revise ${issue.path.join(" › ")}: ${issue.message}`},{status:400});}
  const {expectedRevision,...settings}=parsed.data;const revision=randomUUID();
  if(!Object.keys(settings).length)return NextResponse.json({error:"Nenhuma configuração enviada."},{status:400});
  await db.$transaction(async tx=>{
   const current=await tx.setting.findUnique({where:{key:"_revision"}});
   const actual=current?JSON.parse(current.value):"initial";
   if(expectedRevision!==undefined&&actual!==expectedRevision)throw new Error("CONFLICT");
   for(const [key,value]of Object.entries(settings))await tx.setting.upsert({where:{key},create:{key,value:JSON.stringify(value)},update:{value:JSON.stringify(value)}});
   await tx.setting.upsert({where:{key:"_revision"},create:{key:"_revision",value:JSON.stringify(revision)},update:{value:JSON.stringify(revision)}});
  },{isolationLevel:"Serializable"});
  invalidateSettings();await audit(user.id,"UPDATE","settings",undefined,Object.keys(settings).join(", "));
  return NextResponse.json({ok:true,revision});
 }catch(error){
  if((error as Error).message==="CONFLICT"||(error as {code?:string}).code==="P2034")return NextResponse.json({error:"Outra sessão alterou o site. Exporte seu rascunho e recarregue o editor para comparar antes de salvar."},{status:409});
  if(error instanceof SyntaxError)return NextResponse.json({error:"Arquivo JSON inválido."},{status:400});
  return NextResponse.json({error:"Não foi possível salvar. Seu rascunho foi mantido para tentar novamente."},{status:500});
 }
}
