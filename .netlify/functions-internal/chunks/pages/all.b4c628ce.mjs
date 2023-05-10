import mime from 'mime';
import { dim, bold, red, yellow, cyan, green } from 'kleur/colors';
import sizeOf from 'image-size';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
/* empty css                           */import { c as createAstro, a as createComponent, r as renderTemplate, b as renderHead, d as renderComponent, e as renderSlot, m as maybeRenderHead, f as addAttribute, g as createCollectionToGlobResultMap, h as createGetCollection, i as createGetEntryBySlug, s as spreadAttributes } from '../astro.ef17a847.mjs';
import 'node:path';
import 'http-cache-semantics';
import 'node:os';
import 'magic-string';
import 'node:stream';

const PREFIX = "@astrojs/image";
const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function getPrefix(level, timestamp) {
  let prefix = "";
  if (timestamp) {
    prefix += dim(dateTimeFormat.format(new Date()) + " ");
  }
  switch (level) {
    case "debug":
      prefix += bold(green(`[${PREFIX}] `));
      break;
    case "info":
      prefix += bold(cyan(`[${PREFIX}] `));
      break;
    case "warn":
      prefix += bold(yellow(`[${PREFIX}] `));
      break;
    case "error":
      prefix += bold(red(`[${PREFIX}] `));
      break;
  }
  return prefix;
}
const log = (_level, dest) => ({ message, level, prefix = true, timestamp = true }) => {
  if (levels[_level] >= levels[level]) {
    dest(`${prefix ? getPrefix(level, timestamp) : ""}${message}`);
  }
};
const error = log("error", console.error);

async function metadata(src, data) {
  const file = data || await fs.readFile(src);
  const { width, height, type, orientation } = await sizeOf(file);
  const isPortrait = (orientation || 0) >= 5;
  if (!width || !height || !type) {
    return void 0;
  }
  return {
    src: fileURLToPath(src),
    width: isPortrait ? height : width,
    height: isPortrait ? width : height,
    format: type,
    orientation
  };
}

function isRemoteImage(src) {
  return /^(https?:)?\/\//.test(src);
}
function removeQueryString(src) {
  const index = src.lastIndexOf("?");
  return index > 0 ? src.substring(0, index) : src;
}
function extname(src) {
  const base = basename(src);
  const index = base.lastIndexOf(".");
  if (index <= 0) {
    return "";
  }
  return base.substring(index);
}
function basename(src) {
  return removeQueryString(src.replace(/^.*[\\\/]/, ""));
}

function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp", "svg"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
function parseAspectRatio(aspectRatio) {
  if (!aspectRatio) {
    return void 0;
  }
  if (typeof aspectRatio === "number") {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(":");
    return parseInt(width) / parseInt(height);
  }
}
function isSSRService(service) {
  return "transform" in service;
}
class BaseSSRService {
  async getImageAttributes(transform) {
    const { width, height, src, format, quality, aspectRatio, ...rest } = transform;
    return {
      ...rest,
      width,
      height
    };
  }
  serializeTransform(transform) {
    const searchParams = new URLSearchParams();
    if (transform.quality) {
      searchParams.append("q", transform.quality.toString());
    }
    if (transform.format) {
      searchParams.append("f", transform.format);
    }
    if (transform.width) {
      searchParams.append("w", transform.width.toString());
    }
    if (transform.height) {
      searchParams.append("h", transform.height.toString());
    }
    if (transform.aspectRatio) {
      searchParams.append("ar", transform.aspectRatio.toString());
    }
    if (transform.fit) {
      searchParams.append("fit", transform.fit);
    }
    if (transform.background) {
      searchParams.append("bg", transform.background);
    }
    if (transform.position) {
      searchParams.append("p", encodeURI(transform.position));
    }
    searchParams.append("href", transform.src);
    return { searchParams };
  }
  parseTransform(searchParams) {
    if (!searchParams.has("href")) {
      return void 0;
    }
    let transform = { src: searchParams.get("href") };
    if (searchParams.has("q")) {
      transform.quality = parseInt(searchParams.get("q"));
    }
    if (searchParams.has("f")) {
      const format = searchParams.get("f");
      if (isOutputFormat(format)) {
        transform.format = format;
      }
    }
    if (searchParams.has("w")) {
      transform.width = parseInt(searchParams.get("w"));
    }
    if (searchParams.has("h")) {
      transform.height = parseInt(searchParams.get("h"));
    }
    if (searchParams.has("ar")) {
      const ratio = searchParams.get("ar");
      if (isAspectRatioString(ratio)) {
        transform.aspectRatio = ratio;
      } else {
        transform.aspectRatio = parseFloat(ratio);
      }
    }
    if (searchParams.has("fit")) {
      transform.fit = searchParams.get("fit");
    }
    if (searchParams.has("p")) {
      transform.position = decodeURI(searchParams.get("p"));
    }
    if (searchParams.has("bg")) {
      transform.background = searchParams.get("bg");
    }
    return transform;
  }
}

const imagePoolModulePromise = import('../image-pool.c24d15b2.mjs');
class SquooshService extends BaseSSRService {
  async processAvif(image, transform) {
    const encodeOptions = transform.quality ? { avif: { quality: transform.quality } } : { avif: {} };
    await image.encode(encodeOptions);
    const data = await image.encodedWith.avif;
    return {
      data: data.binary,
      format: "avif"
    };
  }
  async processJpeg(image, transform) {
    const encodeOptions = transform.quality ? { mozjpeg: { quality: transform.quality } } : { mozjpeg: {} };
    await image.encode(encodeOptions);
    const data = await image.encodedWith.mozjpeg;
    return {
      data: data.binary,
      format: "jpeg"
    };
  }
  async processPng(image, transform) {
    await image.encode({ oxipng: {} });
    const data = await image.encodedWith.oxipng;
    return {
      data: data.binary,
      format: "png"
    };
  }
  async processWebp(image, transform) {
    const encodeOptions = transform.quality ? { webp: { quality: transform.quality } } : { webp: {} };
    await image.encode(encodeOptions);
    const data = await image.encodedWith.webp;
    return {
      data: data.binary,
      format: "webp"
    };
  }
  async autorotate(transform, inputBuffer) {
    try {
      const meta = await metadata(transform.src, inputBuffer);
      switch (meta == null ? void 0 : meta.orientation) {
        case 3:
        case 4:
          return { type: "rotate", numRotations: 2 };
        case 5:
        case 6:
          return { type: "rotate", numRotations: 1 };
        case 7:
        case 8:
          return { type: "rotate", numRotations: 3 };
      }
    } catch {
    }
  }
  async transform(inputBuffer, transform) {
    if (transform.format === "svg") {
      return {
        data: inputBuffer,
        format: transform.format
      };
    }
    const operations = [];
    if (!isRemoteImage(transform.src)) {
      const autorotate = await this.autorotate(transform, inputBuffer);
      if (autorotate) {
        operations.push(autorotate);
      }
    } else if (transform.src.startsWith("//")) {
      transform.src = `https:${transform.src}`;
    }
    if (transform.width || transform.height) {
      const width = transform.width && Math.round(transform.width);
      const height = transform.height && Math.round(transform.height);
      operations.push({
        type: "resize",
        width,
        height
      });
    }
    if (!transform.format) {
      error({
        level: "info",
        prefix: false,
        message: red(`Unknown image output: "${transform.format}" used for ${transform.src}`)
      });
      throw new Error(`Unknown image output: "${transform.format}" used for ${transform.src}`);
    }
    const { processBuffer } = await imagePoolModulePromise;
    const data = await processBuffer(inputBuffer, operations, transform.format, transform.quality);
    return {
      data: Buffer.from(data),
      format: transform.format
    };
  }
}
const service = new SquooshService();
var squoosh_default = service;

