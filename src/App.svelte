<script>
    import {slide} from 'svelte/transition'
    import {flip} from 'svelte/animate'
    import items from './items'
    import NewItem from './NewItem.svelte'
    import ListItem from './ListItem.svelte'
    import CategoryEdit from './CategoryEdit.svelte'

    let showNewItem = !$items.length
    let showCategoryEdit = false

    $: groupedItems = $items
            .filter(item => !item.isDone)
            .reduce((agg, curr) => {
                agg[curr.category] = [
                    ...(agg[curr.category] || []),
                    curr,
                ]
                return agg
            }, {})
</script>

<main>
    <nav class="navbar has-background-primary">
        <div class="navbar-brand">
            <h1 class="navbar-item is-size-3 has-text-light">
                Shopping List
            </h1>
        </div>

        <div class="navbar-menu is-active">
            <div class="navbar-start"></div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <button class="button is-small" on:click={() => showCategoryEdit = true}>
                        Edit categories
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <section class="section">
        <div class="container">
            <div id="to-do">
                <h2 class="title">{ $items.filter(i => !i.isDone).length } left</h2>
                <button class="button is-primary" on:click={() => showNewItem = !showNewItem}>
                  {showNewItem ? 'Hide' : 'Add'}
                </button>
            </div>

          {#if showNewItem}
              <section id="new-item" transition:slide={{duration: 200}}>
                  <NewItem/>
              </section>
          {/if}

          {#each Object.keys(groupedItems) as category}
              <h2 class="subtitle" transition:slide={{duration: 200}}>
                { category || 'Uncategorised' }
              </h2>

            {#each groupedItems[category] as item (item._id)}
                <div class="box" transition:slide={{duration: 200}} animate:flip={{duration: 400}}>
                    <ListItem {item}/>
                </div>
            {/each}
          {/each}

            <div id="done">
                <h2 class="title">Done</h2>
              {#if $items.filter(item => item.isDone).length}
                  <button class="button is-danger is-small" on:click={() => items.removeDone()}>
                      Clear
                  </button>
              {/if}
            </div>
          {#each $items.filter(item => item.isDone) as item (item._id)}
              <div class="box" transition:slide={{duration: 200}} animate:flip={{duration: 400}}>
                  <ListItem {item}/>
              </div>
          {/each}
        </div>
    </section>
</main>

<CategoryEdit bind:show={showCategoryEdit}/>

<style>
    #new-item {
        margin-bottom: 3rem;
    }

    h2 {
        display: inline-block;
    }

    #to-do, #done {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
