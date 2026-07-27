import { generateStructuredJSON, extractJsonFromText, generateWithGPT } from "./ai";
import type { TemplateStructureId } from "../themes/ready-templates";

export interface QuestionnaireQuestion {
  id: string;
  question: string;
  options: { label: string; value: string }[];
}

export interface QuestionnaireCopy {
  title: string;
  subtitle: string;
  intro: string;
  questions: QuestionnaireQuestion[];
  resultHeadline: string;
  resultMessage: string;
  promoHeadline: string;
  promoBody: string;
  promoBullets: string[];
  promoCta: string;
  promoSubtext: string;
}

const QUESTIONNAIRE_SYSTEM_BASE = `You are an expert quiz funnel copywriter.
Return ONLY valid JSON with these keys:
title, subtitle, intro, questions (array of 5-6 items with id, question, options),
resultHeadline, resultMessage, promoHeadline, promoBody, promoBullets (array of 3 strings),
promoCta, promoSubtext.

Each question must have exactly 4 options with label and value fields.
Questions must be about the NICHE topic — goals, habits, challenges, preferences — NOT about the affiliate product.
The affiliate product is revealed ONLY on the final promo page after the quiz.
Do not mention the product name in questions. Keep language friendly and conversational.`;

const COPY_TONE_INSTRUCTIONS: Record<TemplateStructureId, string> = {
  editorial: `VOICE: Thoughtful editorial — empathetic, story-driven, complete sentences.`,
  magazine: `VOICE: Bold magazine energy — punchy questions, vivid language, energetic.`,
  minimal: `VOICE: Calm and precise — plain language, zero hype, respectful.`,
  authority: `VOICE: Expert guide — analytical, trust-building, specific.`,
  conversion: `VOICE: Direct-response — bold hooks, urgency on the promo page only.`,
  luxury: `VOICE: Premium aspirational — refined, transformation-focused.`,
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function validateQuestionnaireCopy(raw: unknown): QuestionnaireCopy | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  const questionsRaw = Array.isArray(data.questions) ? data.questions : [];
  const questions: QuestionnaireQuestion[] = [];

  for (let i = 0; i < questionsRaw.length; i++) {
    const item = questionsRaw[i];
    if (!item || typeof item !== "object") continue;
    const q = item as Record<string, unknown>;
    const question = asString(q.question);
    const id = asString(q.id, `q${i + 1}`);
    const optionsRaw = Array.isArray(q.options) ? q.options : [];
    const options = optionsRaw
      .map((opt, j) => {
        if (!opt || typeof opt !== "object") return null;
        const o = opt as Record<string, unknown>;
        const label = asString(o.label);
        const value = asString(o.value, `opt${j + 1}`);
        if (!label) return null;
        return { label, value };
      })
      .filter(Boolean) as { label: string; value: string }[];

    if (question && options.length >= 3) {
      questions.push({ id, question, options });
    }
  }

  const title = asString(data.title);
  const subtitle = asString(data.subtitle);
  if (!title || questions.length < 4) return null;

  return {
    title,
    subtitle,
    intro: asString(data.intro, "Answer a few quick questions to get personalized insights."),
    questions,
    resultHeadline: asString(data.resultHeadline, "Your personalized results are ready"),
    resultMessage: asString(
      data.resultMessage,
      "Based on your answers, we found something that could help you move forward."
    ),
    promoHeadline: asString(data.promoHeadline, "Recommended for you"),
    promoBody: asString(data.promoBody),
    promoBullets: asStringArray(data.promoBullets, []),
    promoCta: asString(data.promoCta, "See the recommended offer"),
    promoSubtext: asString(data.promoSubtext, "Tap below to learn more — no obligation."),
  };
}

