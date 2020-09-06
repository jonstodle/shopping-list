<script>
  import { fade } from "svelte/transition";
  import { link } from "svelte-routing";
  import { getLists, getList } from "./state";

  let lists = getLists();
  let newList = "";
  let isEditing = true;

  function addList() {
    if (!newList) {
      return;
    }

    lists.add(newList);

    newList = "";
  }

  function setActive(listId, active) {
    getList(listId).setActive(active);
  }
</script>

<style>
  #new-list {
    display: flex;
  }

  #new-list > input {
    flex: 1;
    min-width: 10em;
  }

  .box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .checkbox {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 24px;
    height: 24px;
  }

  .list-name {
    transition: margin-left 150ms;
  }

  .list-name.isEditing {
    margin-left: 24px;
  }

  input {
    border-radius: 4px 0 0 4px;
    border-right: 0;
  }

  button {
    border-radius: 0 4px 4px 0;
  }
</style>

<nav class="navbar has-background-primary">
  <div class="navbar-brand">
    <h1 class="navbar-item is-size-3 has-text-light">Shopping List</h1>
  </div>

  <div class="navbar-menu is-active">
    <div class="navbar-start" />
    <div class="navbar-end">
      <div class="navbar-item">
        <button
          class="button is-small"
          on:click={() => (isEditing = !isEditing)}>
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>
    </div>
  </div>
</nav>

<div id="new-list" class="section">
  <input
    type="text"
    class="input is-large"
    bind:value={newList}
    on:keydown={(e) => e.key == 'Enter' && addList()} />
  <button class="button is-success is-large" on:click={() => addList()}>
    Add
  </button>
</div>
<div class="section">
  {#each $lists.filter((l) => isEditing || l.active) as list}
    <a class="box" href={`/${list.id}`} use:link>
      <div>
        {#if isEditing}
          <span
            class="checkbox"
            on:click|preventDefault|capture={(_) => setActive(list.id, !list.active)}
            transition:fade={{ duration: 100 }}>
            <img
              src={`/assets/checkmark-${list.active ? 'filled' : 'empty'}.svg`}
              alt="item is done indicator" />
          </span>
        {/if}
        <span class="list-name" class:isEditing>{list.name}</span>
      </div>
    </a>
  {/each}
</div>
