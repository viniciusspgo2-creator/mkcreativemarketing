"use client";

import { useCopy } from "@/components/site/use-copy";

// Soluções (índice editorial com preview no hover) + página de serviço
// (Google & SEO Local com lista 01–09, mockup de Perfil da Empresa no
// Google e bloco antes/depois; demais serviços com o mesmo sistema).
import { WebsitePortfolio } from "@/components/site/portfolio";
import { useSite } from "@/components/app-shell";
import { Reveal, WhatsAppButton } from "@/components/site/site-chrome";
import { Faq, FaqJsonLd, LeadForm } from "@/components/site/blocks";
import { SectionHead, EditorialList, GbpMockup, BeforeAfter, BigCta } from "@/components/site/mk-blocks";
import { SERVICES } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Check } from "lucide-react";
import { useEffect, useState } from "react";

export function SolutionsPage() {
  const t = useCopy("servicos");
  const { site, navigate, track, services } = useSite();
  const [active, setActive] = useState(0);
  const media = site?.media;
  const imgFor = (slug: string) => media?.serviceImages?.[slug];

  return (
    <div className="bg-[var(--mk-paper)]">
      {/* hero */}
      <section className="sect-l" aria-label={t("001", "Soluções da MK Creative")}>
        <div className="mk-container">
          <SectionHead
            index="✳"
            kicker={t("002", "Soluções")}
            title={<>{t("003", "Seis frentes.")}<br /><span className="text-[var(--mk-orange)]">{t("004", "Uma presença só.")}</span></>}
            lead={t("005", "Do Perfil da Empresa no Google à fachada do seu negócio: a MK planeja e executa os pontos de contato que fazem o cliente encontrar — e confiar — na sua empresa.")}
          />
        </div>
      </section>

      {/* lista editorial + preview */}
      <section className="bg-white border-y border-[#e3e3e3]" aria-label={t("006", "Lista de soluções")}>
        <div className="mk-container sect-l">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-start">
            <ol className="list-none" onMouseLeave={() => setActive((a) => (a < 0 ? 0 : a))}>
              {services.map((s, i) => (
                <Reveal as="li" key={s.slug} variant="up" delay={i * 50}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => { track("cta_click", `servico-${s.slug}`); navigate({ view: "servico", slug: s.slug }); }}
                    className={`group w-full grid grid-cols-[64px_1fr_40px] sm:grid-cols-[90px_1fr_48px] gap-x-4 sm:gap-x-6 items-center py-6 sm:py-7 border-t border-[#e3e3e3] last:border-b text-left transition-colors duration-300 ${active === i ? "bg-[var(--mk-paper)]" : ""}`}
                    aria-label={`Conhecer ${s.cardTitle}`}
                  >
                    <span
                      aria-hidden
                      className={`font-display font-bold text-3xl sm:text-4xl tracking-tight leading-none transition-colors duration-300 ${active === i ? "text-[var(--mk-orange)]" : "text-[var(--mk-sand)]"}`}
                      style={{ WebkitTextStroke: "1.5px var(--mk-orange)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className={`block font-display font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight mb-1 transition-colors ${active === i ? "text-[var(--mk-orange-deep)]" : "text-[var(--mk-ink)]"}`}>
                        {s.cardTitle}
                      </span>
                      <span className="block text-[15px] text-[#525252] leading-relaxed max-w-xl">{s.cardText}</span>
                    </span>
                    <span className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${active === i ? "border-[var(--mk-orange)] bg-[var(--mk-orange)] text-white" : "border-[#e3e3e3] text-[#a89e94]"}`} aria-hidden>
                      <ArrowUpRight className="w-5 h-5 arr-slide" />
                    </span>
                  </button>
                </Reveal>
              ))}
            </ol>

            {/* preview sticky — troca conforme a linha sob o cursor */}
            <Reveal variant="pop" delay={120} className="hidden lg:block lg:sticky lg:top-28">
              <div className="relative">
                {services.map((s, i) => {
                  const img = imgFor(s.slug);
                  return (
                    <figure
                      key={s.slug}
                      aria-hidden={active !== i}
                      className={`transition-all duration-500 ${active === i ? "opacity-100 translate-y-0 relative" : "opacity-0 translate-y-3 pointer-events-none absolute inset-0"}`}
                    >
                      {img ? (
                        <div className="mk-frame">
                          <div className="mk-frame-media aspect-[4/3] relative">
                            <img src={img} alt="" className="w-full h-full object-cover" width={800} height={600} loading="lazy" />
                          </div>
                        </div>
                      ) : (
                        <div className="mk-frame">
                          <div className="mk-frame-media aspect-[4/3] bg-gradient-to-br from-[#1c1c1c] to-[var(--mk-ink)] flex items-center justify-center">
                            <span className="font-display font-bold text-5xl tracking-tight text-[var(--mk-orange)]">{s.cardTitle.split(" ")[0]}</span>
                          </div>
                        </div>
                      )}
                      <figcaption className="mt-3.5 flex items-center justify-between text-sm">
                        <span className="font-bold text-[var(--mk-ink)]">{s.cardTitle}</span>
                        <span className="text-[#a89e94] font-semibold text-xs uppercase tracking-wider">{t("007", "MK Creative")}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mk-dark mk-noise" aria-label={t("008", "Fale com a MK")}>
        <div className="mk-container sect-l relative">
          <BigCta
            title={<>{t("009", "Não sabe por onde ")}<span className="text-[var(--mk-orange-hot)]">{t("010", "começar")}</span>?</>}
            text={t("011", "Normal. Conte o momento da sua empresa — a MK responde com o plano certo, na ordem certa.")}
            action={<WhatsAppButton size="lg" label={t("012", "Conversar com a MK")} className="inline-block" />}
          />
        </div>
      </section>
    </div>
  );
}

export function ServicePage({ slug }: { slug: string }) {
  const t = useCopy("servicos");
  const { site, navigate, track, services } = useSite();
  const service = services.find((s) => s.slug === slug);
  const isGoogle = service?.key === "GOOGLE_SEO";
  const isIndoor = service?.key === "MIDIA_INDOOR";
  const media = site?.media;
  const galleryPhotos = (site?.gallery ?? []).filter((g) => g.kind === "PHOTO" && g.src);

  useEffect(() => {
    if (!service && slug) {
      navigate({ view: "servicos" });
    }
  }, [service, slug, navigate]);

  if (!service) return null;
  const heroImg = media?.serviceImages?.[service.slug];
  const waMsg = `Olá! Vim pelo site da MK e quero falar sobre ${service.nav}.`;

  return (
    <div className="bg-[var(--mk-paper)]">
      {/* ── Hero do serviço ── */}
      <section className={`relative overflow-hidden ${isIndoor ? "mk-dark mk-noise" : ""}`} aria-label={service.h1}>
        <div className={`mk-container sect-l relative ${isIndoor ? "" : "pt-10"}`}>
          {!isIndoor && (
            <nav aria-label={t("013", "Trilha de navegação")} className="mb-8 text-xs font-semibold text-[#a89e94]">
              <button onClick={() => navigate({ view: "home" })} className="hover:text-[var(--mk-orange-deep)]">{t("014", "Início")}</button>
              <span className="mx-2" aria-hidden>/</span>
              <button onClick={() => navigate({ view: "servicos" })} className="hover:text-[var(--mk-orange-deep)]">{t("015", "Soluções")}</button>
              <span className="mx-2" aria-hidden>/</span>
              <span className="text-[var(--mk-ink)]">{service.nav}</span>
            </nav>
          )}
          {isIndoor && (
            <nav aria-label={t("016", "Trilha de navegação")} className="mb-8 text-xs font-semibold text-white/40">
              <button onClick={() => navigate({ view: "home" })} className="hover:text-[var(--mk-orange-hot)]">{t("017", "Início")}</button>
              <span className="mx-2" aria-hidden>/</span>
              <button onClick={() => navigate({ view: "servicos" })} className="hover:text-[var(--mk-orange-hot)]">{t("018", "Soluções")}</button>
              <span className="mx-2" aria-hidden>/</span>
              <span className="text-white/80">{service.nav}</span>
            </nav>
          )}
          <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isIndoor ? "" : ""}`}>
            <div>
              <Reveal variant="mask">
                <p className={`text-kicker mb-4 ${isIndoor ? "text-[var(--mk-orange-hot)]" : "text-[var(--mk-orange-deep)]"}`}>{service.heroKicker}</p>
              </Reveal>
              <Reveal variant="mask" delay={80}>
                <h1 className={`text-hero mb-6 ${isIndoor ? "text-white" : "text-[var(--mk-ink)]"}`}>{service.h1}</h1>
              </Reveal>
              <Reveal variant="up" delay={160}>
                <p className={`text-lead mb-9 max-w-xl ${isIndoor ? "text-white/65" : ""}`}>{service.lead}</p>
              </Reveal>
              <Reveal variant="up" delay={240}>
                <div className="flex flex-wrap gap-3.5">
                  <WhatsAppButton size="lg" label={service.cta.label} message={waMsg} />
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => { track("cta_click", `form-${service.slug}`); navigate({ view: "contato" }); }}
                    className={`btn-fill h-12 px-7 rounded-full border-2 font-bold bg-transparent ${isIndoor ? "border-white/60 text-white hover:text-[var(--mk-ink)] [--mk-fill:#fff]" : "border-[var(--mk-ink)] text-[var(--mk-ink)] hover:text-white [--mk-fill:var(--mk-ink)]"}`}
                  >
                    {t("019", "Pedir proposta")}</Button>
                </div>
              </Reveal>
            </div>
            {heroImg && (
              <Reveal variant="pop" delay={140}>
                <figure className="mk-frame">
                  <div className="mk-frame-media aspect-[4/3] relative">
                    <img src={heroImg} alt={`Arte MK — ${service.cardTitle}`} className="w-full h-full object-cover" width={800} height={600} />
                  </div>
                </figure>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Intro + entregáveis (Google: lista 01–09 + mockup sticky) ── */}
      <section aria-label={t("020", "O que está incluído")}>
        <div className="mk-container sect-l">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
            <div>
              <SectionHead
                kicker={t("021", "Visão geral")}
                title={service.deliverablesTitle}
              />
              <div className="mt-6 mb-2">
                {service.intro.map((p, i) => (
                  <Reveal key={i} variant="up" delay={i * 80}>
                    <p className="text-[#525252] leading-relaxed mb-4 max-w-2xl">{p}</p>
                  </Reveal>
                ))}
              </div>
              {service.forWho && (
                <Reveal variant="up" delay={140}>
                  <div className="mt-6 bg-[var(--mk-sand)] rounded-2xl p-6 border border-[#e3e3e3] max-w-2xl">
                    <h3 className="font-bold text-[15px] mb-1.5 flex items-center gap-2 text-[var(--mk-ink)]">
                      <Check className="w-4 h-4 text-[var(--mk-orange)]" aria-hidden /> {t("022", "Para quem é")}</h3>
                    <p className="text-[15px] text-[#525252] leading-relaxed">{service.forWho}</p>
                  </div>
                </Reveal>
              )}
            </div>
            {isGoogle && (
              <Reveal variant="pop" delay={140} className="hidden lg:block lg:sticky lg:top-28">
                <GbpMockup photos={galleryPhotos.map((g) => g.src!).slice(0, 4)} />
                <p className="text-center text-xs text-[#a89e94] mt-4 font-medium">
                  {t("023", "É assim que um perfil bem cuidado apresenta a sua empresa.")}</p>
              </Reveal>
            )}
          </div>

          {/* lista editorial numerada */}
          <div className="mt-14">
            <EditorialList items={service.deliverables} />
          </div>
        </div>
      </section>

      {/* ── Google: antes/depois + mockup mobile ── */}
      {isGoogle && (
        <>
          <section className="bg-white border-y border-[#e3e3e3]" aria-label={t("024", "Antes e depois da gestão Google")}>
            <div className="mk-container sect-l">
              <SectionHead
                kicker={t("025", "A diferença")}
                title={<>{t("026", "Perfil parado e perfil ")}<span className="text-[var(--mk-orange)]">{t("027", "trabalhado")}</span>.</>}
                lead={t("028", "O Perfil da Empresa no Google é a primeira impressão de quem pesquisa. A diferença entre os dois cenários abaixo aparece no mapa, na busca e no telefone da sua empresa.")}
              />
              <div className="mt-12">
                <BeforeAfter />
              </div>
              <Reveal variant="up" delay={140} className="mt-10 lg:hidden">
                <GbpMockup photos={galleryPhotos.map((g) => g.src!).slice(0, 4)} />
              </Reveal>
            </div>
          </section>

          <section className="mk-dark mk-noise" aria-label={t("029", "Começar a gestão Google")}>
            <div className="mk-container sect-l relative">
              <BigCta
                title={<>{t("030", "Sua empresa merece ")}<span className="text-[var(--mk-orange-hot)]">{t("031", "aparecer bem")}</span> {t("032", " no Google.")}</>}
                text={service.cta.text}
                action={<WhatsAppButton size="lg" label={service.cta.label} message={waMsg} className="inline-block" />}
              />
            </div>
          </section>
        </>
      )}

      {service.key === "CRIACAO_SITES" && <WebsitePortfolio />}

      {/* ── Processo (se existir) — linhas editoriais ── */}
      {service.process && service.process.length > 0 && (
        <section className="bg-white border-y border-[#e3e3e3]" aria-label={t("033", "Processo de trabalho")}>
          <div className="mk-container sect-l">
            <SectionHead kicker={t("034", "Passo a passo")} title={t("035", "Como acontece.")} />
            <div className="mt-10">
              <EditorialList items={service.process} />
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {service.faq.length > 0 && (
        <section aria-label={t("036", "Perguntas frequentes sobre o serviço")}>
          <div className="mk-container sect-l">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
              <SectionHead
                kicker={t("037", "FAQ")}
                title={t("038", "Perguntas honestas, respostas honestas.")}
                className="lg:sticky lg:top-28"
              />
              <Reveal variant="up" delay={120}>
                <Faq items={service.faq} />
              </Reveal>
            </div>
            <FaqJsonLd items={service.faq} />
          </div>
        </section>
      )}

      {/* ── CTA final ── */}
      {!isGoogle && (
        <section className="mk-dark mk-noise" aria-label={t("039", "Falar sobre o serviço")}>
          <div className="mk-container sect-l relative">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <BigCta
                title={service.cta.title}
                text={service.cta.text}
                action={<WhatsAppButton size="lg" label={service.cta.label} message={waMsg} className="inline-block" />}
              />
              <Reveal variant="pop" delay={140}>
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <h3 className="font-display font-bold text-2xl tracking-tight mb-1 text-[var(--mk-ink)]">{t("040", "Ou prefere que a MK te chame?")}</h3>
                  <p className="text-[15px] text-[#525252] mb-6">{t("041", "Deixe seus dados — sem compromisso.")}</p>
                  <LeadForm compact service={service.key} source={`servico-${service.slug}`} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <ServiceJsonLd service={service} />
    </div>
  );
}

function ServiceJsonLd({ service }: { service: (typeof SERVICES)[number] }) {
  useEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: service.nav,
          description: service.seo.description,
          provider: { "@type": "Organization", name: "MK Creative" },
          areaServed: ["São José do Rio Preto", "Bady Bassitt", "Potirendaba", "Monte Aprazível", "José Bonifácio"],
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "https://mktvmarketing.com.br/" },
            { "@type": "ListItem", position: 2, name: "Soluções", item: "https://mktvmarketing.com.br/#/servicos" },
            { "@type": "ListItem", position: 3, name: service.nav },
          ],
        },
      ],
    });
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, [service.key]);
  return null;
}