export function buildFallbackQuestionnaireCopy(input: {
  niche: string;
  productName: string;
  description?: string;
}): QuestionnaireCopy {
  const niche = input.niche;
  const topic = niche.toLowerCase();

  return {
    title: `What's Your ${niche} Profile?`,
    subtitle: `A quick 5-question check-in to understand where you stand with ${topic}.`,
    intro: `Everyone's ${topic} journey looks different. Answer five short questions and we'll share insights tailored to your situation — plus a resource that matches your goals.`,
    questions: [
      {
        id: "q1",
        question: `How would you describe your current experience with ${topic}?`,
        options: [
          { label: "Just getting started", value: "beginner" },
          { label: "Some experience, still learning", value: "intermediate" },
          { label: "Fairly experienced", value: "experienced" },
          { label: "Advanced — looking to level up", value: "advanced" },
        ],
      },
      {
        id: "q2",
        question: `What's your biggest challenge right now in ${topic}?`,
        options: [
          { label: "Not knowing where to start", value: "start" },
          { label: "Too much conflicting advice", value: "overwhelm" },
          { label: "Lack of consistency", value: "consistency" },
          { label: "Plateaued results", value: "plateau" },
        ],
      },
      {
        id: "q3",
        question: "How much time can you realistically dedicate each week?",
        options: [
          { label: "Less than 2 hours", value: "minimal" },
          { label: "2–5 hours", value: "moderate" },
          { label: "5–10 hours", value: "committed" },
          { label: "10+ hours — all in", value: "intensive" },
        ],
      },
      {
        id: "q4",
        question: "What outcome matters most to you right now?",
        options: [
          { label: "Quick wins and momentum", value: "quick" },
          { label: "A clear step-by-step plan", value: "plan" },
          { label: "Long-term sustainable results", value: "longterm" },
          { label: "Expert guidance I can trust", value: "guidance" },
        ],
      },
      {
        id: "q5",
        question: "How do you prefer to learn and take action?",
        options: [
          { label: "Short, actionable tips", value: "tips" },
          { label: "Structured courses or guides", value: "structured" },
          { label: "Community and accountability", value: "community" },
          { label: "Tools and templates I can use", value: "tools" },
        ],
      },
    ],
    resultHeadline: "Your profile is ready",
    resultMessage: `Based on your answers, you're clearly motivated to make progress in ${niche}. The next step is finding the right resource that matches your goals and learning style.`,
    promoHeadline: `A recommended next step for your ${niche} journey`,
    promoBody: `${input.productName} is a focused solution for people in ${niche} who want real results without the guesswork.${input.description ? ` ${input.description}` : ""}`,
    promoBullets: [
      `Tailored for ${niche} — not generic advice`,
      "Clear action steps you can start today",
      "Designed for people at your stage of the journey",
    ],
    promoCta: "Check out the recommended offer",
    promoSubtext: "See if this is the right fit for you — takes less than a minute.",
  };
}

export async function generateQuestionnaireCopy(input: {
  niche: string;
  productName: string;
  description?: string;
  productContext?: string;
  affiliateLabel?: string;
  copyToneId?: TemplateStructureId;
}): Promise<QuestionnaireCopy> {
  const toneInstruction = COPY_TONE_INSTRUCTIONS[input.copyToneId ?? "editorial"];
  const systemPrompt = `${QUESTIONNAIRE_SYSTEM_BASE}\n\n${toneInstruction}`;

  const userPrompt = `Create a niche questionnaire funnel for "${input.niche}".

NICHE: ${input.niche}
PRODUCT NAME (for final promo page only): ${input.productName}
AFFILIATE OFFER LABEL: ${input.affiliateLabel || input.productName}
DESCRIPTION: ${input.description || "A proven solution for this niche."}
${input.productContext ? `\nSCRAPED OFFER CONTEXT (use on promo page only):\n${input.productContext}` : ""}

The quiz questions must explore the niche topic — goals, challenges, habits, preferences.
The final promo page recommends the product as a natural next step based on quiz results.
Match the voice instruction exactly.`;

  try {
    return await generateStructuredJSON({
      systemPrompt,
      userPrompt,
      validate: validateQuestionnaireCopy,
      options: { temperature: 0.65, maxRetries: 2, maxRepairAttempts: 1 },
    });
  } catch {
    try {
      const raw = await generateWithGPT(systemPrompt, userPrompt, {
        temperature: 0.75,
        maxRetries: 2,
      });
      const parsed = validateQuestionnaireCopy(extractJsonFromText(raw));
      if (parsed) return parsed;
    } catch {
      /* use fallback */
    }
    return buildFallbackQuestionnaireCopy(input);
  }
}