const squoosh = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: squoosh_default
}, Symbol.toStringTag, { value: 'Module' }));

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

async function loadRemoteImage(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(err);
    return void 0;
  }
}
const get = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const transform = squoosh_default.parseTransform(url.searchParams);
    let inputBuffer = void 0;
    const sourceUrl = isRemoteImage(transform.src) ? new URL(transform.src) : new URL(transform.src, url.origin);
    inputBuffer = await loadRemoteImage(sourceUrl);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await squoosh_default.transform(inputBuffer, transform);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": mime.getType(format) || "",
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: new Date().toUTCString()
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}

new Set();

// we need to store the information for multiple documents because a Svelte application could also contain iframes
// https://github.com/sveltejs/svelte/issues/3624
new Map();

let current_component;
function set_current_component(component) {
    current_component = component;
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
new Set();
new Set();

const _boolean_attributes = [
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'inert',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
];
/**
 * List of HTML boolean attributes (e.g. `<input disabled>`).
 * Source: https://html.spec.whatwg.org/multipage/indices.html
 */
new Set([..._boolean_attributes]);
const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;
/**
 * Note: this method is performance sensitive and has been optimized
 * https://github.com/sveltejs/svelte/pull/5701
 */
function escape(value, is_attr = false) {
    const str = String(value);
    const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
    pattern.lastIndex = 0;
    let escaped = '';
    let last = 0;
    while (pattern.test(str)) {
        const i = pattern.lastIndex - 1;
        const ch = str[i];
        escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : (ch === '"' ? '&quot;' : '&lt;'));
        last = i + 1;
    }
    return escaped + str.substring(last);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(context || (parent_component ? parent_component.$$.context : [])),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, $$slots, context);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    const assignment = (boolean && value === true) ? '' : `="${escape(value, true)}"`;
    return ` ${name}${assignment}`;
}

/* node_modules/svelte-hamburgers/Hamburger.svelte generated by Svelte v3.57.0 */

