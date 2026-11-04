// GET /api/illust/download?asset= → PNG attachment
import { assetUrl } from './_illust.js';

export async function onRequestGet({ request, env }) {
  try {
    const id = new URL(request.url).searchParams.get('asset');
    if (!id) return new Response('asset 누락', { status: 400 });
    const url = await assetUrl(env, id);
    if (!url) return new Response('이미지를 찾을 수 없습니다.', { status: 404 });
    const r = await fetch(url);
    if (!r.ok) return new Response('이미지 다운로드 실패', { status: 502 });
    return new Response(r.body, { headers: { 'Content-Type': 'image/png', 'Content-Disposition': `attachment; filename="okillust_${id}.png"` } });
  } catch (e) { return new Response(e.message, { status: 500 }); }
}
