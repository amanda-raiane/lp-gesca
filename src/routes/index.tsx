import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroGala from "@/assets/hero-gala.jpg";
import storyGesca from "@/assets/story-gesca.png";
import memorialWall from "@/assets/memorial-wall.jpg";
import hubTech from "@/assets/hub-tech.png";
import atelier from "@/assets/atelier.png";
import newHq from "@/assets/new-hq.png";
import placeSetting from "@/assets/place-setting.jpg";
import luMagalhaes from "@/assets/lu-magalhaes.png";
import lorenaAraujo from "@/assets/lorena.png";
import henriqueAluno from "@/assets/henrique.png";
import marianaAluna from "@/assets/mariana.png";
import ceciliaSoares from "@/assets/cecilia.png";
import logoGesca from "@/assets/logo-gesca.png";
import LegacyForm from "@/components/LegacyForm";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Jantar Sonhos não morrem — Instituto GESCA" },
      {
        name: "description",
        content:
          "Um jantar beneficente onde solidariedade se transforma em futuro. Seja patrocinador e deixe um legado permanente. 26 de setembro de 2026 — Santo Antônio de Jesus.",
      },
      { property: "og:title", content: "Jantar Sonhos não morrem — Instituto GESCA" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Jantar Beneficente Sonhos não morrem",
          startDate: "2026-09-26T19:00",
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: "Santo Antônio de Jesus",
            address: "Santo Antônio de Jesus, BA, Brasil",
          },
          organizer: {
            "@type": "Organization",
            name: "Instituto GESCA",
            url: "https://gesca.org.br",
          },
          description:
            "Jantar de gala em benefício do Instituto GESCA, reunindo empresários, influenciadores e personalidades em prol da qualificação profissional, cultura e desenvolvimento humano.",
        }),
      },
    ],
  }),
});