const css = {
	code: ".hamburger.svelte-jas1sv.svelte-jas1sv{padding:var(--padding, 15px);display:inline-block;cursor:pointer;transition-property:opacity, filter;transition-duration:0.15s;transition-timing-function:linear;font:inherit;color:inherit;text-transform:none;background-color:transparent;border:0;margin:0;overflow:visible}.hamburger.svelte-jas1sv.svelte-jas1sv:active{background-color:transparent !important}.hamburger.svelte-jas1sv.svelte-jas1sv:hover{opacity:var(--hover-opacity, 0.7)}.hamburger.is-active.svelte-jas1sv.svelte-jas1sv:hover{opacity:var(--hover-opacity-active, var(--hover-opacity, 0.7))}.hamburger.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv,.hamburger.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{background-color:var(--active-color, var(--color, black))}.hamburger-box.svelte-jas1sv.svelte-jas1sv{width:var(--layer-width, 30px);height:calc(var(--layer-height, 4px) * 3 + var(--layer-spacing, 6px) * 2);display:inline-block;position:relative}.hamburger-inner.svelte-jas1sv.svelte-jas1sv{display:block;top:50%;margin-top:var(--layer-height, 4px)/-2}.hamburger-inner.svelte-jas1sv.svelte-jas1sv,.hamburger-inner.svelte-jas1sv.svelte-jas1sv::before,.hamburger-inner.svelte-jas1sv.svelte-jas1sv::after{width:var(--layer-width, 30px);height:var(--layer-height, 4px);background-color:var(--color, black);border-radius:var(--border-radius, 4px);position:absolute;transition-property:transform;transition-duration:0.15s;transition-timing-function:ease}.hamburger-inner.svelte-jas1sv.svelte-jas1sv::before,.hamburger-inner.svelte-jas1sv.svelte-jas1sv::after{content:\"\";display:block}.hamburger-inner.svelte-jas1sv.svelte-jas1sv::before{top:calc((var(--layer-spacing, 6px) + var(--layer-height, 4px)) * -1)}.hamburger-inner.svelte-jas1sv.svelte-jas1sv::after{bottom:calc((var(--layer-spacing, 6px) + var(--layer-height, 4px)) * -1)}.hamburger--3dx.svelte-jas1sv .hamburger-box.svelte-jas1sv{perspective:calc(var(--layer-width, 30px) * 2)}.hamburger--3dx.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dx.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--3dx.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dx.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{background-color:transparent !important;transform:rotateY(180deg)}.hamburger--3dx.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(0, calc(var(--layer-height, 4px) + var(--layer-spacing, 6px)), 0) rotate(45deg)}.hamburger--3dx.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc((var(--layer-height, 4px) + var(--layer-spacing, 6px)) * -1), 0) rotate(-45deg)}.hamburger--3dx-r.svelte-jas1sv .hamburger-box.svelte-jas1sv{perspective:calc(var(--layer-width, 30px) * 2)}.hamburger--3dx-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dx-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--3dx-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dx-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{background-color:transparent !important;transform:rotateY(-180deg)}.hamburger--3dx-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(0, calc(var(--layer-height, 4px) + var(--layer-spacing, 6px)), 0) rotate(45deg)}.hamburger--3dx-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc((var(--layer-height, 4px) + var(--layer-spacing, 6px)) * -1), 0) rotate(-45deg)}.hamburger--3dy.svelte-jas1sv .hamburger-box.svelte-jas1sv{perspective:calc(var(--layer-width, 30px) * 2)}.hamburger--3dy.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dy.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--3dy.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dy.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{background-color:transparent !important;transform:rotateX(-180deg)}.hamburger--3dy.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(0, calc(var(--layer-height, 4px) + var(--layer-spacing, 6px)), 0) rotate(45deg)}.hamburger--3dy.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc((var(--layer-height, 4px) + var(--layer-spacing, 6px)) * -1), 0) rotate(-45deg)}.hamburger--3dy-r.svelte-jas1sv .hamburger-box.svelte-jas1sv{perspective:calc(var(--layer-width, 30px) * 2)}.hamburger--3dy-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dy-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--3dy-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dy-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{background-color:transparent !important;transform:rotateX(180deg)}.hamburger--3dy-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(0, calc(var(--layer-height, 4px) + var(--layer-spacing, 6px)), 0) rotate(45deg)}.hamburger--3dy-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc((var(--layer-height, 4px) + var(--layer-spacing, 6px)) * -1), 0) rotate(-45deg)}.hamburger--3dxy.svelte-jas1sv .hamburger-box.svelte-jas1sv{perspective:calc(var(--layer-width, 30px) * 2)}.hamburger--3dxy.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dxy.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--3dxy.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dxy.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{background-color:transparent !important;transform:rotateX(180deg) rotateY(180deg)}.hamburger--3dxy.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(0, calc(var(--layer-height, 4px) + var(--layer-spacing, 6px)), 0) rotate(45deg)}.hamburger--3dxy.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc((var(--layer-height, 4px) + var(--layer-spacing, 6px)) * -1), 0) rotate(-45deg)}.hamburger--3dxy-r.svelte-jas1sv .hamburger-box.svelte-jas1sv{perspective:calc(var(--layer-width, 30px) * 2)}.hamburger--3dxy-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dxy-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--3dxy-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)}.hamburger--3dxy-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{background-color:transparent !important;transform:rotateX(180deg) rotateY(180deg) rotateZ(-180deg)}.hamburger--3dxy-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(0, calc(var(--layer-height, 4px) + var(--layer-spacing, 6px)), 0) rotate(45deg)}.hamburger--3dxy-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc((var(--layer-height, 4px) + var(--layer-spacing, 6px)) * -1), 0) rotate(-45deg)}.hamburger--arrow.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(calc(var(--layer-width, 30px) * -0.2), 0, 0) rotate(-45deg) scale(0.7, 1)}.hamburger--arrow.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(calc(var(--layer-width, 30px) * -0.2), 0, 0) rotate(45deg) scale(0.7, 1)}.hamburger--arrow-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(calc(var(--layer-width, 30px) * 0.2), 0, 0) rotate(45deg) scale(0.7, 1)}.hamburger--arrow-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(calc(var(--layer-width, 30px) * 0.2), 0, 0) rotate(-45deg) scale(0.7, 1)}.hamburger--arrowalt.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.1s 0.1s ease, transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1)}.hamburger--arrowalt.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:bottom 0.1s 0.1s ease, transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1)}.hamburger--arrowalt.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;transform:translate3d(calc(var(--layer-width, 30px) * -0.2), calc(var(--layer-width, 30px) * -0.25), 0) rotate(-45deg) scale(0.7, 1);transition:top 0.1s ease, transform 0.1s 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22)}.hamburger--arrowalt.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:translate3d(calc(var(--layer-width, 30px) * -0.2), calc(var(--layer-width, 30px) * 0.25), 0) rotate(45deg) scale(0.7, 1);transition:bottom 0.1s ease, transform 0.1s 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22)}.hamburger--arrowalt-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.1s 0.1s ease, transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1)}.hamburger--arrowalt-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:bottom 0.1s 0.1s ease, transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1)}.hamburger--arrowalt-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;transform:translate3d(calc(var(--layer-width, 30px) * 0.2), calc(var(--layer-width, 30px) * -0.25), 0) rotate(45deg) scale(0.7, 1);transition:top 0.1s ease, transform 0.1s 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22)}.hamburger--arrowalt-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:translate3d(calc(var(--layer-width, 30px) * 0.2), calc(var(--layer-width, 30px) * 0.25), 0) rotate(-45deg) scale(0.7, 1);transition:bottom 0.1s ease, transform 0.1s 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22)}.hamburger--arrowturn.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(-180deg)}.hamburger--arrowturn.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(8px, 0, 0) rotate(45deg) scale(0.7, 1)}.hamburger--arrowturn.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(8px, 0, 0) rotate(-45deg) scale(0.7, 1)}.hamburger--arrowturn-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(-180deg)}.hamburger--arrowturn-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:translate3d(-8px, 0, 0) rotate(-45deg) scale(0.7, 1)}.hamburger--arrowturn-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(-8px, 0, 0) rotate(45deg) scale(0.7, 1)}.hamburger--boring.svelte-jas1sv .hamburger-inner.svelte-jas1sv,.hamburger--boring.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--boring.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition-property:none}.hamburger--boring.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(45deg)}.hamburger--boring.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;opacity:0}.hamburger--boring.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:rotate(-90deg)}.hamburger--collapse.svelte-jas1sv .hamburger-inner.svelte-jas1sv{top:auto;bottom:0;transition-duration:0.13s;transition-delay:0.13s;transition-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--collapse.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc((var(--layer-spacing, 6px) * 2 + var(--layer-height, 4px) * 2) * -1);transition:top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), opacity 0.1s linear}.hamburger--collapse.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.12s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--collapse.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:translate3d(0, calc((var(--layer-spacing, 6px) + var(--layer-height, 4px)) * -1), 0) rotate(-45deg);transition-delay:0.22s;transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--collapse.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:0;opacity:0;transition:top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), opacity 0.1s 0.22s linear}.hamburger--collapse.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;transform:rotate(-90deg);transition:top 0.1s 0.16s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.25s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--collapse-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{top:auto;bottom:0;transition-duration:0.13s;transition-delay:0.13s;transition-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--collapse-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc((var(--layer-spacing, 6px) * 2 + var(--layer-height, 4px) * 2) * -1);transition:top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), opacity 0.1s linear}.hamburger--collapse-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.12s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--collapse-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:translate3d(0, calc((var(--layer-spacing, 6px) + var(--layer-height, 4px)) * -1), 0) rotate(45deg);transition-delay:0.22s;transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--collapse-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:0;opacity:0;transition:top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), opacity 0.1s 0.22s linear}.hamburger--collapse-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;transform:rotate(90deg);transition:top 0.1s 0.16s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.25s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--elastic.svelte-jas1sv .hamburger-inner.svelte-jas1sv{top:var(--layer-height, 4px)/2;transition-duration:0.275s;transition-timing-function:cubic-bezier(0.68, -0.55, 0.265, 1.55)}.hamburger--elastic.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:calc(var(--layer-height, 4px) + var(--layer-spacing, 6px));transition:opacity 0.125s 0.275s ease}.hamburger--elastic.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc(var(--layer-height, 4px) * 2 + var(--layer-spacing, 6px) * 2);transition:transform 0.275s cubic-bezier(0.68, -0.55, 0.265, 1.55)}.hamburger--elastic.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{--y-offset:calc(\n      var(--layer-spacing, 6px) + var(--layer-height, 4px)\n  );transform:translate3d(0, var(--y-offset), 0) rotate(135deg);transition-delay:0.075s}.hamburger--elastic.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition-delay:0s;opacity:0}.hamburger--elastic.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc(var(--y-offset) * -2), 0) rotate(-270deg);transition-delay:0.075s}.hamburger--elastic-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{top:var(--layer-height, 4px)/2;transition-duration:0.275s;transition-timing-function:cubic-bezier(0.68, -0.55, 0.265, 1.55)}.hamburger--elastic-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:calc(var(--layer-height, 4px) + var(--layer-spacing, 6px));transition:opacity 0.125s 0.275s ease}.hamburger--elastic-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc(var(--layer-height, 4px) * 2 + var(--layer-spacing, 6px) * 2);transition:transform 0.275s cubic-bezier(0.68, -0.55, 0.265, 1.55)}.hamburger--elastic-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{--y-offset:calc(\n      var(--layer-spacing, 6px) + var(--layer-height, 4px)\n  );transform:translate3d(0, var(--y-offset), 0) rotate(-135deg);transition-delay:0.075s}.hamburger--elastic-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition-delay:0s;opacity:0}.hamburger--elastic-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc(var(--y-offset) * -2), 0) rotate(270deg);transition-delay:0.075s}.hamburger--emphatic.svelte-jas1sv.svelte-jas1sv{overflow:hidden}.hamburger--emphatic.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:background-color 0.125s 0.175s ease-in}.hamburger--emphatic.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{left:0;transition:transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335), top 0.05s 0.125s linear, left 0.125s 0.175s ease-in}.hamburger--emphatic.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc((var(--layer-height, 4px)) + (var(--layer-spacing, 6px)));right:0;transition:transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335), top 0.05s 0.125s linear, right 0.125s 0.175s ease-in}.hamburger--emphatic.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition-delay:0s;transition-timing-function:ease-out;background-color:transparent !important}.hamburger--emphatic.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{left:calc(var(--layer-width, 30px) * -2);top:calc(var(--layer-width, 30px) * -2);transform:translate3d(calc(var(--layer-width, 30px) * 2), calc(var(--layer-width, 30px) * 2), 0) rotate(45deg);transition:left 0.125s ease-out, top 0.05s 0.125s linear, transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1)}.hamburger--emphatic.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{right:calc(var(--layer-width, 30px) * -2);top:calc(var(--layer-width, 30px) * -2);transform:translate3d(calc(var(--layer-width, 30px) * -2), calc(var(--layer-width, 30px) * 2), 0) rotate(-45deg);transition:right 0.125s ease-out, top 0.05s 0.125s linear, transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1)}.hamburger--emphatic-r.svelte-jas1sv.svelte-jas1sv{overflow:hidden}.hamburger--emphatic-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:background-color 0.125s 0.175s ease-in}.hamburger--emphatic-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{left:0;transition:transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335), top 0.05s 0.125s linear, left 0.125s 0.175s ease-in}.hamburger--emphatic-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc((var(--layer-height, 4px)) + (var(--layer-spacing, 6px)));right:0;transition:transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335), top 0.05s 0.125s linear, right 0.125s 0.175s ease-in}.hamburger--emphatic-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition-delay:0s;transition-timing-function:ease-out;background-color:transparent !important}.hamburger--emphatic-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{left:calc(var(--layer-width, 30px) * -2);top:calc(var(--layer-width, 30px) * 2);transform:translate3d(calc(var(--layer-width, 30px) * 2), calc(var(--layer-width, 30px) * -2), 0) rotate(-45deg);transition:left 0.125s ease-out, top 0.05s 0.125s linear, transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1)}.hamburger--emphatic-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{right:calc(var(--layer-width, 30px) * -2);top:calc(var(--layer-width, 30px) * 2);transform:translate3d(calc(var(--layer-width, 30px) * -2), calc(var(--layer-width, 30px) * -2), 0) rotate(45deg);transition:right 0.125s ease-out, top 0.05s 0.125s linear, transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1)}.hamburger--minus.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--minus.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:bottom 0.08s 0s ease-out, top 0.08s 0s ease-out, opacity 0s linear}.hamburger--minus.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--minus.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{opacity:0;transition:bottom 0.08s ease-out, top 0.08s ease-out, opacity 0s 0.08s linear}.hamburger--minus.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0}.hamburger--minus.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0}.hamburger--slider.svelte-jas1sv .hamburger-inner.svelte-jas1sv{top:calc(var(--layer-height, 4px) / 2)}.hamburger--slider.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:calc(var(--layer-height, 4px) + var(--layer-spacing, 6px));transition-property:transform, opacity;transition-timing-function:ease;transition-duration:0.15s}.hamburger--slider.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc(var(--layer-height, 4px) * 2 + var(--layer-spacing, 6px) * 2)}.hamburger--slider.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{--y-offset:calc(\n      var(--layer-spacing, 6px) + var(--layer-height, 4px)\n  );transform:translate3d(0, var(--y-offset), 0) rotate(45deg)}.hamburger--slider.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:rotate(-45deg) translate3d(clac(var(--layer-width, 30px)/-7), calc(var(--layer-spacing, 6px) * -1), 0);opacity:0}.hamburger--slider.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc(var(--y-offset) * -2), 0) rotate(-90deg)}.hamburger--slider-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{top:calc(var(--layer-height, 4px) / 2)}.hamburger--slider-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:calc(var(--layer-height, 4px) + var(--layer-spacing, 6px));transition-property:transform, opacity;transition-timing-function:ease;transition-duration:0.15s}.hamburger--slider-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc(var(--layer-height, 4px) * 2 + var(--layer-spacing, 6px) * 2)}.hamburger--slider-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{--y-offset:calc(\n      var(--layer-spacing, 6px) + var(--layer-height, 4px)\n  );transform:translate3d(0, var(--y-offset), 0) rotate(-45deg)}.hamburger--slider-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transform:rotate(45deg) translate3d(calc(var(--layer-width, 30px) / 7), calc(var(--layer-spacing, 6px) * -1), 0);opacity:0}.hamburger--slider-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transform:translate3d(0, calc(var(--y-offset) * -2), 0) rotate(90deg)}.hamburger--spin.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition-duration:0.22s;transition-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--spin.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.1s 0.25s ease-in, opacity 0.1s ease-in}.hamburger--spin.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:bottom 0.1s 0.25s ease-in, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--spin.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(225deg);transition-delay:0.12s;transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--spin.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;opacity:0;transition:top 0.1s ease-out, opacity 0.1s 0.12s ease-out}.hamburger--spin.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:rotate(-90deg);transition:bottom 0.1s ease-out, transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--spin-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition-duration:0.22s;transition-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--spin-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.1s 0.25s ease-in, opacity 0.1s ease-in}.hamburger--spin-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:bottom 0.1s 0.25s ease-in, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--spin-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(-225deg);transition-delay:0.12s;transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--spin-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;opacity:0;transition:top 0.1s ease-out, opacity 0.1s 0.12s ease-out}.hamburger--spin-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:rotate(90deg);transition:bottom 0.1s ease-out, transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--spring.svelte-jas1sv .hamburger-inner.svelte-jas1sv{top:var(--layer-height, 4px)/2;transition:background-color 0s 0.13s linear}.hamburger--spring.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:calc(var(--layer-height, 4px) + var(--layer-spacing, 6px));transition:top 0.1s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--spring.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc(var(--layer-height, 4px) * 2 + var(--layer-spacing, 6px) * 2);transition:top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--spring.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition-delay:0.22s;background-color:transparent !important}.hamburger--spring.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;transition:top 0.1s 0.15s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1);transform:translate3d(0, calc(var(--layer-spacing, 6px) + var(--layer-height, 4px)), 0) rotate(45deg)}.hamburger--spring.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:0;transition:top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1);transform:translate3d(0, calc(var(--layer-spacing, 6px) + var(--layer-height, 4px)), 0) rotate(-45deg)}.hamburger--spring-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{top:auto;bottom:0;transition-duration:0.13s;transition-delay:0s;transition-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--spring-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:calc((var(--layer-spacing, 6px) * 2 + var(--layer-height, 4px) * 2) * -1);transition:top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), opacity 0s linear}.hamburger--spring-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.1s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--spring-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:translate3d(0, calc((var(--layer-spacing, 6px) + var(--layer-height, 4px)) * -1), 0) rotate(-45deg);transition-delay:0.22s;transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--spring-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{top:0;opacity:0;transition:top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), opacity 0s 0.22s linear}.hamburger--spring-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;transform:rotate(90deg);transition:top 0.1s 0.15s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--stand.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:transform 0.075s 0.15s cubic-bezier(0.55, 0.055, 0.675, 0.19), background-color 0s 0.075s linear}.hamburger--stand.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.075s 0.075s ease-in, transform 0.075s 0s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--stand.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:bottom 0.075s 0.075s ease-in, transform 0.075s 0s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--stand.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(90deg);background-color:transparent !important;transition:transform 0.075s 0s cubic-bezier(0.215, 0.61, 0.355, 1), background-color 0s 0.15s linear}.hamburger--stand.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;transform:rotate(-45deg);transition:top 0.075s 0.1s ease-out, transform 0.075s 0.15s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--stand.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:rotate(45deg);transition:bottom 0.075s 0.1s ease-out, transform 0.075s 0.15s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--stand-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition:transform 0.075s 0.15s cubic-bezier(0.55, 0.055, 0.675, 0.19), background-color 0s 0.075s linear}.hamburger--stand-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.075s 0.075s ease-in, transform 0.075s 0s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--stand-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:bottom 0.075s 0.075s ease-in, transform 0.075s 0s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--stand-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(-90deg);background-color:transparent !important;transition:transform 0.075s 0s cubic-bezier(0.215, 0.61, 0.355, 1), background-color 0s 0.15s linear}.hamburger--stand-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;transform:rotate(-45deg);transition:top 0.075s 0.1s ease-out, transform 0.075s 0.15s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--stand-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:rotate(45deg);transition:bottom 0.075s 0.1s ease-out, transform 0.075s 0.15s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--squeeze.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition-duration:0.075s;transition-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--squeeze.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition:top 0.075s 0.12s ease, opacity 0.075s ease}.hamburger--squeeze.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition:bottom 0.075s 0.12s ease, transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger--squeeze.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(45deg);transition-delay:0.12s;transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--squeeze.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;opacity:0;transition:top 0.075s ease, opacity 0.075s 0.12s ease}.hamburger--squeeze.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:rotate(-90deg);transition:bottom 0.075s ease, transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger--vortex.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition-duration:0.2s;transition-timing-function:cubic-bezier(0.19, 1, 0.22, 1)}.hamburger--vortex.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--vortex.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition-duration:0s;transition-delay:0.1s;transition-timing-function:linear}.hamburger--vortex.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition-property:top, opacity}.hamburger--vortex.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition-property:bottom, transform}.hamburger--vortex.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(765deg);transition-timing-function:cubic-bezier(0.19, 1, 0.22, 1)}.hamburger--vortex.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--vortex.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition-delay:0s}.hamburger--vortex.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;opacity:0}.hamburger--vortex.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:rotate(90deg)}.hamburger--vortex-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transition-duration:0.2s;transition-timing-function:cubic-bezier(0.19, 1, 0.22, 1)}.hamburger--vortex-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--vortex-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition-duration:0s;transition-delay:0.1s;transition-timing-function:linear}.hamburger--vortex-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{transition-property:top, opacity}.hamburger--vortex-r.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition-property:bottom, transform}.hamburger--vortex-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv{transform:rotate(-765deg);transition-timing-function:cubic-bezier(0.19, 1, 0.22, 1)}.hamburger--vortex-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before,.hamburger--vortex-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{transition-delay:0s}.hamburger--vortex-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::before{top:0;opacity:0}.hamburger--vortex-r.is-active.svelte-jas1sv .hamburger-inner.svelte-jas1sv::after{bottom:0;transform:rotate(-90deg)}",
	map: null
};

