<script>
    import {slide} from 'svelte/transition'
    import {flip} from 'svelte/animate'
    import {link} from 'svelte-routing'
    import NewItem from './NewItem.svelte'
    import ListItem from './ListItem.svelte'
    import DepartmentEdit from './DepartmentEdit.svelte'
    import {getList, showDepartmentEdit} from './state'

    export let listId
    export let location

    const list = getList(listId)

    let showNewItem = !$list.items.length

    $: groupedItems = $list.items
            .filter(item => !item.isDone)
            .sort((a, b) => a.description.localeCompare(b.description))
            .sort((a, b) => a.department.localeCompare(b.department))
            .reduce((agg, curr) => {
                agg[curr.department] = [
                    ...(agg[curr.department] || []),
                    curr,
                ]
                return agg
            }, {})

    $: doneItems = $list.items
      .filter(item => item.isDone)
      .sort((a, b) => a.description.localeCompare(b.description))
</script>

<nav class="navbar has-background-primary">
    <a href="/" class="navbar-brand" use:link>
        <h1 class="navbar-item is-size-3 has-text-light">
            Shopping List
        </h1>
    </a>
</nav>

<section class="section">
    <div class="container">
        <div id="to-do">
            <h2 class="title">{ $list.items.filter(i => !i.isDone).length } left</h2>
            <button class="button is-primary" on:click={() => showNewItem = !showNewItem}>
              {showNewItem ? 'Hide' : 'Add'}
            </button>
        </div>

      {#if showNewItem}
          <section id="new-item" transition:slide={{duration: 200}} {listId}>
              <NewItem {listId} />
          </section>
      {/if}

      {#each Object.keys(groupedItems) as category}
          <h2 class="subtitle" transition:slide={{duration: 200}}>
            { category || 'Uncategorised' }
          </h2>

        {#each groupedItems[category] as item (item.id)}
            <div class="box" transition:slide={{duration: 200}} animate:flip={{duration: 400}}>
                <ListItem {listId} {item}/>
            </div>
        {/each}
      {/each}

        <div id="done">
            <h2 class="title">Done</h2>
          {#if $list.items.filter(item => item.isDone).length}
              <button class="button is-danger is-small" on:click={() => list.removeDone()}>
                  Clear
              </button>
          {/if}
        </div>
      {#each doneItems as item (item.id)}
          <div class="box" transition:slide={{duration: 200}} animate:flip={{duration: 400}}>
              <ListItem {listId} {item}/>
          </div>
      {/each}
    </div>
</section>

<DepartmentEdit {listId}/>

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