import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import netlify from "@astrojs/netlify/functions";
import image from "@astrojs/image";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://joshuala.com',
  integrations: [tailwind(), svelte(), image(), sitemap()],
  output: "server",
  adapter: netlify()
});