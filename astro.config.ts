import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

import astroExpressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "always",
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon(), astroExpressiveCode(), mdx()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Noto Sans",
      cssVariable: "--font-noto-sans",
      weights: ["100 900"],
    },
  ],
  image: {
    responsiveStyles: true,
  },
});
