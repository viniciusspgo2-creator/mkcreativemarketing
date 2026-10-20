import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import "./brand-v3.css";
import { Toaster } from "@/components/ui/toaster";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MK Creative — Marketing, Mídia Indoor e Comunicação Visual em São José do Rio Preto/SP",
  description:
    "Presença digital e física para empresas locais: Google, redes sociais, sites, tráfego pago, mídia indoor com rede própria de telas e comunicação visual. São José do Rio Preto/SP e região.",
  keywords: ["marketing", "mídia indoor", "São José do Rio Preto", "SEO local", "redes sociais", "comunicação visual", "MK Creative"],
  authors: [{ name: "MK Creative" }],
  metadataBase: new URL("https://mktvmarketing.com.br"),
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "MK Creative — Do Google à fachada",
    description: "Presença digital e física para empresas locais: do Google à tela da loja onde o cliente está.",
    url: "https://mktvmarketing.com.br",
    siteName: "MK Creative",
    images: [{ url: "/og-mk-creative.jpg", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MK Creative — Do Google à fachada",
    description: "Presença digital e física para empresas locais, com rede própria de mídia indoor.",
    images: ["/og-mk-creative.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
