import { useState, useRef } from "react";
import { submitLegacyInterest } from "@/lib/submit-legacy.functions";

type Profile = "empresario" | "influenciador" | "personalidade" | "instituicao";

const profiles: {
  id: Profile;
  icon: string;
  title: string;
  short: string;
  cta: string;
  message: string;
}[] = [
  {
    id: "empresario",
    icon: "🏢",
    title: "Empresário ou Empresa",
    short:
      "Quero conhecer oportunidades de patrocínio e fortalecer minha marca apoiando um projeto de grande impacto social.",
    cta: "Sou Empresário",
    message: "Sua empresa pode deixar um legado permanente na história do Instituto GESCA.",
  },
  {
    id: "influenciador",
    icon: "🌟",
    title: "Influenciador(a)",
    short: "Quero usar minha voz para inspirar pessoas e ampliar o alcance desta causa.",
    cta: "Sou Influenciador",
    message: "Sua voz pode inspirar milhares de pessoas a fazerem parte desta transformação.",
  },
  {
    id: "personalidade",
    icon: "🎤",
    title: "Personalidade Pública",
    short:
      "Quero apoiar institucionalmente este movimento e participar deste grande evento.",
    cta: "Sou Personalidade Pública",
    message: "Sua presença fortalece esta causa e amplia seu impacto em nossa comunidade.",
  },
  {
    id: "instituicao",
    icon: "🤝",
    title: "Instituição ou Organização",
    short: "Quero construir uma parceria institucional com o Instituto GESCA.",
    cta: "Sou uma Instituição",
    message: "Grandes transformações acontecem quando organizações caminham juntas.",
  },
];