const Hamburger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { open = false } = $$props;
	let { type = 'spin' } = $$props;
	if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
	if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
	$$result.css.add(css);

	return `


<button class="${[
		"hamburger hamburger--" + escape(type, true) + " svelte-jas1sv",
		open ? "is-active" : ""
	].join(' ').trim()}" aria-label="Hamburger menu"><span class="hamburger-box svelte-jas1sv"><span class="hamburger-inner svelte-jas1sv"></span></span>
</button>`;
});

/* src/components/navbar/Navbar.svelte generated by Svelte v3.57.0 */

const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let open = false;

	const links = [
		{ text: "Home", url: "/" },
		{ text: "Projects", url: "/projects" },
		{ text: "Music", url: "/music" },
		{ text: "Photography", url: "/photography" },
		{ text: "Blog", url: "/blog" },
		{ text: "Contact", url: "/contact" },
		{ text: "About", url: "/about" }
	];

	let $$settled;
	let $$rendered;

	do {
		$$settled = true;

		$$rendered = `
<div class="hidden w-full md:flex lg:flex flex-row absolute"><h1 class="mr-auto p-4 text-4xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Joshua La
  </h1>
  <a href="/" class="p-6 text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">Home</a>
  <div class="p-6 text-xl w-40 transition duration-300 ease-out transform-gpu hover:scale-105">Portfolio
    ${``}</div>
  <a href="/blog" class="p-6 text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">Blog</a>
  <a href="/contact" class="p-6 text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">Contact</a>
  <a href="/about" class="p-6 text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">About</a></div>


<div class="lg:hidden md:hidden absolute"><div style="display: contents; --color:white;">${validate_component(Hamburger, "Hamburger").$$render(
			$$result,
			{ open },
			{
				open: $$value => {
					open = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>

${open
		? `<div class="text-center text-lg leading-8 lg:hidden md:hidden"><div class="group">${each(links, (link, i) => {
				return `<a${add_attribute("href", link.url, 0)} class="cursor-pointer inline-block px-4 py-2 mx-2 my-4 font-medium text-white transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">${escape(link.text)}
        </a>`;
			})}</div></div>

  <hr class="w-1/2 mx-auto my-8 border border-white lg:hidden md:hidden">`
		: ``}`;
	} while (!$$settled);

	return $$rendered;
});

