// OK 일러스트 — Scenario Flux LoRA 모델 (기존 generate.js 설정 이식)
// 키는 okman과 같은 Cloudflare Secrets(SCENARIO_API_KEY / SCENARIO_API_SECRET)를 사용한다.
import { authHeader } from '../okman/_scenario.js';

const BASE = 'https://api.cloud.scenario.com/v1';
export const MODEL_ID = 'model_CPxGWWCNz5TRs2cPbdQGoz2a';
export const BASE_MODEL = 'model_bfl-flux-1-dev';
export const PROJECT_ID = 'proj_gp2NkPp1GQsFKnFjHroTfJhm';


async function call(env, path, init = {}) {
  const r = await fetch(`${BASE}${path}${path.includes('?') ? '&' : '?'}projectId=${PROJECT_ID}`, {
    ...init,
    headers: { Authorization: authHeader(env), 'Content-Type': 'application/json' },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Scenario 오류 (${r.status}): ${j.message || j.error || JSON.stringify(j)}`);
  return j;
}

export async function start(env, modelId, body) {
  const j = await call(env, `/generate/custom/${modelId}`, { method: 'POST', body: JSON.stringify(body) });
  const jobId = j.job?.jobId || j.jobId;
  if (!jobId) throw new Error('jobId를 받지 못함');
  return jobId;
}

export async function jobStatus(env, id) {
  const j = await call(env, `/jobs/${id}`);
  const job = j.job || j;
  return { status: job.status, progress: job.progress || 0, assetIds: job.metadata?.assetIds || job.assetIds || [], error: job.metadata?.error || null };
}

export async function assetUrl(env, id) {
  const j = await call(env, `/assets/${id}`);
  return j.asset?.url || j.url || null;
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
