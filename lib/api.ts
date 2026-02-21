/**
 * Frontend API client for backend integration
 * Includes fallback to mock data on failure
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface BackendAnalysis {
  jobId: string;
  domain: string;
  status: "pending" | "processing" | "completed" | "failed";
  dossier?: Record<string, unknown>;
  verdict?: "PURSUE" | "IGNORE";
  decisionReasoning?: string;
  outreachMessage?: string;
  bonusContent?: Record<string, unknown>;
  trace?: Array<Record<string, unknown>>;
  createdAt?: string;
  updatedAt?: string;
}

interface SubmitResponse {
  jobId: string;
  status?: string;
  reused?: boolean;
  message?: string;
}

interface StatusResponse {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  verdict?: "PURSUE" | "IGNORE";
  updatedAt: string;
}

/**
 * Submit a domain for analysis
 */
export async function submitAnalysis(
  domain: string
): Promise<SubmitResponse | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    });

    if (!response.ok) {
      console.warn(
        `Backend analyze failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend unavailable for submitAnalysis:", error);
    return null;
  }
}

/**
 * Poll job status until completed or failed
 */
export async function pollStatus(
  jobId: string,
  maxAttempts = 60,
  intervalMs = 2000
): Promise<StatusResponse | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/status/${jobId}`);

      if (!response.ok) {
        console.warn(
          `Backend status check failed: ${response.status} ${response.statusText}`
        );
        return null;
      }

      const status: StatusResponse = await response.json();

      if (status.status === "completed" || status.status === "failed") {
        return status;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    } catch (error) {
      console.warn("Backend unavailable for pollStatus:", error);
      return null;
    }
  }

  console.warn("Polling timeout reached");
  return null;
}

/**
 * Fetch completed analysis results
 */
export async function fetchResults(
  jobId: string
): Promise<BackendAnalysis | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/results/${jobId}`);

    if (!response.ok) {
      console.warn(
        `Backend results fetch failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend unavailable for fetchResults:", error);
    return null;
  }
}

/**
 * Complete workflow: submit → poll → fetch
 * Returns null if backend unavailable (caller should fallback to mock)
 */
export async function analyzeViaBackend(
  domain: string
): Promise<BackendAnalysis | null> {
  // Step 1: Submit
  const submitResult = await submitAnalysis(domain);
  if (!submitResult) {
    return null;
  }

  const { jobId } = submitResult;

  // If reused and already completed, try fetching immediately
  if (submitResult.reused && submitResult.status === "completed") {
    const results = await fetchResults(jobId);
    if (results) {
      return results;
    }
  }

  // Step 2: Poll until complete
  const statusResult = await pollStatus(jobId);
  if (!statusResult || statusResult.status !== "completed") {
    return null;
  }

  // Step 3: Fetch results
  return await fetchResults(jobId);
}
