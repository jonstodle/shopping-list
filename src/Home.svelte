<script>
    import {link} from 'svelte-routing'
    import {getLists} from './state'

    let lists = getLists()
    let newList = ''

    function addList() {
        if (!newList) {
            return
        }

        lists.add(newList)

        newList = ''
    }
</script>

<nav class="navbar has-background-primary">
    <div class="navbar-brand">
        <h1 class="navbar-item is-size-3 has-text-light">
            Shopping List
        </h1>
    </div>
</nav>

<div id="new-list" class="section">
    <input type="text" class="input is-large" bind:value={newList}
           on:keydown={(e) => e.key == 'Enter' && addList()}>
    <button class="button is-success is-large" on:click={() => addList()}>
        Add
    </button>
</div>
<div class="section">
    {#each $lists as list}
        <a class="box" href={`/${list.id}`} use:link>
            <div>
                <span>
                  {list.name}
                </span>
            </div>
        </a>
    {/each}
</div>

<style>
    #new-list {
        display: flex;
    }

    #new-list > input {
        flex: 1;
    }

    .box {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    input {
        border-radius: 4px 0 0 4px;
        border-right: 0;
    }

    button {
        border-radius: 0 4px 4px 0;
    }
</style>
