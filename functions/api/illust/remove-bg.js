// POST /api/illust/remove-bg  { assetId } → { jobId }
import { start, json } from './_illust.js';
import { MODEL_REMOVE_BG } from '../okman/_scenario.js';

export async function onRequestPost({ request, env }) {
  try {
    const { assetId } = await request.json().catch(() => ({}));
    if (!assetId) return json({ error: 'assetId가 필요합니다.' }, 400);
    return json({ jobId: await start(env, MODEL_REMOVE_BG, { image: assetId, preserveAlpha: true }) });
  } catch (e) { return json({ error: e.message }, 500); }
}