const $$Astro$b = createAstro("https://joshuala.com");
const $$MainLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en">
  <head>
    <link rel="sitemap" href="/sitemap-index.xml">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  ${renderHead($$result)}</head>
  <body class="bg-[#130956] text-[#b8abab]">
    ${renderComponent($$result, "Navbar", Navbar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/joshuala/Projects/portfolio/src/components/navbar/Navbar.svelte", "client:component-export": "default" })}
    <div class="p-40">${renderSlot($$result, $$slots["default"])}</div>
  </body></html>`;
}, "/Users/joshuala/Projects/portfolio/src/layouts/MainLayout.astro");

const $$Astro$a = createAstro("https://joshuala.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Home" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<div class="flex flex-row w-full p-10 sm:p-5">
    <div class="flex flex-col justify-center w-1/2 ml-0 mt-10">
      <h1 class="lg:text-6xl text-3xl p-10">Welcome to <br>JoshuaLa.com</h1>
      <h2 class="p-10 lg:text-2xl">
        A portfolio built with <a href="https://astro.build" class="hover:underline hover:text-blue-600">Astro</a> and <a href="https://svelte.dev" class="hover:underline hover:text-blue-600">Svelte</a>
      </h2>
    </div>
    <div class="justify-center w-1/2">
      <img src="IMG_3959.jpg" alt="Astro and Svelte logo"${addAttribute(500, "width")}${addAttribute(500, "height")} class=" rounded-xl">
    </div>
  </div>
` })}`;
}, "/Users/joshuala/Projects/portfolio/src/pages/index.astro");

const $$file$7 = "/Users/joshuala/Projects/portfolio/src/pages/index.astro";
const $$url$7 = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$7,
  url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

/* src/components/PhotoSlide.svelte generated by Svelte v3.57.0 */

const PhotoSlide = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let track;
	let popup;

	return `