function formToRecord(form: HTMLFormElement): Record<string, string> {
  const fd = new FormData(form);
  const out: Record<string, string> = {};
  for (const key of new Set(fd.keys())) {
    const values = fd
      .getAll(key)
      .map(String)
      .map((v) => v.trim())
      .filter(Boolean);
    out[key] = values.join(", ");
  }
  return out;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-gold-deep">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-white/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/20"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-gold-deep">*</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-lg border border-border bg-white/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/20"
      >
        <option value="" disabled>
          Selecione…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Radios({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white/60 px-4 py-2 text-sm transition hover:border-gold has-[:checked]:border-gold-deep has-[:checked]:bg-gold/10"
          >
            <input type="radio" name={name} value={o} className="sr-only" />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Checks({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white/60 px-4 py-2 text-sm transition hover:border-gold has-[:checked]:border-gold-deep has-[:checked]:bg-gold/10"
          >
            <input type="checkbox" name={name} value={o} className="sr-only" />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function LegacyForm() {
  const [step, setStep] = useState<"select" | "form" | "final" | "done">("select");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = profiles.find((p) => p.id === profile);

  const goToForm = (id: Profile) => {
    setProfile(id);
    setDraft({});
    setError(null);
    setStep("form");
    setTimeout(
      () => containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  };

  const handleFormNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    setDraft({ perfil: profile, ...formToRecord(e.currentTarget) });
    setError(null);
    setStep("final");
  };

  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setSubmitting(true);
    setError(null);

    try {
      const finalFields = formToRecord(e.currentTarget);
      const payload = {
        perfil: profile,
        nome: draft.nome ?? "",
        email: draft.email ?? "",
        telefone: draft.telefone ?? "",
        whatsapp: draft.whatsapp ?? "",
        cidade: draft.cidade ?? "",
        estado: draft.estado ?? "",
        empresa: draft.empresa ?? "",
        cargo: draft.cargo ?? "",
        segmento: draft.segmento ?? "",
        instagram: draft.instagram ?? "",
        site: draft.site ?? "",
        tiktok: draft.tiktok ?? "",
        youtube: draft.youtube ?? "",
        seguidores: draft.seguidores ?? "",
        instituicao: draft.instituicao ?? "",
        responsavel: draft.responsavel ?? "",
        area: draft.area ?? "",
        cota: draft.cota ?? "",
        esg: draft.esg ?? "",
        continuas: draft.continuas ?? "",
        origem: draft.origem ?? "",
        participacao: draft.participacao ?? "",
        colaboracao: draft.colaboracao ?? "",
        mensagem: finalFields.mensagem ?? "",
        novidades: finalFields.novidades === "sim" ? "Sim" : "Não",
        contato: finalFields.contato === "sim" ? "Sim" : "Não",
      };

      await submitLegacyInterest({ data: payload });
      setStep("done");
    } catch (err) {
      let message = "Não foi possível enviar sua inscrição. Tente novamente.";
      if (err instanceof Error && err.message) {
        message = err.message;
      } else if (err && typeof err === "object" && "message" in err) {
        message = String((err as { message: unknown }).message);
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="scroll-mt-24">
      {step === "select" && (
        <div className="space-y-10">
          <div className="grid gap-6 md:grid-cols-2">
            {profiles.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goToForm(p.id)}
                style={{ animationDelay: `${i * 80}ms` }}
                className="card-elevated fade-up group flex cursor-pointer flex-col items-start p-8 text-left transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-white hover:shadow-[var(--shadow-elevated)] md:p-10"
              >
                <span className="text-4xl">{p.icon}</span>
                <h3 className="mt-6 font-display text-2xl md:text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {p.short}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-gold-deep transition group-hover:gap-3">
                  {p.cta}
                  <span aria-hidden>→</span>
                </span>
              </button>
            ))}
          </div>

          <div className="fade-up rounded-3xl border border-border bg-white/60 p-8 shadow-[var(--shadow-elevated)] backdrop-blur md:p-10">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Ou, se preferir, garanta seu lugar no jantar
            </p>
            <div className="mt-6 flex justify-center">
              <a
                href="https://wa.me/5575982593107?text=Ol%C3%A1%21%20Tenho%20interesse%20em%20comprar%20uma%20cadeira%20avulsa%20para%20o%20Jantar%20Sonhos%20n%C3%A3o%20morrem."
                target="_blank"
                rel="noreferrer"
                className="group flex w-full max-w-md cursor-pointer flex-col items-start rounded-2xl border border-border bg-white/70 p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white hover:shadow-[var(--shadow-elevated)]"
              >
                <span className="text-3xl">🪑</span>
                <h3 className="mt-4 font-display text-xl">Quero comprar uma cadeira avulsa</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Garanta seu lugar na noite mais inspiradora do ano.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-gold-deep transition group-hover:gap-3">
                  Falar no WhatsApp
                  <span aria-hidden>→</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

      {step === "form" && active && (
        <form
          onSubmit={handleFormNext}
          className="fade-up rounded-3xl border border-border bg-white/70 p-8 shadow-[var(--shadow-elevated)] backdrop-blur md:p-12"
        >
          <button
            type="button"
            onClick={() => setStep("select")}
            className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden>←</span> Trocar perfil
          </button>
          <p className="eyebrow">Etapa 2 · Perfil {active.title}</p>
          <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
            {active.message}
          </h3>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {profile === "empresario" && (
              <>
                <Field label="Nome" name="nome" required />
                <Field label="Empresa" name="empresa" required />
                <Field label="Cargo" name="cargo" />
                <Field label="Segmento" name="segmento" />
                <Field label="Cidade" name="cidade" />
                <Field label="Estado" name="estado" />
                <Field label="Telefone" name="telefone" />
                <Field label="WhatsApp" name="whatsapp" required />
                <Field label="E-mail" name="email" type="email" required />
                <Field label="Instagram" name="instagram" />
                <Field label="Site" name="site" />
                <div className="md:col-span-2 space-y-6 pt-2">
                  <Radios
                    label="Qual cota deseja conhecer?"
                    name="cota"
                    options={["Bronze", "Prata", "Ouro", "Patrocinador Oficial", "Ainda quero conversar"]}
                  />
                  <Radios
                    label="Sua empresa possui ações de ESG?"
                    name="esg"
                    options={["Sim", "Não", "Estamos iniciando"]}
                  />
                  <Radios
                    label="Possui interesse em ações contínuas com o GESCA?"
                    name="continuas"
                    options={["Sim", "Talvez", "Não"]}
                  />
                  <Field label="Como conheceu o evento?" name="origem" />
                </div>
              </>
            )}

            {profile === "influenciador" && (
              <>
                <Field label="Nome" name="nome" required />
                <Field label="Instagram" name="instagram" />
                <Field label="TikTok" name="tiktok" />
                <Field label="YouTube" name="youtube" />
                <Field label="Cidade" name="cidade" />
                <Field label="Telefone" name="telefone" />
                <Field label="WhatsApp" name="whatsapp" required />
                <Field label="E-mail" name="email" type="email" required />
                <Field label="Seguidores (aprox.)" name="seguidores" />
                <Select
                  label="Segmento"
                  name="segmento"
                  options={["Lifestyle", "Negócios", "Saúde", "Família", "Gastronomia", "Outro"]}
                />
                <div className="md:col-span-2">
                  <Checks
                    label="Como gostaria de participar?"
                    name="participacao"
                    options={[
                      "Divulgação antes do evento",
                      "Cobertura durante o evento",
                      "Embaixador do projeto",
                      "Produção de conteúdo",
                    ]}
                  />
                </div>
              </>
            )}

            {profile === "personalidade" && (
              <>
                <Field label="Nome" name="nome" required />
                <Field label="Cargo ou atuação" name="cargo" />
                <Field label="Cidade" name="cidade" />
                <Field label="Telefone" name="telefone" />
                <Field label="WhatsApp" name="whatsapp" required />
                <Field label="E-mail" name="email" type="email" required />
                <Field label="Instagram" name="instagram" />
                <div className="md:col-span-2">
                  <Checks
                    label="Como deseja participar?"
                    name="participacao"
                    options={[
                      "Presença institucional",
                      "Apoio à divulgação",
                      "Participação na cerimônia",
                      "Embaixador do projeto",
                    ]}
                  />
                </div>
              </>
            )}

            {profile === "instituicao" && (
              <>
                <Field label="Nome da instituição" name="instituicao" required />
                <Field label="Responsável" name="responsavel" required />
                <Field label="Cargo" name="cargo" />
                <Field label="Área de atuação" name="area" />
                <Field label="Cidade" name="cidade" />
                <Field label="Telefone" name="telefone" />
                <Field label="WhatsApp" name="whatsapp" required />
                <Field label="E-mail" name="email" type="email" required />
                <Field label="Site" name="site" />
                <div className="md:col-span-2">
                  <Radios
                    label="Como pretende colaborar?"
                    name="colaboracao"
                    options={["Patrocínio", "Apoio Institucional", "Parceria Técnica", "Outro"]}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-10 flex justify-end">
            <button type="submit" className="btn-gold">
              Continuar →
            </button>
          </div>
        </form>
      )}

      {step === "final" && (
        <form
          onSubmit={handleFinalSubmit}
          className="fade-up rounded-3xl border border-border bg-white/70 p-8 shadow-[var(--shadow-elevated)] backdrop-blur md:p-12"
        >
          <p className="eyebrow">Etapa Final</p>
          <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
            Conte-nos um pouco mais
          </h3>
          <label className="mt-8 block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Existe alguma informação que gostaria de compartilhar conosco?
            </span>
            <textarea
              name="mensagem"
              rows={5}
              className="w-full rounded-lg border border-border bg-white/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/20"
            />
          </label>

          <div className="mt-6 space-y-3">
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="novidades"
                value="sim"
                defaultChecked
                className="mt-1 accent-[var(--gold-deep)]"
              />
              Desejo receber novidades do Instituto GESCA.
            </label>
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="contato"
                value="sim"
                defaultChecked
                className="mt-1 accent-[var(--gold-deep)]"
              />
              Aceito ser contatado pela equipe organizadora.
            </label>
          </div>

          {error && (
            <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep("form")}
              disabled={submitting}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              ← Voltar
            </button>
            <button type="submit" className="btn-gold" disabled={submitting}>
              {submitting ? "Enviando…" : "Quero fazer parte deste legado"}
            </button>
          </div>
        </form>
      )}

      {step === "done" && (
        <ConfirmScreen
          onReset={() => {
            setProfile(null);
            setDraft({});
            setError(null);
            setStep("select");
          }}
        />
      )}
    </div>
  );
}

function ConfirmScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="fade-up rounded-3xl border border-border bg-white/80 p-10 text-center shadow-[var(--shadow-elevated)] backdrop-blur md:p-16">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
        <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-gold-deep">
          <path
            d="M5 12.5l4.5 4.5L19 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="eyebrow mt-8">Obrigado</p>
      <h3 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
        Recebemos seu interesse
      </h3>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        Nossa equipe analisará suas informações e entrará em contato para apresentar as
        melhores oportunidades de participação no Jantar Beneficente Sonhos não morrem.
      </p>
      <p className="mx-auto mt-4 max-w-2xl font-display text-xl italic text-foreground md:text-2xl">
        Juntos podemos transformar sonhos em oportunidades e construir um legado que
        permanecerá por gerações.
      </p>
      <button onClick={onReset} className="btn-gold mt-10">
        Enviar outra manifestação
      </button>
    </div>
  );
}
