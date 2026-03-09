import type { DashboardData, PromptDetail, PromptRun, PromptSummary, PromptVersion, SessionSummary, WorkshopResult } from '@/lib/types';

const now = new Date().toISOString();

export const demoPrompts: PromptSummary[] = [
  {
    id: 'demo-refactor',
    title: 'Refactor Planner',
    body: 'Review a codebase change, identify migration risks, propose phases, and outline tests plus rollback notes.',
    tags: ['coding', 'migration', 'testing'],
    favorite: true,
    status: 'active',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'demo-skill',
    title: 'Skill Draft Generator',
    body: 'Turn a repeated workflow into a reusable skill with inputs, outputs, constraints, and example runs.',
    tags: ['skills', 'automation'],
    favorite: false,
    status: 'active',
    createdAt: now,
    updatedAt: now
  }
];

export const demoSessions: SessionSummary[] = [
  {
    id: 'demo-session',
    title: 'PromptCache product shaping',
    description: 'Connected prompt experiments for the core library and workshop experience.',
    status: 'active',
    promptCount: 3,
    responseCount: 4,
    updatedAt: now
  }
];

export const demoPromptDetail: PromptDetail = {
  ...demoPrompts[0],
  goal: 'Plan a safe code migration',
  context: 'Use for repository-level migrations with multiple moving parts.',
  constraints: 'Be explicit about risk, testing, and rollback.',
  notes: 'Great for PRD-to-build transitions and refactor spikes.',
  versions: [
    {
      id: 'v-1',
      versionNumber: 1,
      body: demoPrompts[0].body,
      changeSummary: 'Initial version',
      createdAt: now
    }
  ],
  runs: [
    {
      id: 'r-1',
      modelName: 'manual',
      source: 'pasted',
      outputText: 'Use a three-phase rollout with canary validation and rollback checkpoints.',
      notes: 'Solid structure but could be more specific about fixtures.',
      createdAt: now
    }
  ]
};

export const demoWorkshopResult: WorkshopResult = {
  improvedPrompt:
    'You are helping me plan a repository migration. First ask for missing context such as affected systems, dependencies, and rollout constraints. Then produce: 1) assumptions, 2) migration phases, 3) risk register, 4) test strategy, and 5) rollback plan. Keep recommendations practical and implementation-ready.',
  critique: [
    'The original prompt does not require the model to surface missing assumptions before planning.',
    'It asks for a plan, but not for the exact sections that make the output consistently useful.',
    'It would benefit from explicit requirements for validation, testing, and rollback.'
  ]
};

export function formatRelative(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(iso));
}

export function splitTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function improvePrompt(input: string): WorkshopResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      improvedPrompt: '',
      critique: ['Add a draft prompt in the workshop to generate an improvement pass.']
    };
  }

  return {
    improvedPrompt:
      `${trimmed}\n\nBefore answering, identify any missing context. Then respond with clear sections for assumptions, approach, risks, tests, and next actions. Keep the result concise but implementation-ready.`,
    critique: [
      'Ask for missing context first so the response is grounded in the real task.',
      'Specify the structure you want in the output to improve repeatability.',
      'Name quality bars like risks, tests, and next actions so the answer is more actionable.'
    ]
  };
}
