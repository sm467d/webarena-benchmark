/**
 * Organization mapping for WebArena leaderboard models
 * Based on research of papers, company websites, and official sources
 */

export interface ModelOrganization {
  modelName: string;
  organization: string;
  organizationType: 'company' | 'university' | 'research' | 'open-source';
  llm?: string;
}

export const MODEL_ORGANIZATIONS: Record<string, ModelOrganization> = {
  'Human': {
    modelName: 'Human',
    organization: '—',
    organizationType: 'research',
  },
  'DeepSky Agent': {
    modelName: 'DeepSky Agent',
    organization: 'Airtable',
    organizationType: 'company',
    llm: 'Proprietary',
  },
  'Narada AI': {
    modelName: 'Narada AI',
    organization: 'Narada AI Inc.',
    organizationType: 'company',
    llm: 'Proprietary LAM',
  },
  'IBM CUGA': {
    modelName: 'IBM CUGA',
    organization: 'IBM Research',
    organizationType: 'research',
    llm: 'Configurable',
  },
  'OpenAI Operator': {
    modelName: 'OpenAI Operator',
    organization: 'OpenAI',
    organizationType: 'company',
    llm: 'GPT-4o (CUA)',
  },
  'Jace.AI': {
    modelName: 'Jace.AI',
    organization: 'Zeta Labs',
    organizationType: 'company',
    llm: 'AWA-1',
  },
  'ScribeAgent + GPT-4o': {
    modelName: 'ScribeAgent + GPT-4o',
    organization: 'Scribe / Colony Labs',
    organizationType: 'company',
    llm: 'GPT-4o + Qwen2',
  },
  'AgentSymbiotic': {
    modelName: 'AgentSymbiotic',
    organization: 'AgentSymbiotic',
    organizationType: 'open-source',
    llm: 'GPT-4o + Llama3-8B',
  },
  'Learn-by-Interact': {
    modelName: 'Learn-by-Interact',
    organization: 'Learn-by-interact',
    organizationType: 'research',
    llm: 'GPT-4',
  },
  'AgentOccam-Judge': {
    modelName: 'AgentOccam-Judge',
    organization: 'AgentOccam-Judge',
    organizationType: 'open-source',
    llm: 'GPT-4-turbo',
  },
  'WebPilot': {
    modelName: 'WebPilot',
    organization: 'WebPilot',
    organizationType: 'research',
    llm: 'GPT-4',
  },
  'GUI-API Hybrid Agent': {
    modelName: 'GUI-API Hybrid Agent',
    organization: 'Beyond Browsing',
    organizationType: 'university',
    llm: 'GPT-4o',
  },
  'Agent Workflow Memory': {
    modelName: 'Agent Workflow Memory',
    organization: 'AWM',
    organizationType: 'university',
    llm: 'GPT-4o',
  },
  'SteP': {
    modelName: 'SteP',
    organization: 'SteP',
    organizationType: 'research',
    llm: 'GPT-4',
  },
  'TTI': {
    modelName: 'TTI',
    organization: 'TTI',
    organizationType: 'research',
    llm: 'Gemma 3 12B',
  },
  'BrowserGym + GPT-4': {
    modelName: 'BrowserGym + GPT-4',
    organization: 'WorkArena',
    organizationType: 'research',
    llm: 'GPT-4',
  },
  'AgentTrek-1.0-32B': {
    modelName: 'AgentTrek-1.0-32B',
    organization: 'AgentTrek',
    organizationType: 'research',
    llm: 'Qwen2.5-32B',
  },
  'GPT-4 + Auto Eval': {
    modelName: 'GPT-4 + Auto Eval',
    organization: 'Auto Eval & Refine',
    organizationType: 'research',
    llm: 'GPT-4',
  },
  'GPT-4o + Tree Search': {
    modelName: 'GPT-4o + Tree Search',
    organization: 'Tree Search for LM Agents',
    organizationType: 'research',
    llm: 'GPT-4o',
  },
  'AutoWebGLM': {
    modelName: 'AutoWebGLM',
    organization: 'AutoWebGLM',
    organizationType: 'university',
    llm: 'ChatGLM3-6B',
  },
  'NNetNav': {
    modelName: 'NNetNav',
    organization: 'NNetscape',
    organizationType: 'university',
    llm: 'Llama-3.1-8B',
  },
  'gpt-4-0613': {
    modelName: 'gpt-4-0613',
    organization: 'OpenAI',
    organizationType: 'company',
    llm: 'GPT-4',
  },
  'gpt-4o-2024-05-13': {
    modelName: 'gpt-4o-2024-05-13',
    organization: 'OpenAI',
    organizationType: 'company',
    llm: 'GPT-4o',
  },
  'gpt-3.5-turbo-16k-0613': {
    modelName: 'gpt-3.5-turbo-16k-0613',
    organization: 'OpenAI',
    organizationType: 'company',
    llm: 'GPT-3.5-turbo',
  },
  'Qwen-1.5-chat-72b': {
    modelName: 'Qwen-1.5-chat-72b',
    organization: 'Alibaba Cloud',
    organizationType: 'company',
    llm: 'Qwen-1.5-72B',
  },
  'Gemini Pro': {
    modelName: 'Gemini Pro',
    organization: 'Google',
    organizationType: 'company',
    llm: 'Gemini Pro',
  },
  'Llama3-chat-70b': {
    modelName: 'Llama3-chat-70b',
    organization: 'Meta AI',
    organizationType: 'company',
    llm: 'Llama 3 70B',
  },
  'Llama3-chat-8b': {
    modelName: 'Llama3-chat-8b',
    organization: 'Meta AI',
    organizationType: 'company',
    llm: 'Llama 3 8B',
  },
  'Synatra-CodeLLama7b': {
    modelName: 'Synatra-CodeLLama7b',
    organization: 'Research Project',
    organizationType: 'open-source',
    llm: 'Code Llama 7B',
  },
  'Lemur-chat-70b': {
    modelName: 'Lemur-chat-70b',
    organization: 'XLangAI',
    organizationType: 'research',
    llm: 'Lemur 70B',
  },
  'Agent Flan': {
    modelName: 'Agent Flan',
    organization: 'Research Project',
    organizationType: 'open-source',
    llm: 'Llama2-7B',
  },
  'CodeLlama-instruct-34b': {
    modelName: 'CodeLlama-instruct-34b',
    organization: 'Meta AI',
    organizationType: 'company',
    llm: 'Code Llama 34B',
  },
  'CodeLlama-instruct-7b': {
    modelName: 'CodeLlama-instruct-7b',
    organization: 'Meta AI',
    organizationType: 'company',
    llm: 'Code Llama 7B',
  },
  'AgentLM-70b': {
    modelName: 'AgentLM-70b',
    organization: 'Research Project',
    organizationType: 'open-source',
    llm: 'AgentLM 70B',
  },
  'AgentLM-13b': {
    modelName: 'AgentLM-13b',
    organization: 'Research Project',
    organizationType: 'open-source',
    llm: 'AgentLM 13B',
  },
  'AgentLM-7b': {
    modelName: 'AgentLM-7b',
    organization: 'Research Project',
    organizationType: 'open-source',
    llm: 'AgentLM 7B',
  },
  'CodeAct Agent': {
    modelName: 'CodeAct Agent',
    organization: 'DARPA-funded Research',
    organizationType: 'research',
    llm: 'Llama2 / Mistral-7B',
  },
  'Mixtral': {
    modelName: 'Mixtral',
    organization: 'Mistral AI',
    organizationType: 'company',
    llm: 'Mixtral',
  },
  'FireAct': {
    modelName: 'FireAct',
    organization: 'Princeton / Cambridge',
    organizationType: 'university',
    llm: 'Llama2-7B',
  },
  'AutoGuide': {
    modelName: 'AutoGuide',
    organization: 'Research Project',
    organizationType: 'research',
    llm: 'GPT-4-turbo',
  },
  'AutoManual': {
    modelName: 'AutoManual',
    organization: 'Research Project',
    organizationType: 'research',
    llm: 'GPT-4-turbo',
  },
  'Patel et al + 2024': {
    modelName: 'Patel et al + 2024',
    organization: 'Research Project',
    organizationType: 'research',
    llm: 'Self-improving',
  },
};

/**
 * Get organization info for a model
 */
export function getModelOrganization(modelName: string): ModelOrganization | null {
  return MODEL_ORGANIZATIONS[modelName] || null;
}

/**
 * Get organization display name
 */
export function getOrganizationName(modelName: string): string {
  const info = getModelOrganization(modelName);
  return info?.organization || '—';
}

/**
 * Get LLM name for a model
 */
export function getModelLLM(modelName: string): string | null {
  const info = getModelOrganization(modelName);
  return info?.llm || null;
}
