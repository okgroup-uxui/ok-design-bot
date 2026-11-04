// GET /api/illust/job?id= → { status, progress, assetIds, images, error }
import { jobStatus, assetUrl, json } from './_illust.js';

export async function onRequestGet({ request, env }) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json({ error: 'job id가 필요합니다.' }, 400);
    const j = await jobStatus(env, id);
    const images = j.status === 'success' ? (await Promise.all(j.assetIds.map(a => assetUrl(env, a)))).filter(Boolean) : [];
    return json({ ...j, images });
  } catch (e) { return json({ error: e.message }, 500); }
}
