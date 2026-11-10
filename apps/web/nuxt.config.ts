import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-08-23",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: false },
  nitro: { preset: "bun" },
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL ?? "http://localhost:8080",
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
    },
  },
  routeRules: {
    "/**": {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    },
  },
  typescript: { strict: true, typeCheck: true },
  vite: { plugins: [tailwindcss()] },
});
