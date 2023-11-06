<script>
  import { onMount } from "svelte";
  import Paginate from "./paginate.svelte";
  export let content;

  onMount(() => {
    // Scroll to top of page
    window.scrollTo(0, 0);
  });
</script>

<article class="prose prose-2xl">
  {@html content.rendered}
</article>
