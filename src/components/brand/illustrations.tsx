/**
 * MK Creative — "Sinal ligado" SVG illustration system.
 *
 * ONE flat editorial style:
 * - 2 colors: ink + brand orange. Signal-yellow is reserved for
 *   screens / online indicators / illuminated signage micro-details.
 * - Stroke width 2, round caps + joins, corner radius 10–14,
 *   flat fills (paper / sand at low opacity), no gradients, no 3D.
 *
 * Animation hooks (defined by the parent app's CSS):
 * - .anim-draw       → dashed paths (animate stroke-dashoffset)
 * - .anim-pulse-dot  → pulsing map dots
 * - .anim-blink      → screen power dots
 * See ILLUSTRATION_HINT below.
 */

import type { ReactNode } from "react";

export type IllProps = { className?: string };
export type IconProps = IllProps & { strokeWidth?: number };

/* Brand tokens (overridable via CSS variables) */
const INK = "var(--ill-ink, #0A0A0A)";
const ORANGE = "var(--ill-orange, #F3640A)";
const SIGNAL = "var(--ill-signal, #FFD23F)"; // screens / online indicators ONLY
const PAPER = "var(--ill-paper, #FAF7F3)";
const SAND = "var(--ill-sand, #EFE9E2)";

const fit = {
  width: "100%",
  height: "auto",
  preserveAspectRatio: "xMidYMid meet" as const,
};

export const ILLUSTRATION_HINT =
  "MK illustration animation hooks — define in globals.css: " +
  ".anim-draw { /* dashed paths: animate stroke-dashoffset from path length to 0, e.g. @keyframes ill-draw { to { stroke-dashoffset: 0 } } with stroke-dashoffset set to the path length initially */ } " +
  ".anim-pulse-dot { transform-box: fill-box; transform-origin: center; animation: ill-pulse 2.4s ease-in-out infinite; } " +
  ".anim-blink { animation: ill-blink 1.6s steps(2, jump-none) infinite; } " +
  "Apply .anim-draw to dashed orange connector paths, .anim-pulse-dot to the HQ node in IllNetworkMap, " +
  ".anim-blink to yellow power dots on screens. Wrap all three in @media (prefers-reduced-motion: no-preference).";

/* ------------------------------------------------------------------ */
/* 1. Hero scene — digital → physical                                  */
/* ------------------------------------------------------------------ */

