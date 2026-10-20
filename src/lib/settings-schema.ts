import { z } from "zod";
const text=z.string().max(12000);
const short=z.string().max(500);
const link=z.string().max(2400).refine(v=>!v||/^(?:https?:\/\/|\/(?!\/)|#\/|mailto:|tel:)/i.test(v)||/^(contato|servicos|sobre|blog|midia-indoor)$/.test(v),"Use uma URL completa ou um caminho do site.");
const pair=z.object({title:text,text:text});
const faq=z.array(z.object({q:text,a:text})).max(80);
const seo=z.object({title:short,description:text});
const hero=z.object({badge:text,titleA:text,titleB:text,titleC:text,subtitle:text,ctaPrimaryLabel:short,ctaPrimaryTo:link,ctaSecondaryLabel:short,ctaSecondaryTo:link});
const service=z.object({key:short,slug:short,nav:short,icon:short,cardTitle:short,cardText:text,cardCta:short,accent:z.boolean().optional(),h1:text,heroKicker:short,lead:text,intro:z.array(text).max(80),deliverablesTitle:text,deliverables:z.array(pair).max(80),forWho:text.optional(),process:z.array(pair).max(80).optional(),faq,cta:z.object({title:text,text:text,label:short}),seo});
const color=z.string().regex(/^#[a-f0-9]{6}$/i,"Use uma cor hexadecimal de 6 dígitos.");
export const settingsSchema=z.object({
 expectedRevision:z.string().max(100).optional(),
 content:z.object({hero,about:z.object({eyebrow:short,title:text,paragraphs:z.array(text),highlights:z.array(text)}),concept:z.object({eyebrow:short,title:text,lead:text,paragraphs:z.array(text),phrase:text}),marquee:z.array(short).max(100),process:z.array(pair).max(80),faq,promises:z.object({yes:z.array(text),no:z.array(text)}),stats:z.object({eyebrow:short,title:text,items:z.array(z.object({value:z.number().finite().min(0).max(1e12),suffix:short,label:text})).max(20)})}).optional(),
 institution:z.object({brandName:short,legalName:short,cnpj:short,addressStreet:short,addressDistrict:short,addressCity:short,addressState:short,email:z.union([z.literal(""),z.email()])}).optional(),
 contact:z.object({whatsapp:short,whatsappMessage:text,phone:short,hours:short,showPublicCounter:z.boolean()}).optional(),
 social:z.object({instagram:link,facebook:link,linkedin:link,youtube:link}).optional(),
 seo:z.object({gaId:z.string().regex(/^(?:G-[A-Z0-9]+|GT-[A-Z0-9]+)?$/i,"ID Google inválido."),gscVerification:short,metaPixel:z.string().regex(/^\d*$/,"O ID Meta deve conter apenas números."),defaultOgImage:link,pages:z.record(short,seo)}).optional(),
 features:z.object({maintenance:z.boolean(),enabledTracking:z.boolean().optional()}).optional(),
 homeSections:z.array(z.object({key:short,label:short,visible:z.boolean()})).max(40).optional(),
 media:z.object({heroArtwork:link,aboutImage:link,brand:z.object({logoHeader:link,logoFooter:link,favicon:link,ogImage:link}),heroImages:z.object({primary:link,secondary:link,tertiary:link}),serviceImages:z.record(short,link),menuVideo:z.object({enabled:z.boolean(),src:link,poster:link,kicker:short,title:short,subtitle:text,ctaLabel:short})}).optional(),
 services:z.array(service).length(6,"Mantenha as seis páginas de serviço; os endereços são preservados.").optional(),
 copy:z.record(short,z.record(z.string().regex(/^\d{3}$/),text)).optional(),
 portfolio:z.object({enabled:z.boolean(),eyebrow:short,title:text,description:text,projects:z.array(z.object({id:short,name:short,category:short,description:text,image:link,url:link,demo:z.boolean(),visible:z.boolean()})).max(100)}).optional(),
 work:z.array(z.object({id:short,src:link,title:short,category:short,kind:z.enum(["digital","indoor"]),visible:z.boolean()})).max(100).optional(),
 appearance:z.object({orange:color,ink:color,paper:color,surface:color,bodySize:z.number().min(15).max(20),headingFont:z.enum(["bricolage","inter"]),radius:z.number().min(0).max(24)}).optional(),
 editorial:z.object({channels:z.array(z.object({name:short,label:text,href:link,cta:short})).min(1).max(8),indoorFaq:faq,indoorSteps:z.array(z.object({title:short,description:text.nullable()})).max(40).nullable(),indoorFormats:z.array(z.object({name:short,description:text.nullable(),specs:text.nullable()})).max(40).nullable()}).optional(),
});
