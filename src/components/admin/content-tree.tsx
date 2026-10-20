"use client";
import { Field, ImageField } from "./fields";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
const LABELS: Record<string,string> = {
 hero:"Abertura / Hero",badge:"Selo",titleA:"Título · primeira linha",titleB:"Título · destaque",titleC:"Título · última linha",subtitle:"Subtítulo",title:"Título",text:"Texto",label:"Rótulo",name:"Nome",description:"Descrição",paragraphs:"Parágrafos",highlights:"Destaques",about:"Sobre a agência",concept:"Conceito",marquee:"Faixa de serviços",process:"Processo",faq:"Perguntas frequentes",q:"Pergunta",a:"Resposta",promises:"Compromissos",yes:"O que entregamos",no:"Limites do escopo",stats:"Indicadores",items:"Itens",value:"Número",suffix:"Sufixo",eyebrow:"Etiqueta",ctaPrimaryLabel:"Botão principal · texto",ctaPrimaryTo:"Botão principal · destino",ctaSecondaryLabel:"Botão secundário · texto",ctaSecondaryTo:"Botão secundário · destino",brand:"Marca",logoHeader:"Logo no cabeçalho",logoFooter:"Logo em fundo escuro",favicon:"Ícone do navegador",ogImage:"Imagem de compartilhamento",heroImages:"Fotografias da rede",primary:"Foto principal da rede",secondary:"Foto secundária",tertiary:"Terceira foto",heroArtwork:"Imagem da hero",aboutImage:"Foto da página A MK",serviceImages:"Imagens dos serviços",menuVideo:"Vídeo do mega menu",enabled:"Exibir",src:"Imagem / arquivo",poster:"Capa",kicker:"Etiqueta",ctaLabel:"Texto do botão",nav:"Nome no menu",cardTitle:"Título no card",cardText:"Descrição no card",cardCta:"Chamada no card",h1:"Título principal",heroKicker:"Etiqueta da hero",lead:"Texto de abertura",intro:"Introdução",deliverablesTitle:"Título das entregas",deliverables:"Entregas",forWho:"Para quem",cta:"Chamada final",seo:"SEO do serviço",url:"Link de destino",image:"Imagem de apresentação",category:"Categoria",demo:"Projeto fictício / demonstração",visible:"Visível no site",kind:"Canal",projects:"Projetos",indoorFaq:"FAQ da rede",indoorSteps:"Etapas da campanha",indoorFormats:"Formatos de anúncio",specs:"Especificações",channels:"Canais da hero",href:"Link",brandName:"Nome da marca",legalName:"Razão social",cnpj:"CNPJ",addressStreet:"Endereço",addressDistrict:"Bairro",addressCity:"Cidade",addressState:"Estado",email:"E-mail",whatsapp:"WhatsApp com DDI e DDD",whatsappMessage:"Mensagem do WhatsApp",phone:"Telefone",hours:"Horário de atendimento",showPublicCounter:"Exibir contador público",gaId:"ID Google Analytics",gscVerification:"Verificação Search Console",metaPixel:"ID Meta Pixel",defaultOgImage:"Imagem social padrão",pages:"Metadados por página",home:"Início",solucoes:"Soluções",midia:"Mídia indoor",sobre:"A MK",contato:"Contato",instagram:"Instagram",facebook:"Facebook",linkedin:"LinkedIn",youtube:"YouTube",orange:"Laranja da marca",ink:"Preto",paper:"Branco / fundo",surface:"Cinza claro / superfície",bodySize:"Tamanho base do texto (px)",headingFont:"Fonte dos títulos",radius:"Arredondamento (px)",maintenance:"Modo de manutenção",enabledTracking:"Ativar métricas internas",
};
const IMMUTABLE = new Set(["key","slug","icon","id"]);
const ARRAYS_LOCKED = new Set(["services","homeSections"]);
function fresh(value: unknown, key: string): unknown {
 if (Array.isArray(value)) return [];
 if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, k==="id" ? `item-${crypto.randomUUID()}` : k==="visible" ? false : k==="demo" ? true : fresh(v,k)]));
 if (typeof value === "boolean") return false;
 if (typeof value === "number") return 0;
 if (key==="kind") return "digital";
 return "";
}
function emptyTemplate(key:string):unknown {
 const templates:Record<string,unknown>={projects:{id:"",name:"",category:"",description:"",image:"",url:"",demo:true,visible:false},work:{id:"",src:"",title:"",category:"",kind:"digital",visible:false},faq:{q:"",a:""},indoorFaq:{q:"",a:""},process:{title:"",text:""},deliverables:{title:"",text:""},indoorSteps:{title:"",description:""},indoorFormats:{name:"",description:"",specs:""},channels:{name:"",label:"",href:"#/contato",cta:""},items:{value:0,suffix:"",label:""}};
 return templates[key]??"";
}
export function ContentTree({ value, path, update, title, query="" }: { value: unknown; path: string; update: (path:string,value:unknown)=>void; title?: string; query?: string }) {
 const key=path.split(".").at(-1) ?? "";
 const label=title ?? LABELS[key] ?? key;
 const isCopy=path.startsWith("copy.");
 if (query && !JSON.stringify(value).toLocaleLowerCase().includes(query.toLocaleLowerCase()) && !label.toLocaleLowerCase().includes(query.toLocaleLowerCase())) return null;
 if (typeof value === "boolean") return <label className="cms-switch"><span>{label}</span><input type="checkbox" checked={value} onChange={e=>update(path,e.target.checked)}/><span>{value?"Ativo":"Oculto"}</span></label>;
 if (Array.isArray(value)) return <div className="cms-collection"><div className="cms-collection-head"><h3>{label}<span>{value.length} itens</span></h3>{!ARRAYS_LOCKED.has(path)&&<button className="cms-small-button" type="button" onClick={()=>update(path,[...value, fresh(value[0] ?? emptyTemplate(key),key)])}><Plus size={15}/>Adicionar</button>}</div>{value.map((item,i)=>{
 const caption=typeof item==="object"&&item ? item.name||item.cardTitle||item.title||item.label||item.q : String(item).slice(0,70);
 return <details className="cms-item" key={i} open={query ? true : undefined}><summary><span className="cms-item-number">{String(i+1).padStart(2,"0")}</span><span>{caption||"Novo item"}</span></summary><div className="cms-item-content"><ContentTree value={item} path={`${path}.${i}`} update={update}/><div className="cms-item-actions"><button type="button" disabled={i===0} aria-label="Mover item para cima" onClick={()=>{const a=[...value];[a[i-1],a[i]]=[a[i],a[i-1]];update(path,a);}}><ArrowUp size={15}/>Subir</button><button type="button" disabled={i===value.length-1} aria-label="Mover item para baixo" onClick={()=>{const a=[...value];[a[i+1],a[i]]=[a[i],a[i+1]];update(path,a);}}><ArrowDown size={15}/>Descer</button>{!ARRAYS_LOCKED.has(path)&&<button type="button" className="cms-remove" onClick={()=>update(path,value.filter((_,n)=>n!==i))}><Trash2 size={15}/>Remover do rascunho</button>}</div></div></details>;
 })}</div>;
 if (value && typeof value==="object") {
   const fields=<div className="cms-fields">{Object.entries(value).filter(([k])=>!IMMUTABLE.has(k)&&k!=="revision").map(([k,v])=> <ContentTree key={k} value={v} path={`${path}.${k}`} update={update} query={query} title={isCopy ? String(v).trim().slice(0,95) : undefined}/>)}</div>;
   return path.split(".").length > 1 && !isCopy && !/^\d+$/.test(key) ? <fieldset><legend>{label}</legend>{fields}</fieldset> : fields;
 }

 const image=/\.(image|src|poster|logoHeader|logoFooter|favicon|ogImage|defaultOgImage|heroArtwork|aboutImage|primary|secondary|tertiary)$/.test(path)||path.startsWith("media.serviceImages.");
 if(image && path!=="media.menuVideo.src")return <ImageField label={label} value={String(value??"")} onChange={v=>update(path,v)} hint="Upload de até 4 MB. O painel otimiza a imagem automaticamente."/>;
 if(["kind","headingFont"].includes(key))return <label className="cms-select-label">{label}<select value={String(value)} onChange={e=>update(path,e.target.value)}>{(key==="kind"?["digital","indoor"]:["bricolage","inter"]).map(v=><option key={v} value={v}>{v}</option>)}</select></label>;
 if(typeof value==="number")return <Field label={label} type="number" value={String(value)} onChange={v=>update(path,Number(v))}/>;
 if(value===null)return <p className="cms-hint">{label}: seguindo os dados existentes da rede.</p>;
 return <Field label={label} value={String(value??"")} onChange={v=>update(path,v)} multiline={isCopy||String(value??"").length>95||["description","text","lead","a"].includes(key)} rows={String(value??"").length>200?4:2}/>;
}
