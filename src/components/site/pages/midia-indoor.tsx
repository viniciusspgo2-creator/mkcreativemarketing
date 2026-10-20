"use client";

import { useCopy } from "@/components/site/use-copy";

// Mídia Indoor — página principal da rede: hero com showreel em Vimeo,
// mapa interativo, etapas, cidades, galeria consistente com lightbox,
// formatos, transparência e formulário.
// Vídeos NUNCA por upload — hospedados no Vimeo/YouTube e incorporados por link.
import { useMemo, useState } from "react";
import { useSite } from "@/components/app-shell";
import { Reveal, WhatsAppButton } from "@/components/site/site-chrome";
import { FaqJsonLd, LeadForm, Lightbox } from "@/components/site/blocks";
import { SectionHead, StatsRow, NetworkMap, VideoFrame, EditorialList, BigCta } from "@/components/site/mk-blocks";
import { parseVideoUrl } from "@/lib/video";
import { Button } from "@/components/ui/button";
import { MonitorPlay, Play } from "lucide-react";

type AdFormat = { id?: string; name: string; description: string | null; specs: string | null };

export function MidiaIndoorPage() {
  const t = useCopy("indoor");
  const { site, track } = useSite();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const [requestedPlayback, setRequestedPlayback] = useState(false);

  const cities = site?.cities ?? [];
  const steps = site?.editorial.indoorSteps ?? site?.steps ?? [];
  const content = site?.content;

  const gallery = useMemo(() => {
    return (site?.gallery ?? []).filter((x) => (x.kind === "VIDEO" ? x.videoUrl : x.src));
  }, [site]);

  const videos = useMemo(() => gallery.filter((g) => g.kind === "VIDEO"), [gallery]);
  const photos = useMemo(() => gallery.filter((g) => g.kind === "PHOTO"), [gallery]);

  const lightboxItems = gallery.map((g) => {
    const video = g.kind === "VIDEO" ? parseVideoUrl(g.videoUrl ?? "") : null;
    return {
      src: g.src ?? g.poster ?? "",
      alt: g.caption ?? g.title,
      caption: g.caption ?? g.title,
      meta: [g.venue, g.dateLabel].filter(Boolean).join(" · "),
      videoUrl: video?.embedUrl ?? null,
    };
  });

  const featured = videos[activeVideo] ?? videos[0];
  const fallbackFormats: AdFormat[] = [
    { id: "1", name: "Spot em tela horizontal (16:9)", description: "Arte animada estática ou em vídeo para as TVs instaladas nos estabelecimentos.", specs: "Arte 1920×1080 · a MK produz a arte" },
    { id: "2", name: "Spot em totem vertical (9:16)", description: "Formato vertical para telas de totem em pontos de espera e circulação.", specs: "Arte 1080×1920 · a MK produz a arte" },
  ];
  const formatList: AdFormat[] = site?.editorial.indoorFormats ?? ((site?.formats ?? []).length ? (site!.formats as AdFormat[]) : fallbackFormats);

  const faq = site!.editorial.indoorFaq;

  return (
    <div className="bg-[var(--mk-paper)]">
      {/* ── Hero + showreel ── */}
      <section className="mk-dark mk-noise relative overflow-hidden" aria-label={t("001", "Mídia Indoor MK Creative")}>
        <div className="mk-container sect-l relative">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            <div>
              <Reveal variant="mask">
                <span className="inline-flex items-center gap-2 bg-[var(--mk-orange)] text-white text-xs font-bold px-3.5 py-2 rounded-full mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--mk-signal)] anim-blink" aria-hidden />
                  {t("002", "Rede própria · 4 cidades")}</span>
              </Reveal>
              <Reveal variant="mask" delay={90}>
                <h1 className="text-hero text-white mb-6">
                  {t("003", "Sua marca na")}<span className="text-[var(--mk-orange-hot)]">{t("004", "tela da loja")}</span> {t("005", "onde o seu cliente está agora.")}</h1>
              </Reveal>
              <Reveal variant="up" delay={170}>
                <p className="text-lead text-white/65 max-w-xl mb-9">
                  {t("006", "A MK Creative possui e opera uma rede própria de telas digitais em estabelecimentos comerciais de Bady Bassitt, Potirendaba, Monte Aprazível e José Bonifácio. Exibição recorrente em ambientes com circulação e permanência de público.")}</p>
              </Reveal>
              <Reveal variant="up" delay={250}>
                <div className="flex flex-wrap gap-3.5">
                  <Button size="lg" onClick={() => { track("cta_click", "midia-form"); document.getElementById("form-anunciar")?.scrollIntoView({ behavior: "smooth" }); }} className="h-12 px-7 bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold rounded-full">
                    {t("007", "Quero anunciar nas telas")}</Button>
                  <WhatsAppButton size="lg" label={t("008", "Solicitar mídia kit")} message="Olá! Quero receber o mídia kit da rede de telas da MK." />
                </div>
              </Reveal>
            </div>

            {/* player em destaque — moldura sofisticada */}
            {featured && (
              <Reveal variant="pop" delay={150}>
                <VideoFrame
                  key={featured.id}
                  autoPlay={requestedPlayback}
                  videoUrl={featured.videoUrl ?? ""}
                  poster={featured.poster}
                  title={featured.caption ?? featured.title}
                  ratio="9/16"
                  className="mk-indoor-player"
                  badge={t("009", "Em exibição na rede")}
                />
              </Reveal>
            )}
          </div>

          {/* seletor de criativos em vídeo */}
          {videos.length > 1 && (
            <div className="mt-10 lg:mt-14">
              <Reveal variant="up">
                <p className="text-kicker text-white mb-5 flex items-center gap-2.5">
                  <MonitorPlay className="w-4 h-4 text-[var(--mk-orange-hot)]" aria-hidden />
                  {t("010", "Criativos em movimento ·")}{videos.length} {t("011", "vídeos da rede")}</p>
              </Reveal>
              <Reveal variant="up" delay={100}>
                <div className="mk-hscroll">
                  {videos.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => { setActiveVideo(i); setRequestedPlayback(true); track("video_select", v.title); }}
                      className={`group relative w-[130px] sm:w-[155px] rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === activeVideo ? "border-[var(--mk-orange)] shadow-[0_10px_30px_-10px_rgba(243,100,10,0.6)]" : "border-white/30 hover:border-white/70"}`}
                      aria-label={`Ver vídeo: ${v.caption ?? v.title}`}
                      aria-pressed={i === activeVideo}
                    >
                      <span className="block aspect-[9/14] relative">
                        <img src={v.poster || parseVideoUrl(v.videoUrl ?? "")?.thumbnail || site!.media.menuVideo.poster} alt="" className="absolute inset-0 w-full h-full object-cover" width={300} height={470} loading="lazy" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />
                        {i === activeVideo && (
                          <span className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5" aria-hidden>
                            <span className="w-full h-1 rounded bg-[var(--mk-orange)]" />
                          </span>
                        )}
                      </span>
                      <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/55 backdrop-blur-sm border border-white/20 flex items-center justify-center" aria-hidden>
                        <Play className="w-3 h-3 text-white ml-px" fill="currentColor" />
                      </span>
                      <span className="block text-left p-2.5 text-[11px] text-white bg-[#161616] leading-snug min-h-[52px]">{v.caption ?? v.title}</span>
                    </button>
                  ))}
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* ── Como funciona — lista editorial numerada ── */}
      <section aria-label={t("012", "Como funciona anunciar")}>
        <div className="mk-container sect-l">
          <SectionHead
            index="01"
            kicker={t("013", "Como funciona")}
            title={t("014", "Da conversa à exibição, sem complicação.")}
            lead={t("015", "Cinco etapas — a MK conduz todas e produz a arte para você.")}
          />
          <div className="mt-10">
            <EditorialList
              items={(steps.length ? steps : [
                { id: "1", title: t("016", "Conversa inicial"), description: "Entendemos seu negócio, público e objetivo." },
                { id: "2", title: t("017", "Produção do anúncio"), description: "A MK produz a arte no formato das telas." },
                { id: "3", title: t("018", "Programação da campanha"), description: "Veiculação com exibição recorrente nos pontos." },
                { id: "4", title: t("019", "Exibição recorrente"), description: "Seu anúncio na programação das telas das cidades." },
                { id: "5", title: t("020", "Acompanhamento"), description: "Ajustes, renovação e evolução da campanha." },
              ]).map((s) => ({ title: s.title, text: s.description ?? "" }))}
            />
          </div>
        </div>
      </section>

      {/* ── Mapa + cidades + números ── */}
      <section className="mk-dark mk-noise" aria-label={t("021", "Cobertura da rede")}>
        <div className="mk-container sect-l relative">
          <SectionHead
            dark
            index="02"
            kicker={t("022", "Cobertura")}
            title={<>{t("023", "A rede na ")}<span className="text-[var(--mk-orange-hot)]">{t("024", "região")}</span>.</>}
            lead={t("025", "Sede em São José do Rio Preto e telas em quatro cidades. Passe o cursor nos pontos para conhecer.")}
          />
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 mt-10 items-start">
            <Reveal variant="pop">
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-7">
                <NetworkMap cities={cities} />
              </div>
            </Reveal>
            <div className="space-y-6">
              <Reveal variant="up" delay={120}>
                <StatsRow items={content?.stats.items ?? []} dark />
              </Reveal>
              <Reveal variant="up" delay={200}>
                <ul className="list-none grid sm:grid-cols-2 lg:grid-cols-1 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                  {cities.map((city) => (
                    <li key={city.id} className="bg-[var(--mk-ink)] px-5 py-4 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[var(--mk-orange)] shrink-0 mt-2" aria-hidden />
                      <div>
                        <p className="font-bold text-white text-[15px]">{city.name}</p>
                        <p className="text-sm text-white/50 leading-snug">{city.description ?? "Telas em estabelecimentos comerciais da cidade."}</p>
                      </div>
                    </li>
                  ))}
                  {cities.length === 0 && (
                    <li className="bg-[var(--mk-ink)] px-5 py-4 text-sm text-white/60">
                      {t("026", "As cidades da rede serão divulgadas em breve — fale com a MK para saber a disponibilidade.")}</li>
                  )}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Galeria real: fotos com grade consistente + lightbox ── */}
      <section aria-label={t("027", "A rede em operação")}>
        <div className="mk-container sect-l">
          <SectionHead
            index="03"
            kicker={t("028", "Prova real")}
            title={t("029", "A rede em operação.")}
            lead={t("030", "Fotos e vídeos reais das telas da MK funcionando em estabelecimentos comerciais. Sem render, sem simulação.")}
          />
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 mt-10">
              {photos.map((g, i) => (
                <Reveal key={g.id} variant="pop" delay={(i % 3) * 70}>
                  <button
                    onClick={() => setLightbox(gallery.findIndex((x) => x.id === g.id))}
                    className="group relative block w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#e3e3e3] hover:border-[var(--mk-orange)] transition-colors"
                    aria-label={`Ampliar foto: ${g.caption ?? g.title}`}
                  >
                    <img
                      src={g.src ?? ""}
                      alt={g.caption ?? g.title}
                      loading="lazy"
                      width={800} height={600}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[var(--mk-ink)]/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                    <span className="absolute bottom-0 inset-x-0 p-3.5 text-left translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xs font-bold text-white block">{g.venue}</span>
                      <span className="text-[10px] text-white/70 uppercase tracking-wide">{g.dateLabel}</span>
                    </span>
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[var(--mk-signal)] anim-blink" aria-hidden />
                  </button>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal variant="up" className="mt-10">
              <div className="bg-white border border-[#e3e3e3] rounded-2xl p-10 text-center">
                <p className="text-[15px] text-[#525252] max-w-md mx-auto">
                  {t("031", "As fotos da rede em operação estão em revisão de autorização para divulgação. Fale com a MK para conhecer as telas de perto.")}</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Formatos ── */}
      <section className="bg-white border-y border-[#e3e3e3]" aria-label={t("032", "Formatos de anúncio")}>
        <div className="mk-container sect-m">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
            <SectionHead
              index="04"
              kicker={t("033", "Formatos")}
              title={t("034", "Dois formatos, uma produção só nossa.")}
              lead={t("035", "Formatos definidos junto com você — a MK produz a arte no padrão exato de cada tela.")}
              className="lg:sticky lg:top-28"
            />
            <div className="space-y-4">
              {formatList.map((f, i) => (
                <Reveal key={f.id ?? f.name} variant="up" delay={i * 90} className="group bg-[var(--mk-paper)] border border-[#e3e3e3] rounded-2xl p-6 sm:p-7 hover:border-[var(--mk-orange)] transition-colors">
                  <div className="flex items-start gap-5">
                    <span aria-hidden className={`hidden sm:block border-2 border-[var(--mk-ink)]/20 rounded-md shrink-0 mt-1 ${i === 0 ? "w-14 h-8" : "w-8 h-14"}`} />
                    <div>
                      <h3 className="font-display font-bold text-xl tracking-tight text-[var(--mk-ink)] mb-1">{f.name}</h3>
                      <p className="text-[15px] text-[#525252] leading-relaxed">{f.description}</p>
                      {f.specs && <p className="text-xs text-[#a89e94] mt-2.5 font-mono uppercase tracking-wide">{f.specs}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparência ── */}
      <section className="mk-dark" aria-label={t("036", "Transparência sobre medição")}>
        <div className="mk-container sect-m">
          <BigCta
            title={<>{t("037", "Como medimos —")}<br />{t("038", "e o que ")}<span className="text-[var(--mk-orange-hot)]">{t("039", "não prometemos")}</span>.</>}
            text={t("040", "A MK não inventa números de audiência. Garantimos a exibição recorrente da sua campanha na programação das telas, em ambientes com circulação e permanência de público. Quando houver números reais e auditáveis da rede, eles serão divulgados aqui — com orgulho.")}
            action={
              <WhatsAppButton size="lg" label={t("041", "Tirar dúvidas no WhatsApp")} message="Olá! Quero entender como funciona a exibição nas telas da MK." />
            }
          />
        </div>
      </section>

      {/* ── Formulário Quero anunciar ── */}
      <section id="form-anunciar" aria-label={t("042", "Quero anunciar nas telas")}>
        <div className="mk-container sect-l">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHead
                index="05"
                kicker={t("043", "Quero anunciar")}
                title={t("044", "Vamos colocar a sua marca nas telas.")}
                lead={t("045", "Conte para qual cidade e qual público você quer anunciar. A MK responde com a disponibilidade da rede e as opções de veiculação — e produz a arte para você.")}
              />
              <div className="space-y-3 mt-9">
                {faq.map((f, i) => (
                  <Reveal key={i} variant="up" delay={i * 60}>
                    <details className="group bg-white border border-[#e3e3e3] rounded-xl px-5 py-4 open:border-[var(--mk-orange)]/50">
                      <summary className="font-bold text-[15px] cursor-pointer list-none flex items-center justify-between gap-3 min-h-[28px] text-[var(--mk-ink)]">
                        {f.q}
                        <span className={`w-7 h-7 rounded-full border border-[#e3e3e3] flex items-center justify-center shrink-0 transition-transform duration-300 group-open:rotate-45 group-open:border-[var(--mk-orange)] group-open:text-[var(--mk-orange)]`} aria-hidden>+</span>
                      </summary>
                      <p className="text-[15px] text-[#525252] leading-relaxed mt-3">{f.a}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal variant="pop" delay={120} className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-[#e3e3e3] p-6 sm:p-8 shadow-[0_30px_70px_-30px_rgba(10,10,10,0.3)]">
                <h3 className="font-display font-bold text-2xl tracking-tight mb-1 text-[var(--mk-ink)]">{t("046", "Quero anunciar nas telas")}</h3>
                <p className="text-[15px] text-[#525252] mb-6">{t("047", "Resposta rápida — sem compromisso.")}</p>
                <LeadForm service="MIDIA_INDOOR" source="midia-indoor" cityField compact />
              </div>
            </Reveal>
          </div>
          <FaqJsonLd items={faq} />
        </div>
      </section>

      <Lightbox items={lightboxItems} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </div>
  );
}
