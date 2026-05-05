export default defineNuxtConfig({
  devtools: { enabled: false },

  srcDir: 'app/',

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],

  imports: {
    dirs: ['stores', 'composables'],
  },

  css: ['@/assets/css/main.css'],

  tailwindcss: {
    configPath: 'tailwind.config.js',
  },

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    supabaseServiceKey:  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    mpesaConsumerKey:    process.env.MPESA_CONSUMER_KEY ?? '',
    mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET ?? '',
    mpesaPasskey:        process.env.MPESA_PASSKEY ?? '',
    mpesaShortcode:      process.env.MPESA_SHORTCODE ?? '174379',
    mpesaSandbox:        process.env.MPESA_SANDBOX ?? 'true',
    public: {
      siteUrl:         process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
      freeShippingMin: 5000,
      shippingFee:     300,
    },
  },

  app: {
    head: {
      title: 'SWM Nutrition – Expert Nutritional Consultancy in Kenya',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Professional nutritional consultancy based in Nairobi, Kenya.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@1,600;1,700;1,800&display=swap' },
      ],
    },
  },

  compatibilityDate: '2026-03-03',
})