/* ─────────────────────────────────────────────────────────────── */

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("fade-up");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const start = performance.now();
          const dur = 1800;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {n.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────── */

const nav = [
  { href: "#historia", label: "História" },
  { href: "#impacto", label: "Impacto" },
  { href: "#projetos", label: "Projetos" },
  { href: "#cotas", label: "Cotas" },
  { href: "#legado", label: "Legado" },
  { href: "#embaixador", label: "Embaixador" },
  { href: "#participar", label: "Participar" },
];

const impact = [
  { value: 30, suffix: "+", label: "anos de atuação" },
  { value: 364, suffix: "", label: "famílias formadas" },
  { value: 1400, suffix: "+", label: "jovens qualificados" },
  { value: 47000, suffix: "+", label: "pessoas impactadas" },
  { value: 3, suffix: "", label: "espaços sociais" },
  { value: 1, suffix: "º", label: "lugar em inovação social" },
];

const projects = [
  {
    img: newHq,
    tag: "Sede Própria",
    title: "Uma casa para o sonho ganhar endereço",
    desc: "Um polo de educação, esporte, cultura e qualificação profissional para transformar histórias.",
  },
  {
    img: hubTech,
    tag: "Hub de Tecnologia",
    title: "1º Hub de Tecnologia de SAJ",
    desc: "Formação em informática, design de mídias, videomaker e marketing digital para novas gerações.",
  },
  {
    img: atelier,
    tag: "Ateliê Costurando Sonhos",
    title: "Empoderando mulheres pela costura",
    desc: "Capacitação de mulheres em vulnerabilidade econômica, resgatando renda, autoestima e propósito.",
  },
];

const reasons = [
  {
    title: "Fortalecimento da marca",
    desc: "Associe sua empresa a um projeto de propósito com mais de três décadas de credibilidade.",
  },
  {
    title: "ESG real e mensurável",
    desc: "Tangibilize seu compromisso social com relatórios de impacto e resultados verificáveis.",
  },
  {
    title: "Networking qualificado",
    desc: "Encontre empresários, autoridades e formadores de opinião em um ambiente exclusivo.",
  },
  {
    title: "Reconhecimento institucional",
    desc: "Placas, discursos e presença em todas as peças oficiais de comunicação do evento.",
  },
  {
    title: "Impacto social direto",
    desc: "Recursos integralmente destinados à conquista da sede própria e à ampliação de programas.",
  },
  {
    title: "Legado permanente",
    desc: "Sua marca eternizada no Muro do Memorial da nova sede — visível por décadas.",
  },
];

const tiers = [
  {
    name: "Bronze",
    price: "R$ 3.000",
    highlight: false,
    features: [
      "Nome no Muro do Memorial",
      "3 convites VIP",
      "Menção nos stories institucionais",
      "Rol de apoiadores oficiais",
    ],
  },
  {
    name: "Prata",
    price: "R$ 8.000",
    highlight: false,
    features: [
      "Placa média no Muro do Memorial",
      "5 convites VIP",
      "Post coletivo de agradecimento",
      "Logo no telão rotativo do evento",
    ],
  },
  {
    name: "Ouro",
    price: "R$ 15.000",
    highlight: true,
    features: [
      "Placa nobre com relevo no Memorial",
      "6 convites VIP + destaque em peças",
      "2 posts dedicados + cobertura especial",
      "Troféu Parceiro Visionário",
      "6 meses de visibilidade no site",
    ],
  },
  {
    name: "Patrocinador Oficial",
    price: "R$ 25.000",
    highlight: true,
    featured: true,
    features: [
      "Posição central e iluminada no Memorial",
      "Mesa VIP de 8 lugares privilegiada",
      "Vídeo institucional + 5 posts dedicados",
      "Placa de honra entregue no palco",
      "Assento no Conselho Consultivo",
      "Direito a nomear uma das salas principais",
    ],
  },
];

const schedule = [
  { time: "19h", title: "Recepção", desc: "Chegada dos convidados e credenciamento." },
  { time: "20h00", title: "Coquetel", desc: "Momento de networking com música ao vivo." },
  { time: "20h45", title: "Jantar", desc: "Jantar servido em cerimônia de gala." },
  { time: "21h30", title: "Apresentações", desc: "Histórias reais de transformação do Instituto." },
  { time: "22h15", title: "Sorteios", desc: "Sorteios exclusivos: prêmios incríveis pelo bem da causa." },
  { time: "23h00", title: "Homenagens", desc: "Reconhecimento aos parceiros visionários." },
  { time: "23h45", title: "Encerramento", desc: "Palavras finais e brinde ao futuro." },
];

const testimonials = [
  {
    quote:
      "Algumas causas nos tocam. Outras nos convocam. E a construção da sede própria do Instituto Gesca é uma delas. Acredito profundamente no poder de quem dedica a vida a cuidar de pessoas e transformar realidades. Convido você a fazer parte desse sonho. Toda grande transformação começa quando alguém decide estender a mão. Eu acredito. Eu apoio. E espero encontrar você nessa corrente do bem. Porque o futuro que desejamos para a nossa comunidade começa com as escolhas que fazemos hoje.",
    name: "Lu Magalhães",
    role: "Embaixadora de Sonhos",
    photo: luMagalhaes,
  },
  {
    quote:
      "Minha família recebeu do GESCA a chave para uma nova história. Hoje, meu filho estuda tecnologia e sonha grande.",
    name: "Maria, mãe beneficiária",
    role: "Formação Socioemocional",
  },
  {
    quote:
      "Fui apresentada ao Instituto GESCA através de um anúncio sobre um curso de qualificação profissional. Aprendi coisas maravilhosas — desde elaborar um currículo completo até como me portar numa entrevista e lidar melhor com as emoções. Foi essencial para eu ingressar no mercado de trabalho. O instituto é fundamental para dar oportunidade a quem merece adquirir conhecimento.",
    name: "Lorena Araújo",
    role: "Aluna do Curso Administrativo · Hoje colaboradora da instituição",
    photo: lorenaAraujo,
  },
  {
    quote:
      "Sou imensamente grato ao Instituto GESCA por ter feito parte da minha trajetória. Foi através do curso de Mídias Sociais que dei meus primeiros passos na área criativa e descobri minha paixão pelo design gráfico. Hoje atuo como designer com orgulho, e reconheço que muito do que sou profissionalmente começou ali.",
    name: "Henrique",
    role: "Aluno do Curso de Webdesigner",
    photo: henriqueAluno,
  },
  {
    quote:
      "Fiz o curso “Eu Lidero” no Instituto GESCA e mudei várias coisas na minha vida. Era muito tímida, não conseguia fazer amizades, ficava nervosa ao apresentar trabalhos. Hoje interajo com tranquilidade, ganhei uma amiga que considero irmã e entendi que a vida é feita de escolhas. Muito obrigada, GESCA — vocês mudam vidas.",
    name: "Mariana",
    role: "Aluna do Curso Eu Lidero",
    photo: marianaAluna,
  },
  {
    quote:
      "Fui apresentada a esse projeto por um verdadeiro propósito de Deus, e desde então tenho a alegria de fazer parte dessa linda missão. Sou imensamente grata por pertencer a essa família, que transforma vidas com amor, respeito e solidariedade. Cada atendimento reforça em mim a certeza de que pequenos gestos podem gerar grandes mudanças.",
    name: "Cecília Soares",
    role: "Psicanalista",
    photo: ceciliaSoares,
  },
];

const partners = [
  "Gerando Falcões",
  "Movimento Bem Maior",
  "Instituto Phi",
  "Instituto Phomenta",
  "Sesc Mesa Brasil",
  "Instituto GRPCOM",
  "Oliveira Foundation",
  "Instituto Vila Educação",
  "Instituto Ekloos",
  "Instituto CocaCola Brasil",
  "Congel Contabilidade",
  "Laboratório Fernando Queiroz",
];

/* ─────────────────────────────────────────────────────────────── */

function LandingPage() {
  const scrolled = useScrolled(30);
  const revealRef = useReveal();

  return (
    <div ref={revealRef} className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-black/40 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between md:h-20">
          <a href="#top" className="flex items-center gap-3 text-white">
            <span className="font-display text-xl tracking-wide md:text-2xl">
              Sonhos não morrem
            </span>
            <span className="hidden h-6 w-px bg-white/20 md:inline-block" aria-hidden />
            <img
              src={logoGesca}
              alt="Instituto GESCA"
              className="hidden h-5 w-auto object-contain md:inline-block"
            />
          </a>
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1.5 backdrop-blur-md md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/75 transition hover:bg-white/[0.08] hover:text-gold-soft"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#participar"
            className="hidden rounded-full border border-white/40 px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.22em] text-white transition hover:border-gold hover:text-gold-soft md:inline-flex"
          >
            Quero patrocinar
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img
          src={heroGala}
          alt="Mesa de jantar de gala do Instituto GESCA"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 flex h-full items-center py-16 md:py-24">
          <div className="container-x">
            <div className="max-w-3xl text-white">
              <p className="eyebrow text-gold-soft" data-reveal>
                Instituto GESCA · 26 de setembro de 2026
              </p>
              <h1
                data-reveal
                className="mt-10 font-script text-5xl leading-[1.15] text-white md:mt-12 md:text-7xl lg:text-[7.5rem]"
                style={{ textShadow: "0 2px 30px rgba(0,0,0,0.55), 0 0 60px rgba(0,0,0,0.35)" }}
              >
                Sonhos não morrem
              </h1>
              <p
                data-reveal
                className="mt-6 max-w-2xl font-display text-xl italic text-white/85 md:text-2xl"
              >
                Um jantar onde solidariedade se transforma em futuro.
              </p>
              <p
                data-reveal
                className="mt-8 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
              >
                Ao participar deste evento você não está apenas patrocinando uma noite
                especial. Você está ajudando centenas de jovens e famílias a escreverem
                novas histórias.
              </p>
              <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#cotas" className="btn-gold">
                  Quero ser patrocinador
                </a>
                <a href="#historia" className="btn-ghost-gold">
                  Conheça o projeto
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.4em] text-white/60 md:block">
          Santo Antônio de Jesus · Bahia
        </div>
      </section>

      {/* HISTÓRIA */}
      <section id="historia" className="py-28 md:py-40">
        <div className="container-x grid gap-16 md:grid-cols-2 md:items-center md:gap-24">
          <div data-reveal>
            <p className="eyebrow">Uma história que transforma</p>
            <div className="gold-rule mt-6" />
            <h2 className="mt-6 font-display text-4xl leading-[1.1] md:text-6xl">
              Mais de três décadas semeando sonhos.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
              O Instituto GESCA nasceu em Santo Antônio de Jesus com a convicção de que
              a vulnerabilidade social não pode ser o destino final de ninguém. Somos
              uma ponte entre a realidade da escassez e o horizonte das oportunidades.
            </p>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Atuamos com aprendizagem socioemocional, cultura, arte, qualificação
              profissional e desenvolvimento humano — devolvendo a cada beneficiário a
              capacidade de sonhar e realizar.
            </p>
            <blockquote className="mt-10 border-l-2 border-gold pl-6 font-display text-xl italic leading-snug text-foreground md:text-2xl">
              Sonhos são sementes. Quando um jovem resgata seus sonhos, desperta a
              mudança em toda a sociedade.
            </blockquote>
          </div>
          <div data-reveal className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gold/10 blur-2xl" />
            <img
              src={storyGesca}
              alt="Crianças e educadora do Instituto GESCA"
              className="relative w-full rounded-3xl object-cover shadow-[var(--shadow-elevated)]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section id="impacto" className="bg-ink py-28 text-white md:py-36">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="eyebrow text-gold-soft">Nosso impacto</p>
            <h2 className="mt-6 font-display text-4xl md:text-5xl">
              Números que representam vidas transformadas.
            </h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {impact.map((k, i) => (
              <div
                key={k.label}
                data-reveal
                style={{ animationDelay: `${i * 80}ms` }}
                className="border-t border-white/15 pt-8"
              >
                <div className="font-display text-5xl text-gold-soft md:text-6xl">
                  <Counter to={k.value} suffix={k.suffix} />
                </div>
                <p className="mt-3 text-sm uppercase tracking-[0.22em] text-white/60">
                  {k.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA ONDE VAI SUA CONTRIBUIÇÃO */}
      <section id="projetos" className="py-28 md:py-40">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="eyebrow">Para onde vai sua contribuição</p>
            <h2 className="mt-6 font-display text-4xl md:text-5xl">
              Cada contribuição vira infraestrutura, educação e oportunidade.
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {projects.map((p, i) => (
              <article
                key={p.title}
                data-reveal
                style={{ animationDelay: `${i * 100}ms` }}
                className="card-elevated group overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <p className="eyebrow">{p.tag}</p>
                  <h3 className="mt-4 font-display text-2xl leading-snug">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUE APOIAR */}
      <section className="bg-secondary py-28 md:py-36">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="eyebrow">Por que apoiar este evento</p>
            <h2 className="mt-6 font-display text-4xl md:text-5xl">
              Um investimento em marca, propósito e futuro.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <div
                key={r.title}
                data-reveal
                style={{ animationDelay: `${i * 60}ms` }}
                className="card-elevated p-8"
              >
                <div className="h-px w-10 bg-gold" />
                <h3 className="mt-5 font-display text-2xl">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COTAS */}
      <section id="cotas" className="py-28 md:py-40">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="eyebrow">Cotas de patrocínio</p>
            <h2 className="mt-6 font-display text-4xl md:text-5xl">
              Escolha o nível do seu legado.
            </h2>
            <p className="mt-6 text-sm text-muted-foreground">
              Pagamento único ou parcelado em até 10x no cartão.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((t, i) => (
              <div
                key={t.name}
                data-reveal
                style={{ animationDelay: `${i * 90}ms` }}
                className={`relative flex flex-col rounded-2xl border p-8 transition duration-500 ${
                  t.featured
                    ? "border-gold bg-ink text-white shadow-[var(--shadow-elevated)] xl:-translate-y-4"
                    : t.highlight
                      ? "border-gold/60 bg-white shadow-[var(--shadow-soft)]"
                      : "border-border bg-white"
                } hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-ink">
                    Destaque máximo
                  </span>
                )}
                <p
                  className={`eyebrow ${t.featured ? "text-gold-soft" : ""}`}
                >
                  Patrocinador
                </p>
                <h3 className="mt-3 font-display text-3xl">{t.name}</h3>
                <p
                  className={`mt-4 font-display text-4xl ${
                    t.featured ? "text-gold-soft" : "text-foreground"
                  }`}
                >
                  {t.price}
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm leading-relaxed">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className={`flex gap-3 ${
                        t.featured ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      <span className="mt-1.5 inline-block h-1 w-3 shrink-0 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#participar"
                  className={`mt-10 inline-flex items-center justify-center rounded-full px-5 py-3 text-[0.7rem] uppercase tracking-[0.2em] transition ${
                    t.featured
                      ? "bg-gold text-ink hover:bg-gold-soft"
                      : "border border-ink text-ink hover:bg-ink hover:text-white"
                  }`}
                >
                  Quero esta cota
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGADO */}
      <section id="legado" className="relative overflow-hidden">
        <div className="relative h-[520px] w-full md:h-[640px]">
          <img
            src={memorialWall}
            alt="Muro do Memorial da nova sede"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="container-x relative z-10 flex h-full items-center">
            <div className="max-w-2xl text-white" data-reveal>
              <p className="eyebrow text-gold-soft">O legado</p>
              <h2 className="mt-6 font-display text-4xl leading-[1.1] md:text-6xl">
                Sua marca eternizada no Muro do Memorial.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                O coração arquitetônico da nossa nova sede será um monumento em
                gratidão dedicado exclusivamente aos parceiros visionários que
                tornaram este sonho possível. Visibilidade permanente. ESG real.
                Exclusividade.
              </p>
              <a href="#participar" className="btn-gold mt-10">
                Deixar meu legado
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PARCEIROS */}
      <section className="border-y border-border bg-white py-14 md:py-20">
        <div className="container-x">
          <p className="eyebrow text-center" data-reveal>
            Parceiros que transformam realidades
          </p>
          <div className="mt-10 overflow-hidden" data-reveal>
            <div className="marquee-track flex w-max gap-16 whitespace-nowrap">
              {[...partners, ...partners].map((p, i) => (
                <span
                  key={i}
                  className="font-display text-xl tracking-wide text-muted-foreground md:text-2xl"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-28 md:py-36">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="eyebrow">Depoimentos</p>
            <h2 className="mt-6 font-display text-4xl md:text-5xl">
              Quem já constrói este legado.
            </h2>
          </div>
          <div className="mt-14 -mx-4 md:-mx-8" data-reveal>
            <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-6 md:px-8 [scrollbar-width:thin]">
              {testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="card-elevated flex w-[85%] shrink-0 snap-start flex-col p-8 sm:w-[420px] md:p-10"
                >
                  <span className="font-display text-5xl leading-none text-gold">“</span>
                  <blockquote className="mt-2 font-display text-lg italic leading-relaxed text-foreground md:text-xl">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-auto pt-6 flex items-center gap-3 text-sm">
                    {t.photo && (
                      <img
                        src={t.photo}
                        alt={t.name}
                        loading="lazy"
                        className="h-12 w-12 rounded-full object-cover object-top ring-1 ring-gold/40"
                      />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{t.name}</p>
                      <p className="text-muted-foreground">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-2 px-4 text-center text-xs text-muted-foreground md:px-8">
              Arraste para o lado para ver mais depoimentos →
            </p>
          </div>
        </div>
      </section>

      {/* CRONOGRAMA */}
      <section className="relative overflow-hidden bg-ink py-28 text-white md:py-36">
        <img
          src={placeSetting}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/90 to-ink" />
        <div className="container-x relative">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="eyebrow text-gold-soft">Cronograma do evento</p>
            <h2 className="mt-6 font-display text-4xl md:text-5xl">Uma noite inesquecível.</h2>
          </div>
          <ol className="mx-auto mt-16 max-w-3xl">
            {schedule.map((s, i) => (
              <li
                key={s.title}
                data-reveal
                style={{ animationDelay: `${i * 60}ms` }}
                className="grid grid-cols-[80px_1fr] gap-6 border-t border-white/15 py-6 md:grid-cols-[120px_1fr] md:gap-10 md:py-8"
              >
                <span className="font-display text-2xl text-gold-soft md:text-3xl">
                  {s.time}
                </span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/60 md:text-base">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* EMBAIXADOR DE SONHOS */}
      <section id="embaixador" className="bg-secondary py-28 md:py-40">
        <div className="container-x">
          <div className="grid gap-16 md:grid-cols-2 md:items-center md:gap-24">
            <div data-reveal>
              <p className="eyebrow">Uma mesa, muitos sonhos</p>
              <div className="gold-rule mt-6" />
              <h2 className="mt-6 font-display text-4xl leading-[1.1] md:text-6xl">
                Seja um Embaixador de Sonhos.
              </h2>
              <p className="mt-6 font-display text-xl italic leading-relaxed text-foreground md:text-2xl">
                Sua mesa pode reunir convidados. Seu gesto pode reunir sonhos.
              </p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                Mais do que reservar uma mesa, você escolhe abrir espaço para encontros
                que inspiram, conectam pessoas e fortalecem uma causa que transforma vidas
                há mais de 30 anos.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                Ao tornar-se um Embaixador de Sonhos, sua mesa será personalizada com o
                nome da sua empresa, família ou marca, recebendo um reconhecimento especial
                durante o evento como símbolo do seu compromisso com a transformação social.
              </p>

              <ul className="mt-10 space-y-4">
                {[
                  "Mesa exclusiva para 8 convidados",
                  "Identificação personalizada da mesa",
                  "Reconhecimento durante o evento",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="text-base md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/5575982593107?text=Ol%C3%A1%21%20Tenho%20interesse%20em%20ser%20um%20Embaixador%20de%20Sonhos%20no%20Jantar%20Sonhos%20n%C3%A3o%20morrem."
                target="_blank"
                rel="noreferrer"
                className="btn-gold mt-10 inline-flex"
              >
                Quero ser um Embaixador de Sonhos
              </a>
            </div>

            <div data-reveal className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gold/10 blur-2xl" />
              <div className="card-elevated relative overflow-hidden p-10 md:p-14">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15 text-gold-deep">
                  <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <p className="eyebrow mt-8">Embaixador de Sonhos</p>
                <h3 className="mt-4 font-display text-3xl leading-snug md:text-4xl">
                  Conecte pessoas. Inspire sonhos. Deixe um legado.
                </h3>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  É uma forma de celebrar amizades, fortalecer conexões e, ao mesmo tempo,
                  ajudar a escrever um novo capítulo da história do Instituto GESCA.
                </p>
                <div className="mt-8 flex items-center gap-4 border-t border-border pt-8">
                  <div className="h-12 w-12 rounded-full bg-gold/15" aria-hidden />
                  <div>
                    <p className="font-display text-lg text-foreground">Mesa para 8 convidados</p>
                    <p className="text-sm text-muted-foreground">Personalizada e reconhecida no evento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section id="participar" className="bg-offwhite py-28 md:py-40">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center" data-reveal>
            <p className="eyebrow">Quero fazer parte deste legado</p>
            <h2 className="mt-6 font-display text-4xl leading-[1.1] md:text-6xl">
              Uma experiência personalizada, começando por você.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Selecione o perfil que melhor representa sua participação. Vamos preparar
              uma proposta exclusiva com base nas oportunidades mais adequadas.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <LegacyForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink py-16 text-white/70">
        <div className="container-x grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-white">Sonhos não morrem</p>
            <p className="mt-3 text-sm">
              Jantar Beneficente Instituto GESCA · 26 de setembro de 2026
            </p>
            <p className="mt-1 text-sm">Santo Antônio de Jesus · Bahia</p>
          </div>
          <div>
            <p className="eyebrow text-gold-soft">Contato</p>
            <p className="mt-4 text-sm">Jantar Beneficente Sonhos não morrem</p>
            <p className="text-sm">
              <a href="mailto:jantarbeneficente@gesca.org.br" className="transition hover:text-gold-soft">
                jantarbeneficente@gesca.org.br
              </a>
              <span className="mx-2">·</span>
              <a href="https://wa.me/5575982593107" target="_blank" rel="noreferrer" className="transition hover:text-gold-soft">
                (75) 98259-3107
              </a>
            </p>
            <p className="mt-3 text-sm">Florisvaldo Queiroz — Diretor Institucional</p>
            <p className="text-sm">presidencia@gesca.org.br · (75) 9.9147-5722</p>
            <p className="mt-3 text-sm">Lucilene Souza — Projetos e Parcerias</p>
            <p className="text-sm">contato@gesca.org.br · (75) 98320-0110</p>
          </div>
          <div>
            <p className="eyebrow text-gold-soft">Instituto GESCA</p>
            <p className="mt-4 text-sm">@institutogesca</p>
            <p className="mt-3 text-sm">
              Recursos integralmente destinados à conquista da sede própria e à
              ampliação dos programas educacionais e de qualificação.
            </p>
          </div>
        </div>
        <div className="container-x mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Instituto GESCA. Todos os direitos reservados.
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a
        href="https://wa.me/5575982593107?text=Ol%C3%A1%21%20Quero%20saber%20mais%20sobre%20o%20Jantar%20Sonhos%20n%C3%A3o%20morrem."
        target="_blank"
        rel="noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_15px_40px_-10px_rgba(37,211,102,0.6)] transition hover:scale-105"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
          <path d="M19.11 17.29c-.27-.13-1.58-.78-1.83-.87-.24-.09-.42-.13-.6.13-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07-.27-.13-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.49-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.44-.82-1.97-.22-.53-.45-.45-.6-.46l-.51-.01c-.18 0-.47.07-.71.34-.24.27-.93.91-.93 2.22 0 1.31.95 2.57 1.09 2.75.13.18 1.87 2.85 4.53 3.99.63.27 1.13.43 1.51.55.64.2 1.22.17 1.68.1.51-.08 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.06-.11-.24-.18-.51-.31zM16 3C9.37 3 4 8.37 4 15c0 2.11.55 4.09 1.52 5.81L4 29l8.42-1.49A11.94 11.94 0 0 0 16 27c6.63 0 12-5.37 12-12S22.63 3 16 3z" />
        </svg>
      </a>
    </div>
  );
}
