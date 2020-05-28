<script>
  import { fade } from "svelte/transition";
  import { link } from "svelte-routing";
  import NewItem from "./NewItem.svelte";
  import ListItem from "./ListItem.svelte";
  import DepartmentEdit from "./DepartmentEdit.svelte";
  import { getList, showDepartmentEdit } from "./state";

  export let listId;
  export let location;

  const list = getList(listId);

  let showNewItem = !$list.items.length;

  $: groupedItems = $list.items
    .filter((item) => !item.isDone)
    .sort((a, b) => a.description.localeCompare(b.description))
    .sort((a, b) => a.department.localeCompare(b.department))
    .reduce((agg, curr) => {
      agg[curr.department] = [...(agg[curr.department] || []), curr];
      return agg;
    }, {});

  $: doneItems = $list.items
    .filter((item) => item.isDone)
    .sort((a, b) => a.description.localeCompare(b.description));
</script>

<style>
  @media screen and (max-width: 500px) {
    .section {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
  }

  #new-item {
    margin-bottom: 3rem;
  }

  h2 {
    display: inline-block;
  }

  #to-do,
  #done {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .panel-block {
    padding: 0;
  }
</style>

<nav class="navbar has-background-primary">
  <a href="/" class="navbar-brand" use:link>
    <h1 class="navbar-item is-size-3 has-text-light">Shopping List</h1>
  </a>
</nav>

<section class="section">
  <div class="container">
    <div id="to-do">
      <h2 class="title">{$list.items.filter((i) => !i.isDone).length} left</h2>
      <button
        class="button is-primary"
        on:click={() => (showNewItem = !showNewItem)}>
        {showNewItem ? 'Hide' : 'Add'}
      </button>
    </div>

    {#if showNewItem}
      <section id="new-item" {listId}>
        <NewItem {listId} />
      </section>
    {/if}

    {#each Object.keys(groupedItems) as category}
      <div class="panel" transition:fade={{ duration: 150 }}>
        <p class="panel-heading">{category || 'Uncategorised'}</p>

        {#each groupedItems[category] as item (item.id)}
          <div class="panel-block" transition:fade={{ duration: 150 }}>
            <ListItem {listId} {item} />
          </div>
        {/each}
      </div>
    {/each}

    <div id="done">
      <h2 class="title">Done</h2>
      {#if $list.items.filter((item) => item.isDone).length}
        <button
          class="button is-danger is-small"
          on:click={() => list.removeDone()}>
          Clear
        </button>
      {/if}
    </div>
    <div class="panel">
      {#each doneItems as item (item.id)}
        <div class="panel-block" transition:fade={{ duration: 150 }}>
          <ListItem {listId} {item} />
        </div>
      {/each}
    </div>
  </div>
</section>

<DepartmentEdit {listId} />
