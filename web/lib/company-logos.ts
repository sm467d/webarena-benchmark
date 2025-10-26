/**
 * Company logo/favicon mapping for WebArena leaderboard models
 * Maps company/model names to their website domains for favicon fetching
 */

export const COMPANY_DOMAINS: Record<string, string> = {
  // Top performers
  'DeepSky Agent': 'airtable.com',
  'Narada AI': 'narada.ai',
  'IBM CUGA': 'ibm.com',
  'OpenAI Operator': 'openai.com',
  'Jace.AI': 'jace.ai',
  'ScribeAgent + GPT-4o': 'scribehow.com',
  'ScribeAgent': 'scribehow.com',
  'AgentSymbiotic': 'github.com',
  'Learn-by-Interact': 'google.com',
  'AgentOccam-Judge': 'github.com',
  'WebPilot': 'github.com',
  'GUI-API Hybrid Agent': 'cmu.edu',
  'Agent Workflow Memory': 'github.com',
  'SteP': 'arxiv.org',

  // GPT models
  'gpt-4-0613': 'openai.com',
  'gpt-4o-2024-05-13': 'openai.com',
  'gpt-3.5-turbo-16k-0613': 'openai.com',
  'GPT-4 + Auto Eval': 'openai.com',
  'GPT-4o + Tree Search': 'openai.com',

  // Other models
  'TTI': 'arxiv.org',
  'BrowserGym + GPT-4': 'github.com',
  'AgentTrek-1.0-32B': 'huggingface.co',
  'AutoWebGLM': 'github.com',
  'NNetNav': 'stanford.edu',
  'Gemini Pro': 'google.com',
  'Llama3-chat-70b': 'meta.com',
  'Llama3-chat-8b': 'meta.com',
  'Synatra-CodeLLama7b': 'github.com',
  'Lemur-chat-70b': 'github.com',
  'Agent Flan': 'github.com',
  'CodeLlama-instruct-34b': 'meta.com',
  'CodeLlama-instruct-7b': 'meta.com',
  'AgentLM-70b': 'github.com',
  'AgentLM-13b': 'github.com',
  'AgentLM-7b': 'github.com',
  'CodeAct Agent': 'github.com',
  'Mixtral': 'mistral.ai',
  'FireAct': 'github.com',
  'AutoGuide': 'arxiv.org',
  'AutoManual': 'arxiv.org',
  'Qwen-1.5-chat-72b': 'qwenlm.github.io',
  'Patel et al + 2024': 'arxiv.org',
};

/**
 * Get the favicon URL for a company using Google's favicon service
 */
export function getCompanyLogoUrl(companyName: string, size: number = 32): string {
  const domain = COMPANY_DOMAINS[companyName];
  if (!domain) {
    // Fallback to a generic icon or try to extract domain from company name
    return `https://www.google.com/s2/favicons?domain=github.com&sz=${size}`;
  }
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * Get company domain for a model name
 */
export function getCompanyDomain(companyName: string): string | null {
  return COMPANY_DOMAINS[companyName] || null;
}
