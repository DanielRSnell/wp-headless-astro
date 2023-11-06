<script>
  export let menu;
  export let args;
  const { title, logo, actions } = args;
  const { name, items } = menu;
</script>

<section id={name}>
  <header class="absolute top-0 flex w-full items-stretch justify-center z-50">
    <div class="flex flex-row justify-between w-full max-w-7xl py-4">
      <div
        class="relative flex gap-2 justify-center items-center text-lg text-black/40 uppercase"
      >
        <a
          href="/"
          class="flex w-full h-full no-underline flex-row gap-1 justify-center items-center"
        >
          <img src={logo.src} alt={title} />
          {title}
        </a>
      </div>
      <div class="flex flex-row gap-1">
        {#each items as item}
          <a
            href={item.url}
            class="flex items-center justify-center px-4 py-2 font-medium text-black/70 text-sm"
          >
            {item.title}
          </a>
        {/each}
      </div>
    </div>
  </header>
</section>
