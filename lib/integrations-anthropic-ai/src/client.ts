import Anthropic from "@anthropic-ai/sdk";

// Support two modes:
//   Replit: AI_INTEGRATIONS_ANTHROPIC_BASE_URL + AI_INTEGRATIONS_ANTHROPIC_API_KEY
//   Self-hosted: ANTHROPIC_API_KEY (standard Anthropic env var)
const replitApiKey  = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
const replitBaseUrl = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
const directApiKey  = process.env.ANTHROPIC_API_KEY;

const apiKey  = replitApiKey  || directApiKey;
const baseURL = replitBaseUrl || undefined;

if (!apiKey) {
  throw new Error(
    "[Metricadia] No Anthropic API key found. " +
    "On Replit: provision the Anthropic AI integration. " +
    "On self-hosted: set the ANTHROPIC_API_KEY environment variable.",
  );
}

export const anthropic = new Anthropic({ apiKey, ...(baseURL ? { baseURL } : {}) });
