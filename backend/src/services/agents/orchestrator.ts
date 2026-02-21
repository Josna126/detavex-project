/**
 * Direct agent orchestrator - runs all 8 agents sequentially
 * Outputs data in the same shape as n8n callback for DB compatibility
 */

import { CerebrasClient } from "./cerebras.client";
import type {
  AgentContext,
  AgentOutput,
  AnalysisResult,
  DossierData,
  MarketAnalysis,
  TechAnalysis,
  FinancialAnalysis,
  RiskAnalysis,
  ArbiterDecision,
  BonusContent,
} from "./types";

const cerebras = new CerebrasClient();

/**
 * Safe JSON parser with fallback
 */
function parseSafe<T = unknown>(text: string): T | string {
  try {
    return JSON.parse(text) as T;
  } catch {
    return text;
  }
}

/**
 * Run the complete agent pipeline
 */
export async function runAgentPipeline(
  jobId: string,
  domain: string
): Promise<AnalysisResult> {
  const trace: AgentOutput[] = [];
  const context: AgentContext = {
    jobId,
    domain,
    scrapedContent: "",
    newsData: {},
  };

  try {
    // Agent 1: Researcher
    console.log(`[${jobId}] Running Researcher agent...`);
    const researcherPrompt = `You are an expert business intelligence researcher with access to comprehensive company databases.

TASK: Research and provide detailed, accurate information about the company at domain: ${domain}

CRITICAL INSTRUCTIONS:
1. If this is a well-known company, use your factual knowledge to provide ACCURATE information
2. Include SPECIFIC numbers for employees and revenue (not ranges unless truly unknown)
3. Provide REAL city and country locations
4. List ACTUAL technologies they use
5. Name REAL executives if known
6. Return ONLY valid JSON with NO additional text, markdown, or explanations

REQUIRED JSON STRUCTURE:
{
  "name": "Official company name (e.g., Stripe, Inc.)",
  "description": "Detailed 3-4 sentence description of what the company does, their main products/services, and market position",
  "industry": "Specific industry vertical (e.g., Payment Processing, Cloud Infrastructure, E-commerce Platform)",
  "size": "Company size tier: Startup (<50), SMB (50-500), Mid-Market (500-5000), Enterprise (5000+)",
  "employeeCount": "Specific number or realistic estimate (e.g., 8,000 or 50,000+)",
  "revenue": "Annual revenue with currency and period (e.g., $14B (2023), $500M ARR, Undisclosed)",
  "location": "Headquarters: City, State/Country (e.g., San Francisco, CA, USA or London, UK)",
  "technologies": ["List 6-8 actual technologies: programming languages, frameworks, cloud providers, databases"],
  "leadership": ["CEO Full Name - CEO", "CTO Full Name - CTO", "CFO Full Name - CFO"],
  "recentDevelopments": ["Recent funding round or milestone", "New product launch or feature", "Strategic partnership or acquisition", "Market expansion or growth metric"]
}

EXAMPLES OF GOOD DATA:
- employeeCount: "8,000" NOT "8,000-10,000" or "Unknown"
- revenue: "$14B (2023)" NOT "Billions" or "High"
- location: "San Francisco, CA, USA" NOT "California" or "US"
- technologies: ["Ruby", "Go", "React", "AWS", "PostgreSQL", "Kubernetes"] NOT ["Web Stack", "Cloud"]

For unknown companies: Make educated inferences based on domain name, but keep data realistic and consistent.`;

    const researcherInput = `Research company at domain: ${domain}

Provide comprehensive, factual information. If this is a major company (Fortune 500, unicorn startup, well-known tech company), use accurate data from your knowledge base.

Focus on:
- Exact employee count and revenue figures
- Specific headquarters location
- Real technology stack
- Named executives
- Recent news and developments`;

    const researcherOutput = await cerebras.chat(
      researcherPrompt,
      researcherInput,
      0.05  // Very low temperature for factual accuracy
    );
    trace.push({
      agent: "Researcher",
      input: `domain: ${domain}`,
      output: researcherOutput,
    });
    const dossier = parseSafe<DossierData>(researcherOutput);

    // Agent 2: Market Analyst
    console.log(`[${jobId}] Running Market Analyst agent...`);
    const marketPrompt = `You are a senior market analyst with expertise in competitive intelligence and market dynamics.

TASK: Analyze the market position and strategic outlook for this company.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "marketInsights": "3-4 sentences analyzing: (1) current market position and share, (2) competitive advantages and moats, (3) industry trends affecting them, (4) strategic positioning",
  "growthSignals": [
    "Specific growth indicator with data (e.g., 'YoY revenue growth of 45%')",
    "Market expansion signal (e.g., 'Entered European market Q3 2023')",
    "Product/service traction (e.g., 'Reached 1M active users milestone')",
    "Strategic advantage (e.g., 'First-mover advantage in AI-powered analytics')",
    "Partnership or validation (e.g., 'Partnership with Fortune 100 companies')"
  ],
  "risks": [
    "Competitive threat with specifics (e.g., 'Facing competition from Microsoft Azure')",
    "Market risk (e.g., 'Dependent on volatile crypto market')",
    "Regulatory or operational risk (e.g., 'Subject to increasing data privacy regulations')"
  ]
}

ANALYSIS FRAMEWORK:
- Use Porter's Five Forces thinking
- Consider TAM/SAM/SOM
- Evaluate competitive moats
- Assess market timing
- Identify strategic risks`;

    const marketInput = `Analyze market position for this company:

${researcherOutput}

Provide strategic analysis covering:
1. Market share and competitive position
2. Sustainable competitive advantages
3. Growth trajectory and momentum
4. Industry trends and tailwinds
5. Competitive threats and market risks

Be specific with data points, percentages, and concrete examples where possible.`;

    const marketOutput = await cerebras.chat(marketPrompt, marketInput, 0.15);
    trace.push({
      agent: "Market Analyst",
      input: researcherOutput,
      output: marketOutput,
    });

    // Agent 3: Tech Debt Analyzer
    console.log(`[${jobId}] Running Tech Debt agent...`);
    const techPrompt = `You are a CTO-level technology consultant specializing in digital transformation and technical architecture.

TASK: Evaluate the company's technology maturity and modernization opportunities.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "techStackAnalysis": "3-4 sentences covering: (1) current technology choices and architecture, (2) level of technical sophistication, (3) cloud/AI adoption status, (4) technical debt indicators or modernization needs",
  "gaps": [
    "Specific technology gap (e.g., 'Limited AI/ML capabilities in product')",
    "Infrastructure gap (e.g., 'Legacy on-premise infrastructure, not cloud-native')",
    "Capability gap (e.g., 'No real-time data processing pipeline')",
    "Security/compliance gap (e.g., 'Needs SOC 2 Type II certification')"
  ],
  "urgencyScore": 65
}

SCORING GUIDE (0-100):
- 0-30: Modern stack, cloud-native, AI-enabled (low urgency)
- 31-60: Mixed stack, some modernization needed (medium urgency)
- 61-80: Legacy systems, significant tech debt (high urgency)
- 81-100: Critical technical debt, urgent modernization (very high urgency)

EVALUATION CRITERIA:
- Cloud adoption (AWS/Azure/GCP vs on-premise)
- Modern frameworks vs legacy
- AI/ML integration
- Microservices vs monolith
- DevOps maturity
- Data infrastructure
- Security posture`;

    const techInput = `Evaluate technology maturity for:

${researcherOutput}

Assess:
1. Technology stack modernity (based on listed technologies)
2. Cloud vs on-premise infrastructure
3. AI/ML adoption and capabilities
4. Digital transformation progress
5. Technical debt indicators
6. Modernization opportunities

Provide specific, actionable insights about their technology gaps and urgency for modernization.`;

    const techOutput = await cerebras.chat(techPrompt, techInput, 0.15);
    trace.push({
      agent: "Tech Debt",
      input: context.scrapedContent || "",
      output: techOutput,
    });

    // Agent 4: Financial Pressure
    console.log(`[${jobId}] Running Financial Pressure agent...`);
    const financialPrompt = `You are a CFO-level financial analyst specializing in B2B buying signals and budget indicators.

TASK: Assess financial health and identify budget pressure signals that indicate buying urgency.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "financialSignals": [
    "Funding signal (e.g., 'Raised $100M Series C in Q4 2023')",
    "Growth signal (e.g., 'Revenue grew 150% YoY')",
    "Hiring signal (e.g., 'Expanded team by 200 employees in 2023')",
    "Profitability signal (e.g., 'Achieved profitability in Q2 2023')",
    "Budget indicator (e.g., 'Announced $50M budget for digital transformation')"
  ],
  "pressureScore": 45
}

SCORING GUIDE (0-100):
- 0-30: Strong financials, no urgency (low pressure to buy)
- 31-60: Healthy but growth-focused (medium pressure, strategic buys)
- 61-80: Budget constraints or efficiency focus (high pressure, ROI-driven)
- 81-100: Financial stress or urgent needs (very high pressure, must-have solutions)

BUYING SIGNALS TO IDENTIFY:
- Recent funding = budget available
- Rapid hiring = scaling pains
- Profitability push = efficiency focus
- Market expansion = new capabilities needed
- Leadership changes = new priorities
- Layoffs = cost optimization focus`;

    const financialInput = `Analyze financial health and buying signals for:

${researcherOutput}

Evaluate:
1. Funding status and runway
2. Revenue growth trajectory
3. Profitability status
4. Hiring trends (expansion vs contraction)
5. Budget indicators for new purchases
6. Financial pressure points

Identify signals that indicate budget availability and urgency to buy solutions.`;

    const financialOutput = await cerebras.chat(
      financialPrompt,
      financialInput,
      0.15
    );
    trace.push({
      agent: "Financial",
      input: JSON.stringify(context.newsData),
      output: financialOutput,
    });

    // Agent 5: Risk & Objection
    console.log(`[${jobId}] Running Risk agent...`);
    const riskPrompt = `You are a highly skeptical VP of Sales using reject-first reasoning. Your job is to find reasons NOT to pursue this account.

TASK: Identify 5 concrete, specific objections and deal-breakers.

CRITICAL: Return ONLY valid JSON array with NO additional text.

REQUIRED JSON STRUCTURE:
[
  {
    "objection": "Specific objection title (e.g., 'Strong internal data team may build in-house')",
    "explanation": "2-3 sentences explaining why this is a deal-breaker, with specific evidence from the company profile"
  },
  {
    "objection": "Second objection title",
    "explanation": "Detailed explanation with reasoning"
  },
  {
    "objection": "Third objection title",
    "explanation": "Detailed explanation with reasoning"
  },
  {
    "objection": "Fourth objection title",
    "explanation": "Detailed explanation with reasoning"
  },
  {
    "objection": "Fifth objection title",
    "explanation": "Detailed explanation with reasoning"
  }
]

OBJECTION CATEGORIES TO CONSIDER:
1. COMPETITIVE: "Already using competitor X" or "Strong relationship with vendor Y"
2. BUILD VS BUY: "Large engineering team likely to build in-house"
3. BUDGET: "Recent layoffs indicate budget constraints"
4. TIMING: "Just completed similar implementation"
5. FIT: "Not in our ideal customer profile"
6. PRIORITY: "Other initiatives taking precedence"
7. DECISION: "Complex buying process with many stakeholders"

Be ruthlessly critical. Find real reasons this deal could fail.`;

    const riskInput = `Find 5 specific reasons NOT to pursue this account:

COMPANY PROFILE:
${researcherOutput}

MARKET ANALYSIS:
${marketOutput}

TECHNOLOGY ASSESSMENT:
${techOutput}

FINANCIAL ANALYSIS:
${financialOutput}

Identify concrete deal-breakers such as:
- Competitive threats
- Budget constraints
- Technical barriers
- Timing issues
- Strategic misalignment
- Decision-making complexity

Be specific and reference actual details from the analyses above.`;

    const riskOutput = await cerebras.chat(riskPrompt, riskInput, 0.1);
    trace.push({
      agent: "Risk",
      input: "reject-first",
      output: riskOutput,
    });

    // Agent 6: Decision Arbiter
    console.log(`[${jobId}] Running Decision Arbiter agent...`);
    const arbiterPrompt = `You are the VP of Strategy at DataVex making the FINAL go/no-go decision on this prospect.

TASK: Make a definitive PURSUE or IGNORE verdict using reject-first reasoning.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "verdict": "PURSUE",
  "decisionReasoning": "4-5 sentences that: (1) acknowledge the main objections, (2) explain why they can be overcome or are acceptable risks, (3) highlight the strongest positive signals, (4) provide strategic rationale for the decision",
  "confidenceScore": 85,
  "signals": [
    "Strongest positive signal with specifics",
    "Second strongest signal",
    "Third positive indicator",
    "Fourth compelling reason"
  ],
  "riskFactors": [
    "Primary risk to monitor",
    "Secondary concern",
    "Third risk factor"
  ]
}

DECISION FRAMEWORK:
1. Review ALL 5 objections from Risk Agent
2. Assess if objections are:
   - FATAL (cannot overcome) → IGNORE
   - MANAGEABLE (can mitigate) → PURSUE
3. Weigh positive signals vs risks
4. Consider strategic fit for DataVex
5. Make decisive call with confidence score

CONFIDENCE SCORING (0-100):
- 90-100: Slam dunk, minimal risk
- 75-89: Strong fit, manageable risks
- 60-74: Moderate fit, notable concerns
- 40-59: Weak fit, significant risks
- 0-39: Poor fit, high risk

VERDICT CRITERIA:
PURSUE if:
- Strong market position + growth
- Budget availability signals
- Technology gaps we can fill
- Objections are manageable

IGNORE if:
- Fatal competitive threat
- No budget indicators
- Poor strategic fit
- Objections are insurmountable`;

    const arbiterInput = `Make FINAL verdict for this prospect:

COMPANY PROFILE:
${researcherOutput}

MARKET POSITION:
${marketOutput}

TECHNOLOGY ASSESSMENT:
${techOutput}

FINANCIAL HEALTH:
${financialOutput}

OBJECTIONS TO ADDRESS:
${riskOutput}

INSTRUCTIONS:
1. Address EACH of the 5 objections explicitly
2. Decide if objections are fatal or manageable
3. Weigh positive signals against risks
4. Make clear PURSUE or IGNORE decision
5. Provide confidence score (0-100)
6. List top 4 positive signals
7. List top 3 risk factors to monitor

Be decisive. This is the final call.`;

    const arbiterOutput = await cerebras.chat(arbiterPrompt, arbiterInput, 0.05);
    trace.push({
      agent: "Arbiter",
      input: "all analyses",
      output: arbiterOutput,
    });

    const arbiter = parseSafe<ArbiterDecision>(arbiterOutput);
    const verdict =
      typeof arbiter === "object" && arbiter.verdict
        ? arbiter.verdict
        : arbiterOutput.includes("PURSUE")
        ? "PURSUE"
        : "IGNORE";

    let outreachMessage = "";
    let bonusContent: BonusContent = {};

    if (verdict === "PURSUE") {
      // Agent 7: Outreach Generator
      console.log(`[${jobId}] Running Outreach agent...`);
      const outreachPrompt = `You are a top-performing B2B sales consultant crafting a personalized outreach message.

TASK: Write a compelling, personalized outreach email/LinkedIn message.

REQUIREMENTS:
- 3-4 paragraphs
- Professional but conversational tone
- Reference SPECIFIC company details (name, industry, recent developments)
- Highlight relevant value proposition for THEIR situation
- Include clear, low-friction call-to-action
- Avoid generic sales language
- Make it feel like you researched them specifically

STRUCTURE:
Paragraph 1: Hook - Reference something specific about their company
Paragraph 2: Value - Explain how DataVex solves their specific challenge
Paragraph 3: Proof - Brief credibility or relevant insight
Paragraph 4: CTA - Simple, clear next step

Return ONLY the message text. No JSON, no formatting markers, no subject line.`;

      const outreachInput = `Create personalized outreach for:

COMPANY: ${researcherOutput}

DECISION CONTEXT: ${arbiterOutput}

KEY POINTS TO REFERENCE:
- Their industry and market position
- Recent developments or growth signals
- Specific challenges they likely face
- How DataVex's prospect intelligence helps them

Make it feel personal and researched, not templated.`;

      outreachMessage = await cerebras.chat(outreachPrompt, outreachInput, 0.25);

      // Agent 8: Bonus Content
      console.log(`[${jobId}] Running Bonus Content agent...`);
      const bonusPrompt = `You are a thought leadership content strategist creating LinkedIn post concepts.

TASK: Create an engaging LinkedIn post idea that relates to this company's industry or challenges.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "platform": "LinkedIn",
  "content": "A compelling post concept (3-4 sentences) that: (1) starts with a hook related to their industry, (2) provides an insight or trend, (3) relates to prospect intelligence or sales, (4) ends with engagement question. Make it thought-provoking and shareable."
}

EXAMPLES OF GOOD CONCEPTS:
- "The fintech industry is moving at breakneck speed. Companies like [Company] are proving that [insight]. But here's what most sales teams miss: [intelligence angle]. How is your team keeping up?"
- "I analyzed 100 [industry] companies last month. The pattern was clear: [insight]. This is why prospect intelligence isn't optional anymore. What's your take?"

Make it relevant to THEIR industry and challenges.`;

      const bonusInput = `Create thought leadership concept related to:

COMPANY: ${researcherOutput}

INDUSTRY CONTEXT: ${marketOutput}

Create a LinkedIn post concept that:
- Relates to their industry or market
- Provides valuable insight
- Connects to prospect intelligence
- Encourages engagement

Make it specific to their industry, not generic.`;

      const bonusOutput = await cerebras.chat(bonusPrompt, bonusInput, 0.3);
      const parsedBonus = parseSafe<BonusContent>(bonusOutput);
      bonusContent = typeof parsedBonus === "object" ? parsedBonus : {};
    } else {
      // Rejection report
      console.log(`[${jobId}] Running Rejection Report...`);
      const rejectionPrompt = `You are a sales analyst writing a rejection summary.

TASK: Explain why this account should NOT be pursued.

REQUIREMENTS:
- 2-3 sentences
- Reference the main objections
- Be clear and professional
- Provide actionable reasoning

Return ONLY the text, no JSON, no formatting.`;

      const rejectionInput = `Explain rejection for:

COMPANY: ${researcherOutput}

OBJECTIONS: ${riskOutput}

DECISION: ${arbiterOutput}

Summarize why this is not a good fit for DataVex right now.`;

      outreachMessage = await cerebras.chat(
        rejectionPrompt,
        rejectionInput,
        0.15
      );
      bonusContent = {
        platform: "Internal",
        content: "No bonus content for ignored leads.",
      };
    }

    console.log(`[${jobId}] Pipeline completed successfully`);

    return {
      jobId,
      status: "completed",
      dossier: typeof dossier === "object" ? dossier : undefined,
      verdict,
      decisionReasoning:
        typeof arbiter === "object" && arbiter.decisionReasoning
          ? arbiter.decisionReasoning
          : arbiterOutput,
      outreachMessage,
      bonusContent,
      trace,
      sourceData: {
        scrapedContent: context.scrapedContent,
        newsData: context.newsData,
      },
    };
  } catch (error) {
    console.error(`[${jobId}] Pipeline failed:`, error);
    throw error;
  }
}
