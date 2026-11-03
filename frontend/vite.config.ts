import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { loadEnv, type Plugin } from "vite";
import { defineConfig } from "vitest/config";

/**
 * Fills %SITE_URL% in index.html (canonical, hreflang, Open Graph, schema) and writes robots.txt and
 * sitemap.xml at build time. The URL comes from VITE_SITE_URL, else Render's own RENDER_EXTERNAL_URL.
 */
function siteMeta(siteUrl: string): Plugin {
  return {
    name: "site-meta",
    transformIndexHtml: (html) => html.replaceAll("%SITE_URL%", siteUrl),
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n` });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${siteUrl}/</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="${siteUrl}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/?lang=en"/>
  </url>
  <url>
    <loc>${siteUrl}/?lang=en</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="${siteUrl}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/?lang=en"/>
  </url>
</urlset>
`,
      });
    },
  };
}

// In dev, /api and /media are proxied to Django so no CORS setup is needed.
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };
  const siteUrl = (env.VITE_SITE_URL || env.RENDER_EXTERNAL_URL || "http://localhost:5173").replace(/\/+$/, "");

  return {
    // "/" on Render and Docker; "/portfolio/" on GitHub Pages (set by the Pages workflow).
    base: env.VITE_BASE || "/",
    plugins: [react(), tailwindcss(), siteMeta(siteUrl)],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: {
      rollupOptions: {
        output: {
          // Long-lived vendor chunks cache well across deploys. Everything else (antd included)
          // is left to Rollup, so admin-only libraries stay in the lazy admin chunks.
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return undefined;
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
            if (/[\\/]node_modules[\\/](i18next|react-i18next)[\\/]/.test(id)) return "i18n";
            if (/[\\/]node_modules[\\/](axios)[\\/]/.test(id)) return "http";
            return undefined;
          },
        },
      },
    },
    server: {
      proxy: {
        "/api": "http://127.0.0.1:8000",
        "/media": "http://127.0.0.1:8000",
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: false,
      // antd pulls in a lot of code; give the first render room to breathe on slow machines
      testTimeout: 15000,
    },
  };
});