<div class="absolute left-10 top-1/2 rounded-2xl drop-shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 text-2xl p-1"${add_attribute("this", popup, 0)}><p>Click and drag screen to view gallery images</p></div>
<div class="flex gap-[4vmin] absolute left-1/2 top-1/4 select-none transform -translate-x-0 -translate-y--1/2" id="image-track" data-mouse-down-at="0" data-prev-percentage="0"${add_attribute("this", track, 0)}><img class="w-[40vmin] h-[56vmin] object-cover object-[100%]" src="/IMG_4435.JPG" draggable="false" alt="a">
    <img class="w-[40vmin] h-[56vmin] object-cover object-[100%]" src="/IMG_5764.jpg" draggable="false" alt="a">
    </div>`;
});

const $$Astro$9 = createAstro("https://joshuala.com");
const $$Photography = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Photography;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Photography" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "PhotoSlide", PhotoSlide, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/joshuala/Projects/portfolio/src/components/PhotoSlide.svelte", "client:component-export": "default" })}` })}`;
}, "/Users/joshuala/Projects/portfolio/src/pages/photography.astro");

const $$file$6 = "/Users/joshuala/Projects/portfolio/src/pages/photography.astro";
const $$url$6 = "/photography";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Photography,
  file: $$file$6,
  url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$8 = createAstro("https://joshuala.com");
const $$InProgress = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$InProgress;
  return renderTemplate`${maybeRenderHead($$result)}<h1 class="absolute top-1/2 left-1/2 text-8xl text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Work in Progress</h1>`;
}, "/Users/joshuala/Projects/portfolio/src/components/InProgress.astro");

const $$Astro$7 = createAstro("https://joshuala.com");
const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Projects;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Projects" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "InProgress", $$InProgress, {})}` })}`;
}, "/Users/joshuala/Projects/portfolio/src/pages/projects.astro");

const $$file$5 = "/Users/joshuala/Projects/portfolio/src/pages/projects.astro";
const $$url$5 = "/projects";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Projects,
  file: $$file$5,
  url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$6 = createAstro("https://joshuala.com");
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Contact;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Contact" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<div class="isolate px-6 py-24 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Contact Me!</h2>
    </div>
    <form action="https://api.web3forms.com/submit" method="POST" class="mx-auto mt-16 max-w-xl sm:mt-20">
      <input type="hidden" name="access_key" value="502556c7-9f9e-4d9c-a372-2b2aea3b38eb
        ">

      <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label for="name" class="block text-sm font-semibold leading-6">Name</label>
          <div class="mt-2.5">
            <input type="text" name="name" id="name" autocomplete="given-name" class="block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="email" class="block text-sm font-semibold leading-6">Email</label>
          <div class="mt-2.5">
            <input type="email" name="email" id="email" autocomplete="email" class="block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="message" class="block text-sm font-semibold leading-6">Message</label>
          <div class="mt-2.5">
            <textarea name="message" id="message" rows="4" class="block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
          </div>
        </div>
      </div>
      <div class="mt-10">
        <button type="submit" class="block w-full rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Let's talk</button>
      </div>
      <input type="hidden" name="redirect" value="https://joshuala.com/">
    </form>
  </div>
