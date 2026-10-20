"use client";

import { useCopy } from "@/components/site/use-copy";

// Sobre (A MK), Contato, Legais (privacidade/termos) e 404 — sistema editorial
import { useSite } from "@/components/app-shell";
import { Reveal, WhatsAppButton } from "@/components/site/site-chrome";
import { LeadForm } from "@/components/site/blocks";
import { SectionHead } from "@/components/site/mk-blocks";
import { SERVICES } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Check, Mail, MapPin, MessageCircle, Clock, ShieldCheck, FileText, ArrowUpRight } from "lucide-react";

// ── A MK ──
export function AboutPage() {
  const t = useCopy("institucional");
  const { site, navigate, services } = useSite();
  const about = site!.content.about;
  const concept = site!.content.concept;
  const inst = site!.institution;
  const heroImg = site?.media?.aboutImage || "/uploads/Indoor/indoor-tela-academia-1.webp";

  return (
    <div className="bg-[var(--mk-paper)]">
      {/* abertura editorial */}
      <section className="sect-l" aria-label={t("001", "Quem é a MK Creative")}>
        <div className="mk-container">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            <div>
              <SectionHead kicker={about.eyebrow} title={about.title} />
              <div className="mt-7">
                {about.paragraphs.map((p, i) => (
                  <Reveal key={i} variant="up" delay={i * 80}>
                    <p className="text-[#525252] leading-relaxed mb-4 max-w-2xl">{p}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal variant="up" delay={220}>
                <ul className="list-none flex flex-wrap gap-2.5 mt-8">
                  {about.highlights.map((h, i) => (
                    <li key={i} className="inline-flex items-center gap-2 bg-white border border-[#e3e3e3] rounded-full px-4 py-2 text-sm font-semibold text-[var(--mk-ink)]">
                      <Check className="w-4 h-4 text-[var(--mk-orange)]" aria-hidden /> {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal variant="pop" delay={140}>
              <figure className="mk-frame mk-screen">
                <div className="mk-frame-media relative aspect-[4/5]">
                  <img src={heroImg} alt={t("002", "Tela da rede MK Creative em operação")} className="w-full h-full object-cover" width={800} height={1000} />
                  <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm border border-white/15 rounded-full px-2.5 py-1" aria-hidden>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--mk-signal)] anim-blink" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/85">{t("003", "Rede própria MK")}</span>
                  </span>
                </div>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mk-about-gallery mk-container" aria-label={t("090", "A rede em diferentes espaços")}><p className="text-kicker">{t("090", "A rede em diferentes espaços")}</p><div><img src={site!.media.heroImages.secondary} alt={t("091", "Registro da rede MK em estabelecimento comercial")} width={900} height={600} loading="lazy"/><img src={site!.media.heroImages.tertiary} alt={t("092", "Outro ponto da rede de mídia indoor MK")} width={900} height={600} loading="lazy"/></div></section>

      {/* conceito */}
      <section className="bg-white border-y border-[#e3e3e3]" aria-label={t("004", "Conceito")}>
        <div className="mk-container sect-l">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                kicker={t("005", "O conceito")}
                title={<><span>{t("006", "Digital")}</span> <span className="text-[var(--mk-orange)]">+</span> <span>{t("007", "físico")}</span>{t("008", ", na prática.")}</>}
                lead={concept.lead}
              />
              <Reveal variant="up" delay={140}>
                <blockquote className="mt-8 border-l-[3px] border-[var(--mk-orange)] pl-6 py-1 font-display font-bold text-[var(--mk-ink)] text-xl sm:text-2xl tracking-tight max-w-lg">
                  {concept.phrase}
                </blockquote>
                <Button onClick={() => navigate({ view: "midia-indoor" })} className="mt-8 btn-fill rounded-full bg-transparent border-2 border-[var(--mk-ink)] text-[var(--mk-ink)] hover:text-white font-bold h-12 px-7 [--mk-fill:var(--mk-ink)]">
                  {t("009", "Conhecer a rede de telas")}</Button>
              </Reveal>
            </div>
            <div className="space-y-8">
              {concept.paragraphs.map((p, i) => (
                <Reveal key={i} variant="up" delay={i * 90} className="grid grid-cols-[52px_1fr] gap-x-5 py-2 border-t border-[#e3e3e3] first:border-t-2 first:border-[var(--mk-ink)] pt-6">
                  <span aria-hidden className="font-display font-bold text-2xl tracking-tight text-transparent" style={{ WebkitTextStroke: "1.2px var(--mk-orange)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[#443e37] leading-relaxed">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* dados da empresa */}
      <section aria-label={t("010", "Dados da empresa")}>
        <div className="mk-container sect-m">
          <SectionHead kicker={t("011", "Registro")} title={t("012", "Dados da empresa.")} />
          <Reveal variant="up" delay={120} className="mt-10 max-w-4xl">
            <dl className="grid sm:grid-cols-3 gap-px bg-[#e3e3e3] border border-[#e3e3e3] rounded-2xl overflow-hidden">
              <div className="bg-white p-6">
                <dt className="text-kicker text-[#a89e94] mb-2">{t("013", "Empresa")}</dt>
                <dd className="font-bold text-[var(--mk-ink)]">{inst.brandName}</dd>
                <dd className="text-sm text-[#525252]">{inst.legalName}</dd>
                <dd className="text-sm text-[#a89e94]">{t("014", "CNPJ ")}{inst.cnpj}</dd>
              </div>
              <div className="bg-white p-6">
                <dt className="text-kicker text-[#a89e94] mb-2">{t("015", "Endereço")}</dt>
                <dd className="text-[15px] text-[#3d3730]">{inst.addressStreet} — {inst.addressDistrict}</dd>
                <dd className="text-[15px] text-[#3d3730]">{inst.addressCity}/{inst.addressState}</dd>
              </div>
              <div className="bg-white p-6">
                <dt className="text-kicker text-[#a89e94] mb-2">{t("016", "E-mail comercial")}</dt>
                <dd><a href={`mailto:${inst.email}`} className="link-underline text-[var(--mk-orange-deep)] font-semibold break-all">{inst.email}</a></dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* o que a MK faz — linhas editoriais */}
      <section className="mk-dark mk-noise" aria-label={t("017", "Serviços da MK")}>
        <div className="mk-container sect-l relative">
          <SectionHead dark kicker={t("018", "Soluções")} title={t("019", "O que a MK faz por você.")} />
          <ol className="list-none mt-10">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} variant="up" delay={i * 50}>
                <button
                  onClick={() => navigate({ view: "servico", slug: s.slug })}
                  className="group w-full grid grid-cols-[64px_1fr_40px] sm:grid-cols-[90px_1fr_48px] gap-x-4 sm:gap-x-6 items-center py-6 border-t border-white/10 last:border-b text-left hover:bg-white/[0.03] transition-colors"
                >
                  <span aria-hidden className="font-display font-bold text-3xl tracking-tight text-transparent leading-none" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display font-bold text-xl sm:text-2xl tracking-tight text-white mb-0.5">{s.nav}</span>
                    <span className="block text-[15px] text-white/55 leading-relaxed max-w-2xl line-clamp-2">{s.cardText}</span>
                  </span>
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/15 flex items-center justify-center text-white/60 group-hover:border-[var(--mk-orange)] group-hover:text-[var(--mk-orange-hot)] group-hover:bg-[var(--mk-orange)] transition-all duration-300" aria-hidden>
                    <ArrowUpRight className="w-5 h-5 arr-slide" />
                  </span>
                </button>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

// ── Contato ──
export function ContactPage() {
  const t = useCopy("institucional");
  const { site } = useSite();
  const inst = site!.institution;
  const contact = site!.contact;
  const social = site!.social;

  return (
    <div className="bg-[var(--mk-paper)]">
      <section className="sect-l" aria-label={t("020", "Contato")}>
        <div className="mk-container">
          <SectionHead
            kicker={t("021", "Contato")}
            title={<>{t("022", "Vamos conversar sobre ")}<span className="text-[var(--mk-orange)]">{t("023", "a sua empresa")}</span>.</>}
            lead={t("024", "Escolha o canal: WhatsApp para resposta rápida, ou o formulário para nos contar com detalhes.")}
          />

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start mt-12">
            <div className="space-y-4">
              {contact.whatsapp && (
                <Reveal>
                  <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(contact.whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="block bg-white border border-[#e3e3e3] rounded-2xl p-6 hover:border-[#f3640a] transition-colors group">
                    <div className="flex items-center gap-4">
                      <span className="w-12 h-12 rounded-xl bg-[#f3640a]/15 text-[#c74a00] flex items-center justify-center shrink-0">
                        <MessageCircle className="w-6 h-6" aria-hidden />
                      </span>
                      <div>
                        <h2 className="font-bold text-[var(--mk-ink)]">{t("025", "WhatsApp ")}<span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">{t("026", "resposta rápida")}</span></h2>
                        <p className="text-sm text-[#525252]">{contact.whatsapp}</p>
                      </div>
                    </div>
                  </a>
                </Reveal>
              )}
              <Reveal delay={60}>
                <div className="bg-white border border-[#e3e3e3] rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[var(--mk-sand)] text-[var(--mk-orange-deep)] flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-bold text-[var(--mk-ink)]">{t("027", "E-mail")}</h2>
                      <a href={`mailto:${inst.email}`} className="text-sm text-[var(--mk-orange-deep)] font-semibold hover:underline break-all">{inst.email}</a>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="bg-white border border-[#e3e3e3] rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="w-12 h-12 rounded-xl bg-[var(--mk-sand)] text-[var(--mk-orange-deep)] flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-bold text-[var(--mk-ink)]">{t("028", "Endereço")}</h2>
                      <address className="not-italic text-sm text-[#525252]">
                        {inst.addressStreet} — {inst.addressDistrict}<br />
                        {inst.addressCity}/{inst.addressState}
                      </address>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${inst.addressStreet}, ${inst.addressCity}, ${inst.addressState}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm font-semibold text-[var(--mk-orange-deep)] ml-16"
                  >
                    {t("029", "Abrir no Google Maps →")}</a>
                </div>
              </Reveal>
              {contact.hours && (
                <Reveal delay={160}>
                  <div className="bg-white border border-[#e3e3e3] rounded-2xl p-6 flex items-center gap-4">
                    <span className="w-12 h-12 rounded-xl bg-[var(--mk-sand)] text-[var(--mk-orange-deep)] flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-bold text-[var(--mk-ink)]">{t("030", "Horário de atendimento")}</h2>
                      <p className="text-sm text-[#525252]">{contact.hours}</p>
                    </div>
                  </div>
                </Reveal>
              )}
              {(social.instagram || social.facebook || social.linkedin) && (
                <Reveal delay={180} className="flex gap-2.5">
                  {social.instagram && <SocialLink href={social.instagram} label={t("031", "Instagram")} />}
                  {social.facebook && <SocialLink href={social.facebook} label={t("032", "Facebook")} />}
                  {social.linkedin && <SocialLink href={social.linkedin} label={t("033", "LinkedIn")} />}
                </Reveal>
              )}
            </div>

            <Reveal variant="pop" delay={100}>
              <div className="bg-white rounded-2xl border border-[#e3e3e3] p-6 sm:p-8 shadow-[0_30px_70px_-30px_rgba(10,10,10,0.3)]">
                <h2 className="font-display font-bold text-2xl tracking-tight mb-1 text-[var(--mk-ink)]">{t("034", "Peça uma proposta")}</h2>
                <p className="text-[15px] text-[#525252] mb-6">{t("035", "Preencha e a MK responde em até 1 dia útil.")}</p>
                <LeadForm source="contato" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="bg-white border border-[#e3e3e3] rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--mk-ink)] hover:border-[var(--mk-orange)] transition-colors">
      {label}
    </a>
  );
}

// ── Legais ──
export function LegalPage({ kind }: { kind: "privacidade" | "termos" }) {
  const t = useCopy("institucional");
  const { site } = useSite();
  const inst = site!.institution;
  const isPrivacy = kind === "privacidade";

  return (
    <div className="bg-[var(--mk-paper)]">
      <article className="mk-container py-16 lg:py-24 max-w-[860px]">
        <Reveal variant="mask">
          <div className="flex items-center gap-3 mb-4">
            {isPrivacy ? <ShieldCheck className="w-7 h-7 text-[var(--mk-orange)]" aria-hidden /> : <FileText className="w-7 h-7 text-[var(--mk-orange)]" aria-hidden />}
            <p className="text-kicker text-[var(--mk-orange-deep)]">{t("036", "Documento")}</p>
          </div>
          <h1 className="text-display mb-10">{isPrivacy ? "Política de Privacidade" : "Termos de Uso"}</h1>
        </Reveal>

        <div className="mk-prose">
          {isPrivacy ? (
            <>
              <p>{t("037", "A ")}{inst.brandName} ({inst.legalName}{t("038", ", CNPJ ")}{inst.cnpj}{t("039", "), sediada em ")}{inst.addressStreet}, {inst.addressDistrict}, {inst.addressCity}/{inst.addressState}{t("040", ", respeita a sua privacidade e trata dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).")}</p>
              <h2>{t("041", "1. Quais dados coletamos")}</h2>
              <ul>
                <li><strong>{t("042", "Formulário de contato:")}</strong> {t("043", " nome, e-mail, telefone/WhatsApp, empresa, cidade e mensagem — para responder ao seu contato comercial.")}</li>
                <li><strong>{t("044", "Visitas ao site:")}</strong> {t("045", " métricas anônimas e agregadas (páginas vistas, dispositivo, origem de acesso). Usamos um identificador diário anônimo (hash), sem associar a dados pessoais.")}</li>
                <li><strong>{t("046", "Cookies:")}</strong> {t("047", " essenciais para o funcionamento do site e, somente com o seu consentimento, cookies de estatística. Você pode alterar a qualquer momento pelo botão \"Gerenciar cookies\" no rodapé.")}</li>
              </ul>
              <h2>{t("048", "2. Para que usamos")}</h2>
              <p>{t("049", "Os dados do formulário são usados exclusivamente para contato comercial sobre os serviços solicitados. As métricas de visita servem para melhorar o conteúdo e a navegação do site.")}</p>
              <h2>{t("050", "3. Compartilhamento")}</h2>
              <p>{t("051", "Não vendemos e não compartilhamos seus dados com terceiros para fins publicitários. Os dados ficam armazenados com acesso restrito à equipe da ")}{inst.brandName}.</p>
              <h2>{t("052", "4. Base legal")}</h2>
              <p>{t("053", "O tratamento se dá com base no seu ")}<strong>{t("054", "consentimento")}</strong> {t("055", " (art. 7º, I, da LGPD) ao enviar o formulário e aceitar os cookies, e no ")}<strong>{t("056", "legítimo interesse")}</strong> {t("057", " para as métricas anônimas do site.")}</p>
              <h2>{t("058", "5. Seus direitos")}</h2>
              <p>{t("059", "Você pode solicitar a qualquer momento: confirmação de tratamento, acesso aos dados, correção, anonimização, bloqueio ou eliminação de dados desnecessários, e a revogação do consentimento. Basta enviar um e-mail para ")}<a href={`mailto:${inst.email}`}>{inst.email}</a>.</p>
              <h2>{t("060", "6. Contato do encarregado (DPO)")}</h2>
              <p>{t("061", "Encarregado de dados: equipe ")}{inst.brandName} {t("062", " — e-mail: ")}<a href={`mailto:${inst.email}`}>{inst.email}</a>.</p>
              <h2>{t("063", "7. Atualização")}</h2>
              <p>{t("064", "Esta política pode ser atualizada a qualquer momento. A data da última revisão corresponde à publicação deste documento.")}</p>
            </>
          ) : (
            <>
              <p>{t("065", "Bem-vindo ao site da ")}{inst.brandName} ({inst.legalName}{t("066", ", CNPJ ")}{inst.cnpj}{t("067", "). Ao navegar e utilizar os formulários deste site, você concorda com os termos a seguir.")}</p>
              <h2>{t("068", "1. Sobre o conteúdo")}</h2>
              <p>{t("069", "Os conteúdos publicados neste site têm caráter informativo e educativo sobre os serviços da ")}{inst.brandName}{t("070", ": gestão do Perfil da Empresa no Google, redes sociais, tráfego pago, criação de sites, mídia indoor e comunicação visual. Não garantimos posicionamento em buscadores nem resultados específicos de campanha — isso depende de fatores externos ao nosso trabalho.")}</p>
              <h2>{t("071", "2. Uso permitido")}</h2>
              <p>{t("072", "Você pode navegar, ler os artigos e entrar em contato livremente. É proibido copiar, reproduzir ou utilizar o conteúdo do site para fins comerciais sem autorização prévia por escrito.")}</p>
              <h2>{t("073", "3. Formulários e contato")}</h2>
              <p>{t("074", "Ao enviar um formulário, você declara que os dados informados são seus e autoriza o contato comercial da ")}{inst.brandName} {t("075", " por e-mail ou WhatsApp. O uso segue a nossa ")}<strong>{t("076", "Política de Privacidade")}</strong>.</p>
              <h2>{t("077", "4. Propriedade intelectual")}</h2>
              <p>{t("078", "Marca, conteúdo, artes e fotografias deste site pertencem à ")}{inst.brandName} {t("079", " ou foram utilizados com autorização dos titulares. As fotos e vídeos da rede de mídia indoor são registros reais dos estabelecimentos parceiros.")}</p>
              <h2>{t("080", "5. Responsabilidade")}</h2>
              <p>{t("081", "O site é fornecido \"como está\". Não nos responsabilizamos por decisões tomadas com base apenas no conteúdo dos artigos, sem consultoria adequada ao seu caso.")}</p>
              <h2>{t("082", "6. Contato")}</h2>
              <p>{t("083", "Dúvidas sobre estes termos: ")}<a href={`mailto:${inst.email}`}>{inst.email}</a> — {inst.addressStreet}, {inst.addressDistrict}, {inst.addressCity}/{inst.addressState}.</p>
            </>
          )}
          <p className="text-xs text-[#a89e94] mt-8">{t("084", "Última atualização: ")}{new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
        </div>
      </article>
    </div>
  );
}

// ── 404 ──
export function NotFoundPage() {
  const t = useCopy("institucional");
  const { navigate } = useSite();
  return (
    <div className="bg-[var(--mk-paper)] min-h-[60vh] flex items-center">
      <div className="mk-container py-24 text-center max-w-3xl mx-auto">
        <p className="text-kicker text-[var(--mk-orange-deep)] mb-4">{t("085", "Erro 404")}</p>
        <h1 className="text-hero mb-5">{t("086", "Página fora do ar.")}</h1>
        <p className="text-lg text-[#525252] mb-8">{t("087", "O endereço que você tentou abrir não existe — mas a sua marca pode estar em todos os outros lugares.")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => navigate({ view: "home" })} className="rounded-full bg-[var(--mk-ink)] hover:bg-[var(--mk-ink-800)] text-white font-bold h-11 px-6">
            {t("088", "Voltar ao início")}</Button>
          <Button onClick={() => navigate({ view: "contato" })} variant="outline" className="rounded-full border-2 border-[var(--mk-ink)] font-bold h-11 px-6 bg-transparent hover:bg-[var(--mk-ink)] hover:text-white">
            {t("089", "Falar com a MK")}</Button>
        </div>
      </div>
    </div>
  );
}
