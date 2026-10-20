"use client";
import { useEffect, useState } from "react";
import { useSite } from "@/components/app-shell";
type PixelFn = ((...args:unknown[])=>void)&{queue:unknown[][];callMethod?:(...args:unknown[])=>void;loaded:boolean;version:string};
type TrackingWindow = Window & { dataLayer?: unknown[][];gtag?:(...args:unknown[])=>void;fbq?:PixelFn;_fbq?:PixelFn;[key:`ga-disable-${string}`]:boolean };
const configuredGoogle=new Set<string>(),configuredMeta=new Set<string>();
export function AnalyticsIntegrations(){
 const {site,route}=useSite();const [consent,setConsent]=useState(false);
 useEffect(()=>{const sync=()=>{try{setConsent(localStorage.getItem("mk-cookie-consent")==="all");}catch{setConsent(false);}};sync();window.addEventListener("mk:consent",sync);return()=>window.removeEventListener("mk:consent",sync);},[]);
 const ga=site?.seo.gaId??"",meta=site?.seo.metaPixel??"";
 useEffect(()=>{
  const w=window as unknown as TrackingWindow;
  if(ga)w[`ga-disable-${ga}`]=!consent;
  const permission=consent?"granted":"denied";
  w.gtag?.("consent","update",{analytics_storage:permission,ad_storage:permission,ad_user_data:permission,ad_personalization:permission});
  w.fbq?.("consent",consent?"grant":"revoke");
  if(!consent)return;
  if(ga&&/^(G|GT)-[A-Z0-9]+$/i.test(ga)&&!configuredGoogle.has(ga)){
   w.dataLayer??=[];w.gtag??=((...args)=>{w.dataLayer!.push(args);});
   w.gtag("consent","default",{analytics_storage:"granted",ad_storage:"granted",ad_user_data:"granted",ad_personalization:"granted"});w.gtag("js",new Date());w.gtag("config",ga,{send_page_view:false});
   const script=document.createElement("script");script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`;script.dataset.mkAnalytics="google";document.head.appendChild(script);configuredGoogle.add(ga);
  }
  if(meta&&/^\d+$/.test(meta)&&!configuredMeta.has(meta)){
   if(!w.fbq){const f=((...args:unknown[])=>{if(f.callMethod)f.callMethod(...args);else f.queue.push(args);}) as PixelFn;f.queue=[];f.loaded=true;f.version="2.0";w.fbq=f;w._fbq=f;const script=document.createElement("script");script.async=true;script.src="https://connect.facebook.net/en_US/fbevents.js";script.dataset.mkAnalytics="meta";document.head.appendChild(script);}
   w.fbq("consent","grant");w.fbq("init",meta);configuredMeta.add(meta);
  }
 },[ga,meta,consent]);
 useEffect(()=>{if(!consent||route.view==="admin")return;const timer=setTimeout(()=>{const w=window as unknown as TrackingWindow;if(ga)w.gtag?.("event","page_view",{send_to:ga,page_title:document.title,page_location:window.location.href});if(meta)w.fbq?.("trackSingle",meta,"PageView");},0);return()=>clearTimeout(timer);},[route,consent,ga,meta]);
 return null;
}