` })}`;
}, "/Users/joshuala/Projects/portfolio/src/pages/contact.astro");

const $$file$4 = "/Users/joshuala/Projects/portfolio/src/pages/contact.astro";
const $$url$4 = "/contact";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$5 = createAstro("https://joshuala.com");
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$About;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "About" })}`;
}, "/Users/joshuala/Projects/portfolio/src/pages/about.astro");

const $$file$3 = "/Users/joshuala/Projects/portfolio/src/pages/about.astro";
const $$url$3 = "/about";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$4 = createAstro("https://joshuala.com");
const $$Music = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Music;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Music" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "InProgress", $$InProgress, {})}` })}`;
}, "/Users/joshuala/Projects/portfolio/src/pages/music.astro");

const $$file$2 = "/Users/joshuala/Projects/portfolio/src/pages/music.astro";
const $$url$2 = "/music";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Music,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

// astro-head-inject

const contentDir = '/src/content/';

const entryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/first-post.md": () => import('../first-post.46364b77.mjs')

});
const collectionToEntryMap = createCollectionToGlobResultMap({
	globResult: entryGlob,
	contentDir,
});

let lookupMap = {};
lookupMap = {"blog":{"first-post":"/src/content/blog/first-post.md"}};

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/first-post.md": () => import('../first-post.1be5b192.mjs')

});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const getCollection = createGetCollection({
	collectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
});

const getEntryBySlug = createGetEntryBySlug({
	getEntryImport: createGlobLookup(collectionToEntryMap),
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
});

const $$Astro$3 = createAstro("https://joshuala.com");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (slug === void 0) {
    throw new Error("Slug is required");
  }
  const entry = await getEntryBySlug("blog", slug);
  if (entry === void 0) {
    return Astro2.redirect("/404");
  }
  const { Content } = await entry.render();
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": entry.data.title }, { "default": ($$result2) => renderTemplate`
    ${maybeRenderHead($$result2)}<div class="mx-auto max-w-[735px] mt-14">
      <span class="text-blue-400 uppercase tracking-wider text-sm font-medium">
        ${entry.data.category}
      </span>
      <h1 class="text-4xl lg:text-5xl font-bold lg:tracking-tight mt-1 lg:leading-tight">
        ${entry.data.title}
      </h1>
      <div class="flex gap-2 mt-3 items-center flex-wrap md:flex-nowrap">
        <span class="text-gray-400">
          ${entry.data.author}
        </span>
        <span class="text-gray-400">•</span>
        <time class="text-gray-400"${addAttribute(entry.data.publishDate.toISOString(), "datetime")}>
          ${entry.data.publishDate.toDateString()}
        </time>
        <span class="text-gray-400 hidden md:block">•</span>
        <div class="w-full md:w-auto flex flex-wrap gap-3">
          ${entry.data.tags.map((tag) => renderTemplate`<span class="text-sm text-gray-500">#${tag}</span>`)}
        </div>
      </div>
    </div>

    <div class="mx-auto prose prose-lg mt-6 w-1/2">
      ${renderComponent($$result2, "Content", Content, {})}
    </div>
    <div class="text-center mt-8">
      <a href="/blog" class="bg-gray-100 px-5 py-3 rounded-md hover:bg-gray-200 transition">← Back to Blog</a>
    </div>
` })}`;
}, "/Users/joshuala/Projects/portfolio/src/pages/blog/[slug].astro");

const $$file$1 = "/Users/joshuala/Projects/portfolio/src/pages/blog/[slug].astro";
const $$url$1 = "/blog/[slug]";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

