<script>
    import {slide} from 'svelte/transition'
    import {flip} from 'svelte/animate'
    import items from './items'
    import NewItem from './NewItem.svelte'
    import ListItem from './ListItem.svelte'

    let showNewItem = false

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
  {#if showNewItem}
      <section class="section" transition:slide={{duration: 200}}>
          <NewItem on:itemadd={() => showNewItem = false}/>
      </section>
  {/if}

    <section class="section">
        <div class="container">
            <div id="to-do">
                <h2 class="title">{ $items.filter(i => !i.isDone).length } left</h2>
                <button class="button is-primary" on:click={() => showNewItem = !showNewItem}>
                  {showNewItem ? 'Close' : 'Add'}
                </button>
            </div>
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

            <h2 class="title">Done</h2>
          {#each $items.filter(item => item.isDone) as item (item._id)}
              <div class="box" transition:slide={{duration: 200}} animate:flip={{duration: 400}}>
                  <ListItem {item}/>
              </div>
          {/each}
        </div>
    </section>
</main>

<style>
    #to-do {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    #to-do > h2 {
        display: inline-block;
    }

    .is-done {
        opacity: .7;
    }
</style>
