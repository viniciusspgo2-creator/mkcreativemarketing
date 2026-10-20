"use client";

// Raiz do site público: escolhe a view pela rota + JSON-LD institucional
import { useEffect, useMemo, type CSSProperties } from "react";
import { useSite } from "@/components/app-shell";
import { SiteHeader, SiteFooter, WhatsAppFloat, CookieBanner } from "@/components/site/site-chrome";
import { AnalyticsIntegrations } from "./analytics-integrations";
import { HomePage } from "@/components/site/pages/home";
import { SolutionsPage, ServicePage } from "@/components/site/pages/services";
import { MidiaIndoorPage } from "@/components/site/pages/midia-indoor";
import { BlogPage, ArticlePage } from "@/components/site/pages/blog";
import { AboutPage, ContactPage, LegalPage, NotFoundPage } from "@/components/site/pages/institutional";

export function PublicSite() {
  const { site, route } = useSite();

  // JSON-LD: Organization + LocalBusiness (base, em todas as páginas públicas)
  const jsonLd = useMemo(() => {
    if (!site) return "";
    const inst = site.institution;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: inst.brandName,
          legalName: inst.legalName,
          url: "https://mktvmarketing.com.br",
          email: inst.email,
          logo: site.media.brand.logoHeader,
          address: {
            "@type": "PostalAddress",
            streetAddress: inst.addressStreet,
            addressLocality: inst.addressCity,
            addressRegion: inst.addressState,
            addressCountry: "BR",
          },
        },
        {
          "@type": "LocalBusiness",
          name: inst.brandName,
          email: inst.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${inst.addressStreet}, ${inst.addressDistrict}`,
            addressLocality: inst.addressCity,
            addressRegion: inst.addressState,
            addressCountry: "BR",
          },
          areaServed: ["São José do Rio Preto", "Bady Bassitt", "Potirendaba", "Monte Aprazível", "José Bonifácio"],
          description: site.seo.pages.home.description,
        },
      ],
    });
  }, [site]);

  useEffect(() => {
    if (jsonLd) {
      let el = document.getElementById("mk-jsonld-org");
      if (!el) {
        el = document.createElement("script");
        el.id = "mk-jsonld-org";
        (el as HTMLScriptElement).type = "application/ld+json";
        document.head.appendChild(el);
      }
      el.textContent = jsonLd;
    }
  }, [jsonLd]);

  if (!site) return null;

  if (site.features.maintenance) return <div className="mk-public min-h-screen flex items-center justify-center bg-white px-6 text-center"><div><img src={site.media.brand.logoHeader} alt={site.institution.brandName} width={140} height={53} className="mx-auto mb-8"/><h1 className="text-display">Estamos preparando novidades.</h1><p className="mt-5 mb-6">Enquanto isso, converse com a nossa equipe.</p><a href={`mailto:${site.institution.email}`} className="underline">{site.institution.email}</a></div></div>;

  let view: React.ReactNode;
  switch (route.view) {
    case "home": view = <HomePage />; break;
    case "servicos": view = <SolutionsPage />; break;
    case "servico": view = <ServicePage slug={route.slug} />; break;
    case "midia-indoor": view = <MidiaIndoorPage />; break;
    case "blog": view = <BlogPage />; break;
    case "artigo": view = <ArticlePage key={route.slug} slug={route.slug} />; break;
    case "sobre": view = <AboutPage />; break;
    case "contato": view = <ContactPage />; break;
    case "privacidade": view = <LegalPage kind="privacidade" />; break;
    case "termos": view = <LegalPage kind="termos" />; break;
    default: view = <NotFoundPage />;
  }

  return (
    <div style={{ "--mk-orange":site.appearance.orange, "--mk-ink":site.appearance.ink, "--mk-paper":site.appearance.paper, "--mk-sand":site.appearance.surface, "--mk-body-size":`${site.appearance.bodySize}px`, "--mk-radius":`${site.appearance.radius}px`, "--mk-heading-font":site.appearance.headingFont === "inter" ? "var(--font-inter)" : "var(--font-bricolage)" } as CSSProperties} className="mk-public min-h-screen flex flex-col bg-[var(--mk-paper)]">
      <SiteHeader />
      <main tabIndex={-1} id="conteudo" className="flex-1" role="main">
        {view}
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <CookieBanner />
      <AnalyticsIntegrations />
    </div>
  );
}
