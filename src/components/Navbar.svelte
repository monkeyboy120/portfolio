<script>
  let open = false;
  const toggle = () => {
    open = !open;
  };
</script>

<div class="w-full flex flex-row absolute">
  <h1
    class="mr-auto p-4 text-4xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
  >
    Joshua La
  </h1>
  <a href="/" class="p-6 text-xl ">Home</a>
  <div class="p-6 text-xl w-40" on:mouseenter={toggle} on:mouseleave={toggle}>
    Portfolio 
    {#if open}
      <div class="flex flex-col">
        <a href="/projects">Projects</a>
        <a href="/music">Music</a>
        <a href="/photography">Photography</a>
      </div>
    {/if}
  </div>
  <a href="/blog" class="p-6 text-xl ">Blog</a>
  <a href="/contact" class="p-6 text-xl ">Contact</a>
  <a href="/about" class="p-6 text-xl ">About</a>
</div>