export function IllDigitalPhysical({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Cena sinal ligado: celular com feed social e mapa conectados por um trajeto pontilhado até uma TV de loja e uma fachada com letras MK"
      viewBox="0 0 720 400"
      {...fit}
      className={className}
      fill="none"
    >
      {/* ground line */}
      <path d="M32 352H688" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />

      {/* left — map card floating above the phone */}
      <g id="hero-map-card">
        <rect x={52} y={54} width={196} height={116} rx={14} fill={SAND} />
        <rect x={44} y={44} width={196} height={116} rx={14} fill={PAPER} stroke={INK} strokeWidth={2} />
        {/* search bar */}
        <rect x={58} y={58} width={118} height={18} rx={9} fill={SAND} />
        <circle cx={68} cy={67} r={4.5} stroke={INK} strokeWidth={2} fill={PAPER} />
        <path d="M71.3 70.3 74.5 73.5" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        {/* route */}
        <path d="M160 124C140 134 118 136 98 150" stroke={INK} strokeWidth={2} strokeDasharray="3 6" strokeLinecap="round" opacity={0.5} />
        {/* location pin */}
        <path d="M168 88c-8.3 0-14 6-14 13.4C154 111.2 168 124 168 124s14-12.8 14-22.6C182 94 176.3 88 168 88z" fill={ORANGE} />
        <circle cx={168} cy={101} r={4.5} fill={PAPER} />
      </g>

      {/* left — smartphone with social feed */}
      <g id="hero-phone">
        <rect x={98} y={176} width={134} height={176} rx={14} fill={PAPER} stroke={INK} strokeWidth={2} />
        <rect x={108} y={188} width={114} height={152} rx={10} fill="none" stroke={INK} strokeWidth={2} opacity={0.35} />
        {/* post header */}
        <circle cx={119} cy={201} r={8} fill={SAND} stroke={INK} strokeWidth={2} />
        <path d="M132 198h40M132 206h26" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
        {/* image block */}
        <rect x={108} y={214} width={114} height={70} rx={10} fill={SAND} />
        <circle cx={126} cy={232} r={6} fill={ORANGE} />
        <path d="M116 276l26-24 22 16 52-26" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
        {/* caption lines */}
        <path d="M108 296h84M108 306h48" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
        {/* action row */}
        <circle cx={116} cy={322} r={5} fill={ORANGE} />
        <circle cx={134} cy={322} r={5} stroke={INK} strokeWidth={2} />
        <circle cx={152} cy={322} r={5} stroke={INK} strokeWidth={2} />
        <path d="M152 334h26" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
      </g>

      {/* center — dashed journey with nodes */}
      <g id="hero-journey">
        <path
          className="anim-draw"
          d="M232 302C278 280 306 312 352 292 390 272 414 268 452 258"
          stroke={ORANGE}
          strokeWidth={2}
          strokeDasharray="7 9"
          strokeLinecap="round"
        />
        <circle cx={296} cy={296} r={5} fill={PAPER} stroke={ORANGE} strokeWidth={2} />
        <circle cx={402} cy={271} r={5} fill={PAPER} stroke={ORANGE} strokeWidth={2} />
        <circle cx={452} cy={258} r={6} fill={ORANGE} />
      </g>

      {/* right — store wall with 16:9 TV */}
      <g id="hero-wall-tv">
        <rect x={458} y={92} width={140} height={260} rx={14} fill={SAND} stroke={INK} strokeWidth={2} />
        <rect x={472} y={146} width={112} height={63} rx={8} fill={INK} stroke={INK} strokeWidth={2} />
        {/* play + power dot (screen details) */}
        <path d="M521 166v23l21-11.5z" fill={ORANGE} strokeLinejoin="round" />
        <circle className="anim-blink" cx={572} cy={201} r={3.5} fill={SIGNAL} />
        {/* soundbar */}
        <rect x={484} y={224} width={88} height={10} rx={5} fill={PAPER} stroke={INK} strokeWidth={2} />
      </g>

      {/* right — storefront facade with ACM cladding + MK box letters */}
      <g id="hero-facade">
        <rect x={606} y={150} width={90} height={202} rx={12} fill={PAPER} stroke={INK} strokeWidth={2} />
        {/* ACM cladding seams */}
        <path d="M636 196v82M666 196v82" stroke={INK} strokeWidth={2} opacity={0.25} />
        {/* door */}
        <path d="M632 352v-60q0-6 6-6h26q6 0 6 6v60z" fill={SAND} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={664} cy={322} r={2.2} fill={INK} />
        {/* illuminated box letters M K ▶ */}
        <rect x={614} y={162} width={20} height={20} rx={5} fill={PAPER} stroke={INK} strokeWidth={2} />
        <path d="M619.5 178v-12l4.5 6.5 4.5-6.5v12" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={642} y={162} width={20} height={20} rx={5} fill={PAPER} stroke={INK} strokeWidth={2} />
        <path d="M647.5 178v-12M647.5 172.5l6.5-6.5M647.5 172.5l6.5 5.5" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={670} y={162} width={20} height={20} rx={5} fill={PAPER} stroke={INK} strokeWidth={2} />
        <path d="M676.5 167v10l8.5-5z" fill={ORANGE} strokeLinejoin="round" />
        {/* glow underlines */}
        <path d="M617 187h14M645 187h14M673 187h14" stroke={SIGNAL} strokeWidth={3} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Google / SEO — local business result card                        */
/* ------------------------------------------------------------------ */

const STAR =
  "M8 1 9.76 5.57 14.66 5.84 10.85 8.93 12.11 13.66 8 11 3.89 13.66 5.15 8.93 1.34 5.84 6.24 5.57Z";

export function IllGoogleSeo({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Resultado de busca local: cartão da empresa com pin, nome, estrelas, horário de funcionamento e botão Ligar"
      viewBox="0 0 320 240"
      {...fit}
      className={className}
      fill="none"
    >
      <rect x={46} y={42} width={240} height={168} rx={12} fill={SAND} />
      <rect x={40} y={36} width={240} height={168} rx={12} fill={PAPER} stroke={INK} strokeWidth={2} />

      {/* business name row with map pin */}
      <path d="M68 48c-7 0-12 5.2-12 11.6C56 68.6 68 80 68 80s12-11.4 12-20.4C80 53.2 75 48 68 48z" fill={ORANGE} />
      <circle cx={68} cy={59.5} r={4} fill={PAPER} />
      <rect x={86} y={56} width={112} height={11} rx={5.5} fill={SAND} />
      <rect x={86} y={72} width={76} height={8} rx={4} fill={SAND} opacity={0.7} />

      {/* 5 stars */}
      <g fill={ORANGE}>
        <path d={STAR} transform="translate(58 80)" />
        <path d={STAR} transform="translate(78 80)" />
        <path d={STAR} transform="translate(98 80)" />
        <path d={STAR} transform="translate(118 80)" />
        <path d={STAR} transform="translate(138 80)" />
      </g>

      <path d="M58 112h204" stroke={INK} strokeWidth={2} opacity={0.18} />

      {/* hours */}
      <circle cx={70} cy={138} r={9.5} stroke={INK} strokeWidth={2} />
      <path d="M70 131.5V138l5 3" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M88 132h90M88 144h60" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.55} />

      {/* call pill */}
      <rect x={176} y={158} width={84} height={28} rx={14} fill={ORANGE} />
      <g transform="translate(185 165) scale(0.62)" stroke={PAPER} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
      <text x={205} y={177} fontSize={12.5} fontWeight={600} fill={PAPER} fontFamily="inherit">
        Ligar
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Social media — phone grid + editorial calendar                   */
/* ------------------------------------------------------------------ */

export function IllSocial({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Celular com grade de posts e cartão de agenda editorial com tarefas marcadas como concluídas"
      viewBox="0 0 320 240"
      {...fit}
      className={className}
      fill="none"
    >
      {/* smartphone */}
      <rect x={96} y={24} width={118} height={192} rx={14} fill={PAPER} stroke={INK} strokeWidth={2} />
      <rect x={141} y={29} width={24} height={3.5} rx={1.75} fill={INK} opacity={0.25} />
      {/* feed header */}
      <circle cx={112} cy={42} r={4.5} fill={SAND} stroke={INK} strokeWidth={2} />
      <path d="M121 42h27" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      {/* 2x2 post grid */}
      <rect x={106} y={48} width={45} height={52} rx={8} fill={SAND} />
      <rect x={159} y={48} width={45} height={52} rx={8} fill={SAND} />
      <rect x={106} y={118} width={45} height={52} rx={8} fill={SAND} />
      <rect x={159} y={118} width={45} height={52} rx={8} fill={SAND} />
      {/* heart accent on first post */}
      <path
        d="M6 10.5S2 8 2 5.2C2 3.9 3 3 4.1 3c.8 0 1.5.4 1.9 1 .4-.6 1.1-1 1.9-1C9 3 10 3.9 10 5.2c0 2.8-4 5.3-4 5.3z"
        transform="translate(136 56) scale(0.8)"
        fill={ORANGE}
      />
      {/* captions */}
      <path d="M106 108h36M159 108h36M106 178h36M159 178h36" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.45} />
      {/* bottom nav dots */}
      <circle cx={131} cy={190} r={2.5} fill={INK} opacity={0.4} />
      <circle cx={155} cy={190} r={2.5} fill={INK} opacity={0.4} />
      <circle cx={179} cy={190} r={2.5} fill={INK} opacity={0.4} />

      {/* floating editorial calendar */}
      <rect x={184} y={122} width={112} height={88} rx={12} fill={SAND} />
      <rect x={180} y={118} width={112} height={88} rx={12} fill={PAPER} stroke={INK} strokeWidth={2} />
      <path d="M204 112v12M232 112v12" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <rect x={192} y={130} width={56} height={9} rx={4.5} fill={SAND} />
      <g fill={SAND}>
        <rect x={192} y={146} width={13} height={13} rx={4} />
        <rect x={210} y={146} width={13} height={13} rx={4} />
        <rect x={228} y={146} width={13} height={13} rx={4} />
        <rect x={192} y={164} width={13} height={13} rx={4} />
        <rect x={210} y={164} width={13} height={13} rx={4} />
        <rect x={228} y={164} width={13} height={13} rx={4} />
      </g>
      <g stroke={ORANGE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M195 152.5l3 3 5-6.5" />
        <path d="M213 152.5l3 3 5-6.5" />
        <path d="M213 170.5l3 3 5-6.5" />
      </g>
      <path d="M192 192h52" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Ads — target hit by arrow + ad cards pulling audience            */
/* ------------------------------------------------------------------ */

export function IllAds({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Anúncios atraindo o público: dois cartões de anúncio com setas até um alvo atingido por uma flecha no centro"
      viewBox="0 0 320 240"
      {...fit}
      className={className}
      fill="none"
    >
      {/* ad card A */}
      <g id="ads-card-a">
        <rect x={28} y={44} width={110} height={64} rx={10} fill={PAPER} stroke={INK} strokeWidth={2} />
        <rect x={38} y={54} width={38} height={28} rx={6} fill={SAND} />
        <path d="M84 58h42M84 68h30" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
        <rect x={38} y={90} width={36} height={10} rx={5} fill={ORANGE} />
      </g>
      {/* ad card B */}
      <g id="ads-card-b">
        <rect x={36} y={128} width={110} height={64} rx={10} fill={PAPER} stroke={INK} strokeWidth={2} />
        <rect x={46} y={138} width={38} height={28} rx={6} fill={SAND} />
        <path d="M92 142h42M92 152h30" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
        <rect x={46} y={174} width={36} height={10} rx={5} fill={ORANGE} />
      </g>

      {/* audience arrows */}
      <g stroke={ORANGE} strokeWidth={2} strokeLinecap="round">
        <path className="anim-draw" d="M142 76C160 82 172 92 184 100" strokeDasharray="5 6" />
        <path className="anim-draw" d="M150 158C166 154 176 148 186 140" strokeDasharray="5 6" />
      </g>
      <polygon points="192,100 180,94 180,106" fill={ORANGE} transform="rotate(34 184 100)" />
      <polygon points="194,140 182,134 182,146" fill={ORANGE} transform="rotate(-38 186 140)" />

      {/* target */}
      <circle cx={232} cy={120} r={46} stroke={INK} strokeWidth={2} />
      <circle cx={232} cy={120} r={30} fill={SAND} stroke={INK} strokeWidth={2} />
      <circle cx={232} cy={120} r={14} fill={PAPER} stroke={INK} strokeWidth={2} />
      <circle cx={232} cy={120} r={5} fill={ORANGE} />
      {/* arrow hitting the center */}
      <g transform="rotate(38 232 120)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M148 120h74" stroke={INK} strokeWidth={2} />
        <path d="M148 120l-9-9M148 120l-9 9" stroke={INK} strokeWidth={2} />
        <polygon points="234,120 219,112.5 219,127.5" fill={ORANGE} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Sites — browser window + big cursor                              */
/* ------------------------------------------------------------------ */

export function IllSites({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Janela de navegador com barra de endereço, blocos de layout do site e um cursor grande apontando"
      viewBox="0 0 320 240"
      {...fit}
      className={className}
      fill="none"
    >
      <rect x={44} y={36} width={200} height={150} rx={12} fill={PAPER} stroke={INK} strokeWidth={2} />
      {/* chrome bar */}
      <path d="M44 64h200" stroke={INK} strokeWidth={2} opacity={0.35} />
      <circle cx={58} cy={50} r={4} fill={ORANGE} />
      <circle cx={71} cy={50} r={4} fill={INK} opacity={0.3} />
      <circle cx={84} cy={50} r={4} fill={INK} opacity={0.3} />
      <rect x={96} y={42} width={132} height={16} rx={8} stroke={INK} strokeWidth={2} fill={PAPER} />
      <path d="M104 50h52" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.35} />

      {/* layout blocks */}
      <rect x={58} y={76} width={172} height={14} rx={7} fill={SAND} />
      <rect x={58} y={98} width={172} height={44} rx={10} fill={SAND} />
      <path d="M68 108h92M68 116h64" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      <rect x={68} y={124} width={46} height={11} rx={5.5} fill={ORANGE} />
      <rect x={58} y={150} width={82} height={26} rx={8} fill={SAND} />
      <rect x={148} y={150} width={82} height={26} rx={8} fill={SAND} />
      <path d="M66 163h54M156 163h54" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.4} />

      {/* big cursor */}
      <g transform="translate(206 138) scale(1.35)">
        <path
          d="M0 0v34l9-8 6 13 8-4-6-13 11-1z"
          fill={ORANGE}
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Indoor media — wall TV + totem                                   */
/* ------------------------------------------------------------------ */

export function IllIndoor({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Ambiente de loja com TV 16:9 na parede, totem vertical no piso, planta em vaso e linha do chão"
      viewBox="0 0 320 240"
      {...fit}
      className={className}
      fill="none"
    >
      {/* wall TV 16:9 */}
      <g id="indoor-tv">
        <rect x={56} y={48} width={128} height={72} rx={10} fill={INK} stroke={INK} strokeWidth={2} />
        <path d="M112 73v22l21-11z" fill={ORANGE} strokeLinejoin="round" />
        <circle className="anim-blink" cx={172} cy={110} r={3.5} fill={SIGNAL} />
        <path d="M120 120v10" stroke={INK} strokeWidth={2} />
        <rect x={112} y={130} width={16} height={5} rx={2.5} fill={INK} />
      </g>

      {/* vertical totem 9:16 */}
      <g id="indoor-totem">
        <rect x={200} y={72} width={72} height={128} rx={10} fill={PAPER} stroke={INK} strokeWidth={2} />
        <rect x={208} y={80} width={56} height={104} rx={6} fill={INK} />
        <rect x={216} y={92} width={26} height={9} rx={4.5} fill={ORANGE} />
        <path d="M216 118h40M216 128h28" stroke={PAPER} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
        <path d="M228 192h12" stroke={PAPER} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      </g>

      {/* plant */}
      <g id="indoor-plant">
        <path
          d="M292 174c-2-16-10-24-18-28M293 174c0-20 5-27 12-33M294 174c3-12 9-18 15-21"
          stroke={INK}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path d="M282 174h22l-3.5 26h-15z" fill={SAND} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      </g>

      {/* floor */}
      <path d="M24 200h272" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Visual communication — facade with ACM cladding                  */
/* ------------------------------------------------------------------ */

export function IllVisual({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Fachada de loja com revestimento ACM, quatro letras-caixa com uma acesa, toldo laranja, vitrines, porta e placa"
      viewBox="0 0 320 240"
      {...fit}
      className={className}
      fill="none"
    >
      {/* facade body + fascia band */}
      <rect x={44} y={64} width={232} height={136} rx={12} fill={PAPER} />
      <path d="M44 76q0-12 12-12h208q12 0 12 12v28H44z" fill={SAND} />
      {/* diagonal ACM seams */}
      <path d="M78 104 102 64M138 104 162 64M198 104 222 64M252 104 276 70" stroke={INK} strokeWidth={2} opacity={0.3} />
      {/* box letters: M K ▶ ✳ */}
      <rect x={99} y={76} width={20} height={20} rx={5} fill={PAPER} stroke={INK} strokeWidth={2} />
      <path d="M104.5 92V80l4.5 7 4.5-7v12" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={133} y={76} width={20} height={20} rx={5} fill={PAPER} stroke={INK} strokeWidth={2} />
      <path d="M138.5 92V80M138.5 86.5l6.5-6.5M138.5 86.5l6.5 5.5" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={167} y={76} width={20} height={20} rx={5} fill={PAPER} stroke={INK} strokeWidth={2} />
      <path d="M173.5 81.5v9l9-4.5z" fill={ORANGE} strokeLinejoin="round" />
      <rect x={201} y={76} width={20} height={20} rx={5} fill={PAPER} stroke={INK} strokeWidth={2} />
      <path d="M211 80.5v11M206.5 83l9 6M215.5 83l-9 6" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      {/* the lit letter (yellow glow underline) */}
      <path d="M170 100h14" stroke={SIGNAL} strokeWidth={3} strokeLinecap="round" />
      {/* outline on top */}
      <rect x={44} y={64} width={232} height={136} rx={12} stroke={INK} strokeWidth={2} />

      {/* scalloped awning */}
      <path
        d="M52 116h216v8a12 12 0 0 1-24 0 12 12 0 0 1-24 0 12 12 0 0 1-24 0 12 12 0 0 1-24 0 12 12 0 0 1-24 0 12 12 0 0 1-24 0 12 12 0 0 1-24 0 12 12 0 0 1-24 0 12 12 0 0 1-24 0z"
        fill={ORANGE}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* windows + door */}
      <rect x={66} y={158} width={56} height={28} rx={8} fill={SAND} stroke={INK} strokeWidth={2} />
      <path d="M94 158v28" stroke={INK} strokeWidth={2} opacity={0.4} />
      <rect x={218} y={158} width={48} height={28} rx={8} fill={SAND} stroke={INK} strokeWidth={2} />
      <path d="M242 158v28" stroke={INK} strokeWidth={2} opacity={0.4} />
      <path d="M150 200v-36q0-6 6-6h40q6 0 6 6v36z" fill={SAND} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={188} cy={182} r={2.5} fill={INK} />

      {/* small sign */}
      <rect x={288} y={166} width={24} height={24} rx={6} fill={PAPER} stroke={INK} strokeWidth={2} />
      <circle cx={300} cy={178} r={4.5} fill={ORANGE} />
      <path d="M300 190v10" stroke={INK} strokeWidth={2} />

      {/* floor */}
      <path d="M24 200h272" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Network map — region coverage                                    */
/* ------------------------------------------------------------------ */

export function IllNetworkMap({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Mapa da região de atuação: São José do Rio Preto conectada a Bady Bassitt, Potirendaba, Monte Aprazível e José Bonifácio"
      viewBox="0 0 720 300"
      {...fit}
      className={className}
      fill="none"
    >
      {/* abstract landmass blobs */}
      <g id="map-landmass">
        <path
          d="M200 120C228 74 310 56 376 74c62 17 116 10 156 44 38 32 26 84-18 104-44 20-94 6-142 22-48 16-110 8-144-26-34-34-56-54-28-98z"
          fill={SAND}
          opacity={0.55}
        />
        <path d="M156 68c30-16 80-10 90 16 10 26-18 42-50 36-32-6-64-32-40-52z" fill={SAND} opacity={0.45} />
        <path d="M108 172c30-14 70-4 76 22 6 26-22 42-50 34-28-8-50-40-26-56z" fill={SAND} opacity={0.45} />
      </g>

      {/* dashed routes radiating from HQ */}
      <g stroke={ORANGE} strokeWidth={2} strokeDasharray="6 8" strokeLinecap="round">
        <path className="anim-draw" d="M459 157 409 190" />
        <path className="anim-draw" d="M465 162 435 229" />
        <path className="anim-draw" d="M457 146C380 108 290 88 217 94" />
        <path className="anim-draw" d="M458 154C360 176 250 188 163 193" />
      </g>

      {/* city nodes */}
      <g id="map-cities">
        <circle cx={400} cy={195} r={6} fill={PAPER} stroke={ORANGE} strokeWidth={2} />
        <circle cx={400} cy={195} r={2.5} fill={ORANGE} />
        <circle cx={430} cy={238} r={6} fill={PAPER} stroke={ORANGE} strokeWidth={2} />
        <circle cx={430} cy={238} r={2.5} fill={ORANGE} />
        <circle cx={205} cy={95} r={6} fill={PAPER} stroke={ORANGE} strokeWidth={2} />
        <circle cx={205} cy={95} r={2.5} fill={ORANGE} />
        <circle cx={150} cy={195} r={6} fill={PAPER} stroke={ORANGE} strokeWidth={2} />
        <circle cx={150} cy={195} r={2.5} fill={ORANGE} />
      </g>

      {/* HQ — São José do Rio Preto */}
      <g id="map-hq">
        <circle cx={470} cy={150} r={17} stroke={ORANGE} strokeWidth={2} opacity={0.3} />
        <circle className="anim-pulse-dot" cx={470} cy={150} r={9} fill={ORANGE} />
        <circle cx={470} cy={150} r={3} fill={PAPER} />
      </g>

      {/* labels */}
      <g fill={INK} fontSize={13} fontFamily="inherit" fontWeight={500}>
        <text x={492} y={146}>
          São José do Rio Preto
        </text>
        <text x={394} y={220} textAnchor="middle">
          Bady Bassitt
        </text>
        <text x={430} y={262} textAnchor="middle">
          Potirendaba
        </text>
        <text x={205} y={70} textAnchor="middle">
          Monte Aprazível
        </text>
        <text x={150} y={222} textAnchor="middle">
          José Bonifácio
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Service icons (24px, stroke = currentColor)                      */
/* ------------------------------------------------------------------ */

function IconBase({
  label,
  className,
  strokeWidth = 1.75,
  children,
}: IconProps & { label: string; children: ReactNode }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      {...fit}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function IconGoogle({ className, strokeWidth }: IconProps) {
  return (
    <IconBase label="Ícone: pin de mapa dentro de uma lupa" className={className} strokeWidth={strokeWidth}>
      <circle cx={10.8} cy={10.8} r={6.6} />
      <path d="M15.6 15.6 20.2 20.2" />
      <path d="M10.8 6.6c-1.9 0-3.2 1.4-3.2 3.1 0 2.3 3.2 5 3.2 5s3.2-2.7 3.2-5c0-1.7-1.3-3.1-3.2-3.1z" />
      <circle cx={10.8} cy={9.6} r={1.1} fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconSocial({ className, strokeWidth }: IconProps) {
  return (
    <IconBase label="Ícone: balão de conversa com coração" className={className} strokeWidth={strokeWidth}>
      <path d="M12 4.2c-4.5 0-7.9 2.8-7.9 6.4 0 2 1 3.8 2.7 5l-.5 3.6 3.5-1.6c.7.1 1.4.2 2.2.2 4.5 0 7.9-2.8 7.9-6.4S16.5 4.2 12 4.2z" />
      <path
        d="M12 13.9s-2.7-1.7-2.7-3.4c0-.9.7-1.7 1.6-1.7.5 0 .9.2 1.1.6.2-.4.6-.6 1.1-.6.9 0 1.6.8 1.6 1.7 0 1.7-2.7 3.4-2.7 3.4z"
        fill="currentColor"
        stroke="none"
      />
    </IconBase>
  );
}

export function IconTarget({ className, strokeWidth }: IconProps) {
  return (
    <IconBase label="Ícone: alvo com flecha acertando o centro" className={className} strokeWidth={strokeWidth}>
      <circle cx={12} cy={12} r={7.5} />
      <circle cx={12} cy={12} r={4} />
      <circle cx={12} cy={12} r={1.2} fill="currentColor" stroke="none" />
      <path d="M12 12l7.4-7.4" />
      <path d="M19.4 4.6h-4.1M19.4 4.6v4.1" />
    </IconBase>
  );
}

export function IconSite({ className, strokeWidth }: IconProps) {
  return (
    <IconBase label="Ícone: janela de navegador" className={className} strokeWidth={strokeWidth}>
      <rect x={3.2} y={4.6} width={17.6} height={14.8} rx={2.6} />
      <path d="M3.2 9.2h17.6" />
      <circle cx={6.1} cy={6.9} r={0.8} fill="currentColor" stroke="none" />
      <circle cx={8.9} cy={6.9} r={0.8} fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconScreen({ className, strokeWidth }: IconProps) {
  return (
    <IconBase label="Ícone: monitor com botão play" className={className} strokeWidth={strokeWidth}>
      <rect x={3} y={4.5} width={18} height={12.5} rx={2.5} />
      <path d="M12 17v3.5M8.2 20.5h7.6" />
      <path d="M10.4 8.1v5.8l4.8-2.9z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconStore({ className, strokeWidth }: IconProps) {
  return (
    <IconBase label="Ícone: loja com toldo" className={className} strokeWidth={strokeWidth}>
      <path d="M4 9l1.4-4.5h13.2L20 9" />
      <path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M5.5 12.8v6.7h13v-6.7" />
      <path d="M10 19.5v-4h4v4" />
    </IconBase>
  );
}

/* ------------------------------------------------------------------ */
/* 10. PlayMark — brand symbol                                         */
/* ------------------------------------------------------------------ */

export function PlayMark({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Símbolo da MK Creative: círculo laranja com triângulo play"
      viewBox="0 0 48 48"
      {...fit}
      className={className}
      fill="none"
    >
      <circle cx={24} cy={24} r={20} stroke={ORANGE} strokeWidth={3.5} />
      <path
        d="M19.5 15.5v17l14-8.5z"
        fill={INK}
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayMarkSolid({ className }: IllProps) {
  return (
    <svg
      role="img"
      aria-label="Símbolo da MK Creative preenchido: círculo laranja sólido com triângulo play em papel"
      viewBox="0 0 48 48"
      {...fit}
      className={className}
      fill="none"
    >
      <circle cx={24} cy={24} r={20} fill={ORANGE} />
      <path
        d="M19.5 15.5v17l14-8.5z"
        fill={PAPER}
        stroke={PAPER}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </svg>
  );
}
