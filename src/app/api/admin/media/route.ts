import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse } from "@/lib/auth";
export async function GET(req:NextRequest){
 const user=await requireAdmin(req);if(isResponse(user))return user;
 const assets=await db.mediaAsset.findMany({take:100,orderBy:{createdAt:"desc"},select:{id:true,filename:true,url:true,alt:true,folder:true,width:true,height:true,size:true,mime:true,createdAt:true}});
 return NextResponse.json({assets},{headers:{"Cache-Control":"no-store"}});
}
