<script>
  import { Hamburger } from "svelte-hamburgers";
  import { fly, scale } from "svelte/transition";
  import { quadOut } from "svelte/easing";

  let open = false;

  const toggle = () => {
    open = !open;
    openBig = !openBig;
  };

  let openBig = false;

  const links = [
    { text: "Home", url: "/" },
    { text: "Projects", url: "/projects" },
    { text: "Music", url: "/music" },
    { text: "Photography", url: "/photography" },
    { text: "Blog", url: "/blog" },
    { text: "Contact", url: "/contact" },
    { text: "About", url: "/about" },
  ];
</script>

<!-- Normal navbar for large and medium screens -->
<div class="hidden w-full md:flex lg:flex flex-row absolute">
  <h1
    class="mr-auto p-4 text-4xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
  >
    Joshua La
  </h1>
  <a href="/" class="p-6 text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">Home</a>
  <div
    class="p-6 text-xl w-40 transition duration-300 ease-out transform-gpu hover:scale-105"
    on:mouseenter={toggle}
    on:mouseleave={toggle}
    on:touchend={toggle}
  >
    Portfolio
    {#if openBig}
      <div class="flex flex-col">
        <a href="/projects" class=" text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">Projects</a>
        <a href="/music" class=" text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">Music</a>
        <a href="/photography" class=" text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">Photography</a>
      </div>
    {/if}
  </div>
  <a href="/blog" class="p-6 text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">Blog</a>
  <a href="/contact" class="p-6 text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">Contact</a>
  <a href="/about" class="p-6 text-xl cursor-pointer transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline">About</a>
</div>

<!-- Mobile navbar for small screens -->
<div class="lg:hidden md:hidden absolute">
  <Hamburger bind:open --color="white" />
</div>

{#if open}
  <div class="text-center text-lg leading-8 lg:hidden md:hidden">
    <div class="group">
      {#each links as link, i}
        <a
          href={link.url}
          class="cursor-pointer inline-block px-4 py-2 mx-2 my-4 font-medium text-white transition duration-300 ease-out transform-gpu hover:scale-105 hover:underline"
        >
          {link.text}
        </a>
      {/each}
    </div>
  </div>

  <hr
    transition:scale={{ duration: 250, easing: quadOut, opacity: 1 }}
    class="w-1/2 mx-auto my-8 border border-white lg:hidden md:hidden"
  />
{/if}
