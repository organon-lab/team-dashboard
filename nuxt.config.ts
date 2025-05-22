// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: [
    "@prisma/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "nuxt-auth-utils",
    "@sidebase/nuxt-auth",
    "@nuxtjs/mdc",
  ],
  auth: {
    provider: {
      type: "authjs",
      trustHost: false,
      defaultProvider: "github",
      addDefaultCallbackUrl: true,
    },
    globalAppMiddleware: true,
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark",
  },
  prisma: {
    autoSetupPrisma: true,
  },
  runtimeConfig: {
    oauth: {
      github: {
        clientId: "bla",
        clientSecret: "blabla",
      },
    },
  },
  mdc: {
    highlight: {
      theme: "github-dark",
      langs: ["js", "ts"],
      wrapperStyle: true,
    },
  },
  devtools: { enabled: true },
  experimental: {
    componentIslands: true,
  },
});
