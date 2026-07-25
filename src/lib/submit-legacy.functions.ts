import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const legacySubmissionSchema = z.object({
  perfil: z.enum(["empresario", "influenciador", "personalidade", "instituicao"]),
  nome: z.string().optional().default(""),
  email: z.string().email("Informe um e-mail válido"),
  telefone: z.string().optional().default(""),
  whatsapp: z.string().min(1, "Informe o WhatsApp"),
  cidade: z.string().optional().default(""),
  estado: z.string().optional().default(""),
  empresa: z.string().optional().default(""),
  cargo: z.string().optional().default(""),
  segmento: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  site: z.string().optional().default(""),
  tiktok: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
  seguidores: z.string().optional().default(""),
  instituicao: z.string().optional().default(""),
  responsavel: z.string().optional().default(""),
  area: z.string().optional().default(""),
  cota: z.string().optional().default(""),
  esg: z.string().optional().default(""),
  continuas: z.string().optional().default(""),
  origem: z.string().optional().default(""),
  participacao: z.string().optional().default(""),
  colaboracao: z.string().optional().default(""),
  mensagem: z.string().optional().default(""),
  novidades: z.string().optional().default(""),
  contato: z.string().optional().default(""),
});

export type LegacySubmission = z.infer<typeof legacySubmissionSchema>;

const SHEET_HEADERS = [
  "data e hora",
  "perfil",
  "nome",
  "email",
  "telefone",
  "whatsapp",
  "cidade",
  "estado",
  "empresa",
  "cargo",
  "segmento",
  "instagram",
  "site",
  "tiktok",
  "youtube",
  "seguidores",
  "instituicao",
  "responsavel",
  "area",
  "cota",
  "esg",
  "continuas",
  "origem",
  "participacao",
  "colaboracao",
  "mensagem",
  "novidades",
  "contato",
] as const;

function formatDateTimeBR(date = new Date()) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")}`;
}

function buildSheetRow(data: LegacySubmission) {
  const nome = data.nome || data.responsavel || data.instituicao || "";
  return [
    formatDateTimeBR(),
    data.perfil,
    nome,
    data.email,
    data.telefone,
    data.whatsapp,
    data.cidade,
    data.estado,
    data.empresa,
    data.cargo,
    data.segmento,
    data.instagram,
    data.site,
    data.tiktok,
    data.youtube,
    data.seguidores,
    data.instituicao,
    data.responsavel,
    data.area,
    data.cota,
    data.esg,
    data.continuas,
    data.origem,
    data.participacao,
    data.colaboracao,
    data.mensagem,
    data.novidades,
    data.contato,
  ];
}

function getWebhookUrl() {
  return process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() || "";
}

export const submitLegacyInterest = createServerFn({ method: "POST" })
  .validator((input) => legacySubmissionSchema.parse(input))
  .handler(async ({ data }) => {
    const webhookUrl = getWebhookUrl();

    if (!webhookUrl) {
      throw new Error(
        "GOOGLE_SHEETS_WEBHOOK_URL não configurada. Defina a URL do Apps Script no .env.",
      );
    }

    const payload = {
      headers: [...SHEET_HEADERS],
      row: buildSheetRow(data),
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const bodyText = await response.text().catch(() => "");

    if (!response.ok) {
      console.error("Google Sheets webhook failed", response.status, bodyText);
      throw new Error("Não foi possível gravar sua inscrição. Tente novamente em instantes.");
    }

    try {
      const parsed = JSON.parse(bodyText) as { ok?: boolean; error?: string };
      if (parsed && parsed.ok === false) {
        console.error("Google Sheets webhook error payload", parsed);
        throw new Error(
          parsed.error || "Não foi possível gravar sua inscrição. Tente novamente em instantes.",
        );
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("Não foi possível")) throw err;
      // Apps Script às vezes devolve texto vazio após redirect — trata como sucesso se HTTP 200.
    }

    return { ok: true as const };
  });
