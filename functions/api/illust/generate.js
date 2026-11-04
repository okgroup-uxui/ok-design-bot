// POST /api/illust/generate  { prompt } → { jobId }
import { start, json, MODEL_ID, BASE_MODEL } from './_illust.js';

export async function onRequestPost({ request, env }) {
  try {
    const { prompt = '' } = await request.json().catch(() => ({}));
    if (!prompt.trim()) return json({ error: '프롬프트(prompt)가 필요합니다.' }, 400);
    const jobId = await start(env, BASE_MODEL, {
      modelId: MODEL_ID, loras: [MODEL_ID], lorasScale: [0.8],
      prompt: prompt.trim(), strength: 0.8, numOutputs: 1,
      numInferenceSteps: 28, width: 1104, height: 832, guidance: 3.5,
    });
    return json({ jobId });
  } catch (e) { return json({ error: e.message }, 500); }
}
