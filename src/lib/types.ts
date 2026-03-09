export type PromptSummary = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  favorite: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type PromptDetail = PromptSummary & {
  goal: string | null;
  context: string | null;
  constraints: string | null;
  notes: string | null;
  versions: PromptVersion[];
  runs: PromptRun[];
};

export type PromptVersion = {
  id: string;
  versionNumber: number;
  body: string;
  changeSummary: string | null;
  createdAt: string;
};

export type PromptRun = {
  id: string;
  modelName: string | null;
  source: string | null;
  outputText: string | null;
  notes: string | null;
  createdAt: string;
};

export type SessionSummary = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  promptCount: number;
  responseCount: number;
  updatedAt: string;
};

export type DashboardData = {
  prompts: PromptSummary[];
  sessions: SessionSummary[];
  totalPrompts: number;
  totalSessions: number;
  totalRuns: number;
  databaseConnected: boolean;
};

export type WorkshopResult = {
  improvedPrompt: string;
  critique: string[];
};
