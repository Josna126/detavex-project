/**
 * Shared types for the direct agent pipeline
 */

export interface AgentContext {
  jobId: string;
  domain: string;
  scrapedContent?: string;
  newsData?: unknown;
}

export interface AgentOutput {
  agent: string;
  input: string;
  output: string;
}

export interface DossierData {
  name?: string;
  description?: string;
  industry?: string;
  size?: string;
  employeeCount?: string;
  revenue?: string;
  location?: string;
  technologies?: string[];
  leadership?: string[];
  recentDevelopments?: string[];
}

export interface MarketAnalysis {
  marketInsights?: string;
  growthSignals?: string[];
  risks?: string[];
}

export interface TechAnalysis {
  techStackAnalysis?: string;
  gaps?: string[];
  urgencyScore?: number;
}

export interface FinancialAnalysis {
  financialSignals?: string[];
  pressureScore?: number;
}

export interface RiskAnalysis {
  objections?: Array<{ objection: string; explanation: string }>;
}

export interface ArbiterDecision {
  verdict: "PURSUE" | "IGNORE";
  decisionReasoning: string;
  confidenceScore?: number;
  signals?: string[];
  riskFactors?: string[];
}

export interface BonusContent {
  platform?: string;
  content?: string;
}

export interface AnalysisResult {
  jobId: string;
  status: "completed" | "failed";
  dossier?: DossierData;
  verdict?: "PURSUE" | "IGNORE";
  decisionReasoning?: string;
  outreachMessage?: string;
  bonusContent?: BonusContent;
  trace?: AgentOutput[];
  sourceData?: {
    scrapedContent?: string;
    newsData?: unknown;
  };
}
