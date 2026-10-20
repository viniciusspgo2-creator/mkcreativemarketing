"use client";

import { useCopy } from "@/components/site/use-copy";
import { useSite } from "@/components/app-shell";
import { publicLink } from "@/lib/cms";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./site-chrome";
export function WebsitePortfolio() {
  const t = useCopy("portfolio");
  const { site, track } = useSite();
  const portfolio = site!.portfolio;
  if (!portfolio.enabled) return null;
  const projects = portfolio.projects.filter(p => p.visible);
  if (!projects.length) return null;
  return <section className="mk-portfolio" id="portfolio" aria-labelledby="portfolio-title"><div className="mk-container sect-l">
    <div className="mk-portfolio-heading"><div><p className="text-kicker">{portfolio.eyebrow}</p><h2 id="portfolio-title">{portfolio.title}</h2></div><p>{portfolio.description}</p></div>
    <div className="mk-portfolio-grid">{projects.map((p,i) => <Reveal key={p.id} delay={i*60}><article className="mk-project">
      <a href={publicLink(p.url)} target="_blank" rel="noopener noreferrer" onClick={() => track("portfolio_click",p.name)} aria-label={`Abrir ${p.name}${p.demo ? " — demonstração" : ""}`} className="mk-project-preview"><div className="mk-browser-bar"><span aria-hidden>● ● ●</span><span>{p.demo ? "CONCEITO / DEMONSTRAÇÃO" : "PROJETO / WEB DESIGN"}</span><ArrowUpRight size={14}/></div><img src={p.image} alt={`Prévia do site ${p.name}`} width={1200} height={850} loading="lazy" /></a>
      <div className="mk-project-info"><div><p>{p.category}{p.demo && <span>{t("001", "Fictício")}</span>}</p><h3>{p.name}</h3></div><a href={publicLink(p.url)} target="_blank" rel="noopener noreferrer" aria-label={`Visitar ${p.name}`}><ArrowUpRight size={24}/></a></div><p className="mk-project-description">{p.description}</p>
    </article></Reveal>)}</div>
  </div></section>;
}
