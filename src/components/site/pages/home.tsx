"use client";

import { useCopy } from "@/components/site/use-copy";

import { publicLink } from "@/lib/cms";
import { Children, isValidElement, type ReactNode, useEffect, useState } from "react";
import { useSite } from "@/components/app-shell";
import { Reveal, WhatsAppButton } from "@/components/site/site-chrome";
import { Faq, FaqJsonLd, LeadForm, Lightbox } from "@/components/site/blocks";
import { NetworkMap, StatsRow } from "@/components/site/mk-blocks";
import { SERVICES } from "@/lib/services";
import { ArrowDown, ArrowUpRight, ArrowRight, MapPin, Plus, Search, Monitor, Globe, Users, PenTool, Megaphone, Check } from "lucide-react";
import "./home-studio.css";

const ICONS = { google: Search, social: Users, target: Megaphone, site: Globe, screen: Monitor, store: PenTool };
type Post = { title: string; slug: string; excerpt: string | null; category?: { name: string } };

export function HomePage() {
  const t = useCopy("home");
  const { site, track, services } = useSite();
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const content = site!.content;
  const visible = (key: string) => site!.homeSections.find(s => s.key === key)?.visible !== false;
  const blogVisible = visible("blog");
  useEffect(() => {
    if (!blogVisible) return;
    const controller = new AbortController();
    fetch("/api/public/posts?perPage=3", { signal: controller.signal }).then(r => r.ok ? r.json() : null).then(d => setPosts(d?.posts ?? [])).catch(() => {});
    return () => controller.abort();
  }, [blogVisible]);

  const filteredWork = site!.work.filter(w => w.visible && (filter === "all" || filter === w.kind));

  return <HomeSections>
    {visible("hero") && <StudioHero key="hero" />}
    {visible("marquee") && <div key="marquee" className="studio-capabilities"><div className="mk-container">{content.marquee.slice(0, 6).map(s => <span key={s}><span aria-hidden>✳</span>{s}</span>)}</div></div>}

    {visible("solutions") && <section key="solutions" className="studio-section mk-container" id="solucoes">
      <div className="studio-section-heading"><Reveal><p className="studio-eyebrow">{t("001", "01 / O que fazemos")}</p><h2>{t("002", "Uma marca forte.")}<br /><span>{t("003", "Em cada ponto de contato.")}</span></h2></Reveal><p>{t("004", "Estratégia, criação e presença. Conectamos os canais certos para aproximar o seu negócio de quem importa.")}</p></div>
      <div className="studio-services">{services.map((s, i) => { const Icon = ICONS[s.icon]; return <a key={s.slug} href={`#/servicos/${s.slug}`} className={`studio-service studio-service-${s.icon}`} onClick={() => track("cta_click", `home-${s.slug}`)}><div className="studio-service-top"><Icon size={25} strokeWidth={1.5} aria-hidden /><span>0{i + 1}</span></div><h3>{s.cardTitle}</h3><p>{s.cardText}</p><span className="studio-service-link">{s.cardCta} <ArrowUpRight size={20} aria-hidden /></span></a>; })}</div>
    </section>}

    {visible("indoor") && <section key="indoor" className="studio-network"><div className="mk-container studio-section">
      <div className="studio-network-grid"><div><p className="studio-eyebrow">{t("006", "02 / Do digital para a vida real")}</p><h2>{t("007", "A sua marca.")}<br />{t("008", "Na rotina da ")}<em>{t("009", "sua cidade.")}</em></h2><p className="studio-description">{t("010", "Uma rede própria de mídia indoor para levar a sua mensagem a academias, farmácias e comércios da região. A MK planeja, cria e cuida da veiculação.")}</p><a className="studio-button studio-button-light" href="#/midia-indoor">{t("011", "Conhecer a rede de telas ")}<ArrowUpRight size={20} /></a><div className="studio-location"><MapPin size={16} /> {t("012", " São José do Rio Preto e região")}</div></div>
      <div className="studio-network-media"><img src={site!.media.heroImages.primary || "/uploads/Indoor/indoor-tela-academia-1.webp"} alt={t("013", "Tela de mídia indoor MK instalada em academia")} width={800} height={800} loading="lazy" /><div className="studio-photo-caption"><span><i /> {t("014", " Rede própria MK")}</span><span>{t("015", "Presença no mundo real ↗")}</span></div></div></div>
      <div className="studio-network-bottom"><div><p className="studio-eyebrow">{t("016", "Conexões locais. Presença regional.")}</p><NetworkMap cities={site!.cities} /></div><div><p className="studio-eyebrow">{content.stats.eyebrow}</p><h3 className="studio-stats-title">{content.stats.title}</h3><StatsRow items={content.stats.items} dark /><p className="studio-small">{t("017", "Consulte os pontos disponíveis e os formatos de veiculação para a sua campanha.")}</p><a href="#/midia-indoor" className="studio-text-link">{t("018", "Ver formatos e cobertura ")}<ArrowRight size={18} /></a></div></div>
    </div></section>}

    {visible("work") && <section key="work" className="studio-section mk-container" aria-labelledby="work-title"><div className="studio-section-heading"><Reveal><p className="studio-eyebrow">{t("019", "03 / Criação em ação")}</p><h2 id="work-title">{t("020", "Ideias que ganham")}<br /><span>{t("021", "forma e presença.")}</span></h2></Reveal><p>{t("022", "Peças de apresentação dos nossos serviços. Uma identidade que se adapta a diferentes telas, formatos e momentos.")}</p></div>
      <div className="studio-filters" role="group" aria-label={t("023", "Filtrar criativos")}>{[{ key: "all", label: t("024", "Todos") }, { key: "digital", label: t("025", "Digital") }, { key: "indoor", label: t("026", "Mídia indoor") }].map(f => <button key={f.key} onClick={() => setFilter(f.key)} aria-pressed={filter === f.key}>{f.label}</button>)}</div>
      <div className="studio-work-grid">{filteredWork.map((w, i) => <button className="studio-work" key={w.src} onClick={() => setLightbox(i)} aria-label={`Ampliar: ${w.title}`}><div className="studio-work-image"><img src={w.src} alt={w.title} width={1600} height={686} loading="lazy" /><span><Plus size={24} /></span></div><div className="studio-work-meta"><div><small>{w.category}</small><h3>{w.title}</h3></div><ArrowUpRight aria-hidden /></div></button>)}</div>
    </section>}

    {visible("concept") && <section key="concept" className="studio-manifesto"><div className="mk-container"><p className="studio-eyebrow">{content.concept.eyebrow} {t("027", " / MK Creative")}</p><h2>{t("028", "Digital ")}<span aria-hidden>✳</span> {t("029", " físico.")}<br />{t("030", "A mesma ")}<em>{t("031", "essência.")}</em></h2><div className="studio-manifesto-copy"><p>{content.concept.lead}</p><p>{content.concept.phrase}</p><a href="#/sobre">{t("032", "Conheça a MK ")}<ArrowUpRight /></a></div></div></section>}

    {visible("process") && <section key="process" className="studio-section mk-container"><div className="studio-section-heading"><Reveal><p className="studio-eyebrow">{t("033", "04 / Nosso jeito de fazer")}</p><h2>{t("034", "Boas ideias precisam")}<br /><span>{t("035", "de um bom caminho.")}</span></h2></Reveal><p>{t("036", "Você acompanha cada etapa. Do primeiro papo aos ajustes que fazem o trabalho evoluir.")}</p></div><ol className="studio-process">{content.process.map((step, i) => <li key={step.title}><span>0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>}

    {visible("promises") && <section key="promises" className="mk-container studio-trust"><div><p className="studio-eyebrow">{t("037", "Compromisso, sem asterisco.")}</p><h2>{t("038", "Clareza também")}<br />{t("039", "faz parte da entrega.")}</h2></div><div><ul>{content.promises.yes.map(t => <li key={t}><Check size={18} aria-hidden />{t}</li>)}</ul><details><summary>{t("040", "O que não prometemos ")}<Plus size={18} /></summary><ul>{content.promises.no.map(t => <li key={t}>{t}</li>)}</ul></details></div></section>}

    {blogVisible && posts.length > 0 && <section key="blog" className="studio-section mk-container"><div className="studio-section-heading"><div><p className="studio-eyebrow">{t("041", "Perspectivas / Blog MK")}</p><h2>{t("042", "Para pensar")}<br /><span>{t("043", "o próximo passo.")}</span></h2></div><a className="studio-text-link" href="#/blog">{t("044", "Todos os conteúdos ")}<ArrowUpRight /></a></div><div className="studio-posts">{posts.map(p => <a href={`#/blog/${p.slug}`} key={p.slug}><small>{p.category?.name || "Marketing & negócios"}</small><h3>{p.title}</h3><p>{p.excerpt}</p><ArrowUpRight /></a>)}</div></section>}

    {visible("faq") && <section key="faq" className="studio-section mk-container studio-faq"><div><p className="studio-eyebrow">{t("045", "Antes do primeiro papo")}</p><h2>{t("046", "Vamos tirar")}<br /><span>{t("047", "suas dúvidas.")}</span></h2><p>{t("048", "Transparência desde o início.")}</p></div><div><Faq items={content.faq} /><FaqJsonLd items={content.faq} /></div></section>}

    {visible("cta") && <section key="cta" className="studio-contact" id="conversa"><div className="mk-container studio-section studio-contact-grid"><div><p className="studio-eyebrow">{t("049", "O próximo movimento é seu.")}</p><h2>{t("050", "Vamos colocar")}<br />{t("051", "sua marca")}<br /><em>{t("052", "em evidência?")}</em></h2><p>{t("053", "Conte onde sua empresa está e aonde quer chegar. A gente começa por uma boa conversa.")}</p><WhatsAppButton label={t("054", "Conversar com a MK")} size="lg" /><p className="studio-contact-address">{site!.institution.addressCity} / {site!.institution.addressState}</p></div><div className="studio-form"><span className="studio-eyebrow">{t("055", "Comece por aqui ↗")}</span><h3>{t("056", "Qual é o seu próximo projeto?")}</h3><p>{t("057", "Deixe seu contato e conte um pouco sobre o que precisa.")}</p><LeadForm compact source="home-cta" /></div></div></section>}
    <Lightbox key="lightbox" items={filteredWork.map(w => ({ src: w.src, alt: w.title }))} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
  </HomeSections>;
}

function HomeSections({ children }: { children: ReactNode }) {
  const { site } = useSite();
  const order = site!.homeSections.map(s => s.key);
  const rank = (child: ReactNode) => { const key = isValidElement(child) ? String(child.key).split("$").at(-1)! : ""; const index = order.indexOf(key); return index < 0 ? 999 : index; };
  return <div className="mk-studio">{Children.toArray(children).sort((a,b) => rank(a)-rank(b))}</div>;
}

function StudioHero() {
  const t = useCopy("home");
  const { site, track, services } = useSite();
  const hero = site!.content.hero;
  const [channel, setChannel] = useState(0);
  const channels = site!.editorial.channels;
  const c = channels[channel] ?? channels[0];
  return <section className="studio-hero" aria-labelledby="hero-title"><div className="mk-container">
    <div className="studio-hero-top"><p><span /> {t("058", " Estúdio criativo. Visão integrada.")}</p><span>{site!.institution.addressCity} / {site!.institution.addressState}</span></div>
    <div className="studio-hero-grid"><div className="studio-hero-copy"><div className="studio-hero-kicker">{t("059", "ESTRATÉGIA. DESIGN. PRESENÇA.")}</div><h1 id="hero-title">{hero.titleA}<br /><em>{hero.titleB}</em><br />{hero.titleC}</h1><p>{hero.subtitle}</p><div className="studio-hero-actions"><a href={publicLink(hero.ctaPrimaryTo)} className="studio-button" onClick={() => track("cta_click", "hero-projeto")}>{hero.ctaPrimaryLabel} <ArrowUpRight size={21} /></a><a href={publicLink(hero.ctaSecondaryTo)} className="studio-secondary">{hero.ctaSecondaryLabel} <ArrowUpRight size={17} /></a></div><div className="studio-hero-note"><span aria-hidden>↳</span> {t("060", " Do primeiro clique ao encontro na sua cidade.")}</div></div>
      <div className="studio-art">
        <div className="studio-art-label"><span /> {t("061", " A conexão faz a diferença.")}</div>
        <img className="studio-hero-sculpture" src={site!.media.heroArtwork} srcSet={site!.media.heroArtwork === "/images/mk-conexao-960.webp" ? "/images/mk-conexao-640.webp 640w, /images/mk-conexao-960.webp 960w, /images/mk-conexao-1440.webp 1440w" : undefined} sizes="(max-width: 800px) 92vw, 48vw" alt={t("062", "Escultura laranja conectando uma tela digital a um painel de mídia: design e presença em uma só direção.")} width={1024} height={1024} fetchPriority="high" />
        <div className="studio-art-signature" aria-hidden>{t("063", "mk")}<span>®</span><small>{t("064", "IDEIAS QUE CONECTAM.")}</small></div>
        <div className="studio-channel-card">
          <div className="studio-channel" role="group" aria-label={t("065", "Explorar canais de presença")}>{channels.map((ch, i) => <button key={ch.name} aria-pressed={channel === i} onClick={() => setChannel(i)}>{i === 0 ? <Globe size={15} /> : <Monitor size={15} />}{ch.name}</button>)}</div>
          <div className="studio-channel-content" aria-live="polite"><p>{c?.label}</p><a href={publicLink(c?.href ?? "#/contato")} aria-label={c?.cta}><ArrowUpRight size={24} /></a></div>
        </div>
      </div></div>
    <div className="studio-hero-bottom"><p><span />{hero.badge}</p><button onClick={() => document.getElementById("solucoes")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}>{t("066", "Explore as possibilidades ")}<ArrowDown size={16} /></button><span>{t("067", "Digital e físico. Uma só estratégia.")}</span></div>
  </div></section>;
}
