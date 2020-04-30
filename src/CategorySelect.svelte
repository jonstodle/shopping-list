<script>
    import categories from './categories'

    export let category = ''
</script>

<div>
  {#each $categories as cat}
      <span class="tag" class:is-primary={category == cat} on:click={() => category = cat == category ? '' : cat}>
        {cat}
      </span>
  {/each}
</div>

<style>
    div {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
    }

    .tag {
        cursor: pointer;
    }
</style>
