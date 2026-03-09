export type PromptRecord = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  updatedAt: string;
  usageCount: number;
  favorite?: boolean;
};

export type PromptSession = {
  id: string;
  title: string;
  status: 'active' | 'review' | 'archived';
  promptCount: number;
  responseCount: number;
  summary: string;
};

export type Integration = {
  id: string;
  name: string;
  kind: 'mcp' | 'provider' | 'skill';
  status: 'ready' | 'planned';
  description: string;
};

export const promptRecords: PromptRecord[] = [
  {
    id: 'p-01',
    title: 'Refactor Planner',
    summary: 'Drafts a safe refactor plan with edge cases, tests, and rollback notes.',
    tags: ['coding', 'planning', 'refactor'],
    updatedAt: '2h ago',
    usageCount: 18,
    favorite: true
  },
  {
    id: 'p-02',
    title: 'Skill Draft Generator',
    summary: 'Turns a repeated workflow into a skill draft with inputs, outputs, and guardrails.',
    tags: ['skills', 'automation'],
    updatedAt: 'yesterday',
    usageCount: 9
  },
  {
    id: 'p-03',
    title: 'PR Review Tightener',
    summary: 'Requests a severity-ordered review focused on bugs, regressions, and missing tests.',
    tags: ['review', 'quality'],
    updatedAt: '3d ago',
    usageCount: 24,
    favorite: true
  }
];

export const sessions: PromptSession[] = [
  {
    id: 's-01',
    title: 'PromptCache IA Sprint',
    status: 'active',
    promptCount: 7,
    responseCount: 15,
    summary: 'Exploring nav, session lineage, and workshop command design.'
  },
  {
    id: 's-02',
    title: 'Skill Customization Patterns',
    status: 'review',
    promptCount: 4,
    responseCount: 8,
    summary: 'Collecting the best prompt structures for reusable skill generation.'
  }
];

export const integrations: Integration[] = [
  {
    id: 'i-01',
    name: 'OpenAI Workshop Enhancer',
    kind: 'provider',
    status: 'ready',
    description: 'Generate prompt critiques, rewrite suggestions, and side-by-side alternatives.'
  },
  {
    id: 'i-02',
    name: 'Filesystem Context MCP',
    kind: 'mcp',
    status: 'planned',
    description: 'Inject active workspace context to improve coding prompts and session grounding.'
  },
  {
    id: 'i-03',
    name: 'Skill Template Bridge',
    kind: 'skill',
    status: 'planned',
    description: 'Promote successful prompt patterns into reusable skill templates.'
  }
];

export const workshopDraft = {
  title: 'Prompt optimization for code migrations',
  body: `You are helping me plan a code migration. Review the repository context, identify risky changes, propose a migration plan, and suggest tests. Keep the plan practical.`
};

export const workshopSuggestions = [
  {
    label: 'Add structure',
    detail: 'Introduce sections for assumptions, phased rollout, and validation checkpoints.'
  },
  {
    label: 'Clarify inputs',
    detail: 'Ask for repo boundaries, dependencies, and systems affected before suggesting the plan.'
  },
  {
    label: 'Improve outcome quality',
    detail: 'Require test strategy, rollback notes, and criteria for done.'
  }
];
