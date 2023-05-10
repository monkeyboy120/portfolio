import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { j as server_default, k as deserializeManifest } from './chunks/astro.ef17a847.mjs';
import { _ as _page0, a as _page1, b as _page2, c as _page3, d as _page4, e as _page5, f as _page6, g as _page7, h as _page8 } from './chunks/pages/all.b4c628ce.mjs';
import 'mime';
import 'cookie';
import 'kleur/colors';
import 'slash';
import 'path-to-regexp';
import 'html-escaper';
import 'string-width';
import 'image-size';
import 'node:fs/promises';
import 'node:url';
/* empty css                                 */import 'node:path';
import 'http-cache-semantics';
import 'node:os';
import 'magic-string';
import 'node:stream';

function check(Component) {
	return Component['render'] && Component['$$render'];
}

async function renderToStaticMarkup(Component, props, slotted) {
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		slots[key] = () =>
			`<astro-slot${key === 'default' ? '' : ` name="${key}"`}>${value}</astro-slot>`;
	}
	const { html } = Component.render(props, { $$slots: slots });
	return { html };
}

const _renderer1 = {
	check,
	renderToStaticMarkup,
};

const pageMap = new Map([["node_modules/@astrojs/image/dist/endpoint.js", _page0],["src/pages/index.astro", _page1],["src/pages/photography.astro", _page2],["src/pages/projects.astro", _page3],["src/pages/contact.astro", _page4],["src/pages/about.astro", _page5],["src/pages/music.astro", _page6],["src/pages/blog/[slug].astro", _page7],["src/pages/blog.astro", _page8],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/svelte","clientEntrypoint":"@astrojs/svelte/client.js","serverEntrypoint":"@astrojs/svelte/server.js"}, { ssr: _renderer1 }),];

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/image/dist/endpoint.js","pathname":"/_image","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.2480a077.css"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.2480a077.css"}],"routeData":{"route":"/photography","type":"page","pattern":"^\\/photography\\/?$","segments":[[{"content":"photography","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/photography.astro","pathname":"/photography","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.2480a077.css"}],"routeData":{"route":"/projects","type":"page","pattern":"^\\/projects\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects.astro","pathname":"/projects","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.2480a077.css"}],"routeData":{"route":"/contact","type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.2480a077.css"}],"routeData":{"route":"/about","type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.2480a077.css"}],"routeData":{"route":"/music","type":"page","pattern":"^\\/music\\/?$","segments":[[{"content":"music","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/music.astro","pathname":"/music","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.2480a077.css"}],"routeData":{"route":"/blog/[slug]","type":"page","pattern":"^\\/blog\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/blog/[slug].astro","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.2480a077.css"}],"routeData":{"route":"/blog","type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","prerender":false,"_meta":{"trailingSlash":"ignore"}}}],"site":"https://joshuala.com","base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"gfm":true,"smartypants":true},"pageMap":null,"componentMetadata":[["/Users/joshuala/Projects/portfolio/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/joshuala/Projects/portfolio/src/pages/blog.astro",{"propagation":"in-tree","containsHead":true}],["/Users/joshuala/Projects/portfolio/src/pages/blog/[slug].astro",{"propagation":"in-tree","containsHead":true}],["/Users/joshuala/Projects/portfolio/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/Users/joshuala/Projects/portfolio/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/joshuala/Projects/portfolio/src/pages/music.astro",{"propagation":"none","containsHead":true}],["/Users/joshuala/Projects/portfolio/src/pages/photography.astro",{"propagation":"none","containsHead":true}],["/Users/joshuala/Projects/portfolio/src/pages/projects.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-pages-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"_@astrojs-ssr-virtual-entry.mjs","/Users/joshuala/Projects/portfolio/node_modules/@astrojs/image/dist/vendor/squoosh/image-pool.js":"chunks/image-pool.c24d15b2.mjs","/Users/joshuala/Projects/portfolio/src/content/blog/first-post.md?astroContent=true":"chunks/first-post.46364b77.mjs","/Users/joshuala/Projects/portfolio/src/content/blog/first-post.md?astroPropagatedAssets=true":"chunks/first-post.1be5b192.mjs","/Users/joshuala/Projects/portfolio/src/content/blog/first-post.md":"chunks/first-post.6dabcb2d.mjs","/Users/joshuala/Projects/portfolio/src/components/PhotoSlide.svelte":"_astro/PhotoSlide.f2cb5c9e.js","@astrojs/svelte/client.js":"_astro/client.c4e17359.js","/Users/joshuala/Projects/portfolio/src/components/navbar/Navbar.svelte":"_astro/Navbar.9f928e0e.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/about.2480a077.css","/IMG_3959.jpg","/IMG_4435.JPG","/IMG_5764.jpg","/favicon.svg","/robots.txt","/_astro/Navbar.9f928e0e.js","/_astro/PhotoSlide.f2cb5c9e.js","/_astro/client.c4e17359.js","/_astro/index.6fd68fca.js"]}), {
	pageMap: pageMap,
	renderers: renderers,
	
});
const _args = {};
const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap, renderers };
