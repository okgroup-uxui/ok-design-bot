// OK디자인봇 Worker 진입점 — /api/* 요청을 functions/ 폴더의 핸들러로 연결한다.
// 화면(index.html)과 /images/ 는 wrangler.jsonc 의 assets 설정이 먼저 처리한다.
import * as okGen from '../functions/api/okman/generate.js';
import * as okJob from '../functions/api/okman/job.js';
import * as okRmbg from '../functions/api/okman/remove-bg.js';
import * as okDl from '../functions/api/okman/download.js';
import * as ilGen from '../functions/api/illust/generate.js';
import * as ilJob from '../functions/api/illust/job.js';
import * as ilRmbg from '../functions/api/illust/remove-bg.js';
import * as ilDl from '../functions/api/illust/download.js';

const ROUTES = {
  'POST /api/okman/generate': okGen.onRequestPost,
  'GET /api/okman/job': okJob.onRequestGet,
  'POST /api/okman/remove-bg': okRmbg.onRequestPost,
  'GET /api/okman/download': okDl.onRequestGet,
  'POST /api/illust/generate': ilGen.onRequestPost,
  'GET /api/illust/job': ilJob.onRequestGet,
  'POST /api/illust/remove-bg': ilRmbg.onRequestPost,
  'GET /api/illust/download': ilDl.onRequestGet,
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const handler = ROUTES[`${request.method} ${pathname.replace(/\/$/, '')}`];
    if (handler) return handler({ request, env });
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: '없는 API 경로입니다.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return env.ASSETS.fetch(request);
  },
};
