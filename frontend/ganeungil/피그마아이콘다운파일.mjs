/**
 * Figma 에셋 로컬 저장 스크립트
 * 실행: node download-assets.mjs
 * 저장 위치: src/assets/
 */

import https from "https";
import http from "http";
import { createWriteStream, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "src/assets");
mkdirSync(OUTPUT_DIR, { recursive: true });

// ── 에셋 목록 (파일명: URL) ──────────────────────────────
const ASSETS = [
  // Onboard_2.0 아이콘
  { name: "icon-gps",    url: "https://www.figma.com/api/mcp/asset/860ffbc8-1f74-4b18-b735-b053f6309dfc" },
  { name: "icon-arrow",  url: "https://www.figma.com/api/mcp/asset/9f8f86b9-73bd-43e2-96b1-7ce770a7e380" },
  { name: "icon-search", url: "https://www.figma.com/api/mcp/asset/ef140e3e-cb9c-4f0d-a6d6-0b9c536179b1" },
  { name: "icon-all",    url: "https://www.figma.com/api/mcp/asset/0fe1c29b-9364-4bd0-b1a4-32e26ffc7b80" },
  { name: "icon-drink",  url: "https://www.figma.com/api/mcp/asset/158e9de0-6b6b-4103-822b-6b7d1ca007e7" },
  { name: "icon-food",   url: "https://www.figma.com/api/mcp/asset/b2902803-559d-43fa-aab2-ff71ce0a5d0b" },
  { name: "icon-rest",   url: "https://www.figma.com/api/mcp/asset/9131ad09-7a1b-4f90-889e-91cacc708072" },
  { name: "icon-shop",   url: "https://www.figma.com/api/mcp/asset/fabff748-08ef-40e4-94aa-e37533f1fab9" },
  { name: "icon-view",   url: "https://www.figma.com/api/mcp/asset/fe88fdb5-7a58-444f-9539-394344d9373d" },
  { name: "icon-heart",  url: "https://www.figma.com/api/mcp/asset/9a3454bd-1607-429a-b2be-1d462683a222" },
  { name: "icon-login",  url: "https://www.figma.com/api/mcp/asset/348992db-4fea-4d1d-9033-05a3f42ab59e" },
  { name: "icon-menu",   url: "https://www.figma.com/api/mcp/asset/5c2a55f2-e5df-4c85-84c9-de1417c24003" },
  { name: "img-place",   url: "https://www.figma.com/api/mcp/asset/b0302e9a-ef09-4fcf-bad7-d3d34952de1f" },

  // Onboard_new 아이콘
  { name: "img-hero",       url: "https://www.figma.com/api/mcp/asset/af01c495-7328-404c-9bdf-3da68515235d" },
  { name: "img-story1",     url: "https://www.figma.com/api/mcp/asset/726ecc9c-4bd8-434a-abc4-7b1f3597f0c7" },
  { name: "img-story2",     url: "https://www.figma.com/api/mcp/asset/de46aa8b-26ba-4ab2-9422-6378e043abf8" },
  { name: "icon-route",     url: "https://www.figma.com/api/mcp/asset/ff30a068-3884-463c-aced-e15ed060d9eb" },
  { name: "icon-leisure",   url: "https://www.figma.com/api/mcp/asset/f50e5b80-f479-45e7-8cc5-8efbe5ca2ad6" },
  { name: "icon-discover",  url: "https://www.figma.com/api/mcp/asset/5269354d-25c3-42ac-abe8-83089109b4b0" },
  { name: "icon-find",      url: "https://www.figma.com/api/mcp/asset/5360215b-dbc1-41f2-b010-bd2c8428cdd5" },
  { name: "icon-explore",   url: "https://www.figma.com/api/mcp/asset/e4b42c32-b847-4302-b1dd-8df1f5fd5577" },
  { name: "icon-login-new", url: "https://www.figma.com/api/mcp/asset/2baf1869-625a-4b24-922e-bf16ec63c3c5" },
  { name: "icon-menu-new",  url: "https://www.figma.com/api/mcp/asset/57afa410-cdf2-4912-95fe-c33130828e9b" },
];

// ── 리다이렉트 포함 다운로드 ─────────────────────────────
function download(url, name, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) return reject(new Error("Too many redirects"));

    const mod = url.startsWith("https") ? https : http;
    mod.get(url, (res) => {
      // 리다이렉트 처리
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        return download(res.headers.location, name, redirectCount + 1)
          .then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      // 확장자 결정
      const ct = res.headers["content-type"] || "";
      let ext = ".png";
      if (ct.includes("svg"))  ext = ".svg";
      else if (ct.includes("jpeg") || ct.includes("jpg")) ext = ".jpg";
      else if (ct.includes("webp")) ext = ".webp";

      const filepath = `${OUTPUT_DIR}/${name}${ext}`;
      const file = createWriteStream(filepath);
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve({ name, filepath, ext }); });
      file.on("error", reject);
    }).on("error", reject);
  });
}

// ── 실행 ────────────────────────────────────────────────
console.log(`\n📁 저장 위치: ${OUTPUT_DIR}\n`);

const results = [];
for (const asset of ASSETS) {
  try {
    const result = await download(asset.url, asset.name);
    console.log(`✅ ${result.name}${result.ext}`);
    results.push(result);
  } catch (e) {
    console.error(`❌ ${asset.name}: ${e.message}`);
    results.push({ name: asset.name, error: e.message });
  }
}

// ── 완료 후 import 경로 출력 ─────────────────────────────
console.log("\n─────────────────────────────────────");
console.log("📋 JSX import 경로 (복사해서 사용하세요):\n");
for (const r of results) {
  if (!r.error) {
    console.log(`import ${toCamel(r.name)} from "@/assets/${r.name}${r.ext}";`);
  }
}

function toCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