function resolveSize(transform) {
  if (transform.width && transform.height) {
    return transform;
  }
  if (!transform.width && !transform.height) {
    throw new Error(`"width" and "height" cannot both be undefined`);
  }
  if (!transform.aspectRatio) {
    throw new Error(
      `"aspectRatio" must be included if only "${transform.width ? "width" : "height"}" is provided`
    );
  }
  let aspectRatio;
  if (typeof transform.aspectRatio === "number") {
    aspectRatio = transform.aspectRatio;
  } else {
    const [width, height] = transform.aspectRatio.split(":");
    aspectRatio = Number.parseInt(width) / Number.parseInt(height);
  }
  if (transform.width) {
    return {
      ...transform,
      width: transform.width,
      height: Math.round(transform.width / aspectRatio)
    };
  } else if (transform.height) {
    return {
      ...transform,
      width: Math.round(transform.height * aspectRatio),
      height: transform.height
    };
  }
  return transform;
}
async function resolveTransform(input) {
  if (typeof input.src === "string") {
    return resolveSize(input);
  }
  const metadata = "then" in input.src ? (await input.src).default : input.src;
  let { width, height, aspectRatio, background, format = metadata.format, ...rest } = input;
  if (!width && !height) {
    width = metadata.width;
    height = metadata.height;
  } else if (width) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    height = height || Math.round(width / ratio);
  } else if (height) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    width = width || Math.round(height * ratio);
  }
  return {
    ...rest,
    src: metadata.src,
    width,
    height,
    aspectRatio,
    format,
    background
  };
}
async function getImage(transform) {
  var _a, _b, _c;
  if (!transform.src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  let loader = (_a = globalThis.astroImage) == null ? void 0 : _a.loader;
  if (!loader) {
    const { default: mod } = await Promise.resolve().then(() => squoosh).catch(() => {
      throw new Error(
        "[@astrojs/image] Builtin image loader not found. (Did you remember to add the integration to your Astro config?)"
      );
    });
    loader = mod;
    globalThis.astroImage = globalThis.astroImage || {};
    globalThis.astroImage.loader = loader;
  }
  const resolved = await resolveTransform(transform);
  const attributes = await loader.getImageAttributes(resolved);
  const isDev = (_b = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":"https://joshuala.com","ASSETS_PREFIX":undefined},{_:process.env._,SSR:true,}))) == null ? void 0 : _b.DEV;
  const isLocalImage = !isRemoteImage(resolved.src);
  const _loader = isDev && isLocalImage ? globalThis.astroImage.defaultLoader : loader;
  if (!_loader) {
    throw new Error("@astrojs/image: loader not found!");
  }
  const { searchParams } = isSSRService(_loader) ? _loader.serializeTransform(resolved) : globalThis.astroImage.defaultLoader.serializeTransform(resolved);
  const imgSrc = !isLocalImage && resolved.src.startsWith("//") ? `https:${resolved.src}` : resolved.src;
  let src;
  if (/^[\/\\]?@astroimage/.test(imgSrc)) {
    src = `${imgSrc}?${searchParams.toString()}`;
  } else {
    searchParams.set("href", imgSrc);
    src = `/_image?${searchParams.toString()}`;
  }
  if ((_c = globalThis.astroImage) == null ? void 0 : _c.addStaticImage) {
    src = globalThis.astroImage.addStaticImage(resolved);
  }
  return {
    ...attributes,
    src
  };
}

async function resolveAspectRatio({ src, aspectRatio }) {
  if (typeof src === "string") {
    return parseAspectRatio(aspectRatio);
  } else {
    const metadata = "then" in src ? (await src).default : src;
    return parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
  }
}
async function resolveFormats({ src, formats }) {
  const unique = new Set(formats);
  if (typeof src === "string") {
    unique.add(extname(src).replace(".", ""));
  } else {
    const metadata = "then" in src ? (await src).default : src;
    unique.add(extname(metadata.src).replace(".", ""));
  }
  return Array.from(unique).filter(Boolean);
}
async function getPicture(params) {
  const { src, alt, widths, fit, position, background } = params;
  if (!src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  if (!widths || !Array.isArray(widths)) {
    throw new Error("[@astrojs/image] at least one `width` is required. ex: `widths={[100]}`");
  }
  const aspectRatio = await resolveAspectRatio(params);
  if (!aspectRatio) {
    throw new Error("`aspectRatio` must be provided for remote images");
  }
  const allFormats = await resolveFormats(params);
  const lastFormat = allFormats[allFormats.length - 1];
  const maxWidth = Math.max(...widths);
  let image;
  async function getSource(format) {
    const imgs = await Promise.all(
      widths.map(async (width) => {
        const img = await getImage({
          src,
          alt,
          format,
          width,
          fit,
          position,
          background,
          aspectRatio
        });
        if (format === lastFormat && width === maxWidth) {
          image = img;
        }
        return `${img.src} ${width}w`;
      })
    );
    return {
      type: mime.getType(format) || format,
      srcset: imgs.join(",")
    };
  }
  const sources = await Promise.all(allFormats.map((format) => getSource(format)));
  return {
    sources,
    image
  };
}

const $$Astro$2 = createAstro("https://joshuala.com");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Image;
  const { loading = "lazy", decoding = "async", ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    warnForMissingAlt();
  }
  const attrs = await getImage(props);
  return renderTemplate`${maybeRenderHead($$result)}<img${spreadAttributes(attrs)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}>`;
}, "/Users/joshuala/Projects/portfolio/node_modules/@astrojs/image/components/Image.astro");

const $$Astro$1 = createAstro("https://joshuala.com");
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Picture;
  const {
    src,
    alt,
    sizes,
    widths,
    aspectRatio,
    fit,
    background,
    position,
    formats = ["avif", "webp"],
    loading = "lazy",
    decoding = "async",
    ...attrs
  } = Astro2.props;
  if (alt === void 0 || alt === null) {
    warnForMissingAlt();
  }
  const { image, sources } = await getPicture({
    src,
    widths,
    formats,
    aspectRatio,
    fit,
    background,
    position,
    alt
  });
  delete image.width;
  delete image.height;
  return renderTemplate`${maybeRenderHead($$result)}<picture>
	${sources.map((attrs2) => renderTemplate`<source${spreadAttributes(attrs2)}${addAttribute(sizes, "sizes")}>`)}
	<img${spreadAttributes(image)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}${spreadAttributes(attrs)}>
</picture>`;
}, "/Users/joshuala/Projects/portfolio/node_modules/@astrojs/image/components/Picture.astro");

let altWarningShown = false;
function warnForMissingAlt() {
  if (altWarningShown === true) {
    return;
  }
  altWarningShown = true;
  console.warn(`
[@astrojs/image] "alt" text was not provided for an <Image> or <Picture> component.

A future release of @astrojs/image may throw a build error when "alt" text is missing.

The "alt" attribute holds a text description of the image, which isn't mandatory but is incredibly useful for accessibility. Set to an empty string (alt="") if the image is not a key part of the content (it's decoration or a tracking pixel).
`);
}

const $$Astro = createAstro("https://joshuala.com");
const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Blog;
  const publishedBlogEntries = await getCollection("blog", ({ data }) => {
    return !data.draft && data.publishDate < /* @__PURE__ */ new Date();
  });
  publishedBlogEntries.sort((a, b) => {
    return b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
  });
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Blog" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<main class="mt-16">
    <ul class="grid gap-16 max-w-4xl mx-auto">
      ${publishedBlogEntries.map((blogPostEntry, index) => renderTemplate`<li>
            <a${addAttribute(`/blog/${blogPostEntry.slug}`, "href")}>
              <div class="grid md:grid-cols-2 gap-5 md:gap-10 items-center">
                ${renderComponent($$result2, "Picture", $$Picture, { "src": blogPostEntry.data.image.src, "alt": blogPostEntry.data.image.alt, "sizes": "(max-width: 800px) 100vw, 800px", "widths": [200, 400, 800], "aspectRatio": "16:9", "background": "#ffffff", "fit": "cover", "position": "center", "loading": index <= 2 ? "eager" : "lazy", "decoding": index <= 2 ? "sync" : "async", "class": "w-full rounded-md" })}
                <div>
                  <span class="text-blue-400 uppercase tracking-wider text-sm font-medium">
                    ${blogPostEntry.data.category}
                  </span>

                  <h2 class="text-3xl font-semibold leading-snug tracking-tight mt-1 ">
                    ${blogPostEntry.data.title}
                  </h2>

                  <div class="flex gap-2 mt-3">
                    <span class="text-gray-400">
                      ${blogPostEntry.data.author}
                    </span>
                    <span class="text-gray-400">• </span>
                    <time class="text-gray-400"${addAttribute(blogPostEntry.data.publishDate.toISOString(), "datetime")}>
                      ${blogPostEntry.data.publishDate.toDateString()}
                    </time>
                  </div>
                </div>
              </div>
            </a>
          </li>`)}
    </ul>
  </main>
` })}`;
}, "/Users/joshuala/Projects/portfolio/src/pages/blog.astro");

const $$file = "/Users/joshuala/Projects/portfolio/src/pages/blog.astro";
const $$url = "/blog";

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, _page2 as b, _page3 as c, _page4 as d, _page5 as e, _page6 as f, _page7 as g, _page8 as h };
