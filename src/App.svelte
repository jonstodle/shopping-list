<script>
    import {slide} from 'svelte/transition'

    let items = []
    const categories = [
        'Dairy',
        'Baked goods',
        'Snacks',
        'Frozens',
        'Meats & Seafood',
        'Produce',
    ]

    let newItem = {
        description: '',
        isDone: false,
        isEditing: false,
        category: '',
    }

    $: {
        items = items
                .sort((a, b) => a.description.localeCompare(b.description))
                .sort((a, b) => a.category.localeCompare(b.category))
                .sort((a, b) => a.isDone == b.isDone ? 0 : a.isDone ? 1 : -1)
    }

    function addItem() {
        if (!newItem.description) {
            return
        }

        items = [
            ...items,
            newItem,
        ]
        newItem = {
            description: '',
            isDone: false,
            isEditing: false,
            category: '',
        }
    }
</script>

<main>
    <section class="section">
        <div id="new-item" class="container">
            <div>
                <label for="new-item-input">
                    <input id="new-item-input" type="text" class="input is-large" on:keydown
                           bind:value={newItem.description}
                           on:keyup={(e) => e.key == 'Enter' && addItem()}>
                </label>
                <button class="button is-success is-large level-item" on:click={addItem}>Add</button>
            </div>

            <div>
              {#each categories as category}
                  <span class="tag" class:is-primary={newItem.category == category}
                        on:click={() => newItem.category = category}>
                  {category}
                </span>
              {/each}
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
          {#each items as item, index}
            {#if index == 0 && !item.isDone}
                <h2 class="title">{ items.filter(i => !i.isDone).length } left</h2>
            {:else if (index == 0 && item.isDone) || item.isDone != items[index - 1].isDone}
                <h2 class="title">Done</h2>
            {/if}

            {#if !item.isDone && (index == 0 || item.category != items[index - 1].category)}
                <h2 class="subtitle">{ item.category || 'Uncategorised' }</h2>
            {/if}

              <article class="box item-list-item" class:is-done={item.isDone} transition:slide={{duration: 200}}>
                    <span class="checkbox" on:click={() => item.isDone = !item.isDone}>
                        ✓
                    </span>

                {#if !item.isEditing}
                    <span class="item-list-item-description" on:click={() => item.isEditing = true}>
                            { item.description }
                        </span>
                {:else}
                    <div class="item-list-item-description">
                        <input type="text" class="input" bind:value={item.description}
                               on:keydown={e => item.isEditing = e.key != 'Enter'} autofocus>
                        <div in:slide={{duration: 200}}>
                          {#each categories as category}
                              <span class="tag" class:is-primary={item.category == category}
                                    on:click={() => item.category = category}>
                        {category}
                      </span>
                          {/each}
                        </div>
                    </div>
                {/if}
              </article>
          {/each}
        </div>
    </section>
</main>

<style>
    #new-item {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    #new-item > div {
        display: flex;
    }

    #new-item > div:first-child {
        gap: 1rem;
    }

    #new-item > div:last-child {
        gap: .5rem;
    }

    #new-item label {
        flex: 1;
    }

    #new-item .tag {
        cursor: pointer;
    }

    .item-list-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
    }

    .item-list-item > span:first-child {
        padding: 1.25rem;
        margin: -1.25rem;
        opacity: 0;
    }

    .item-list-item-description {
        flex: 1;
    }

    span.item-list-item-description {
        padding: 1.25rem;
        margin: -1.25rem;
    }

    div.item-list-item-description {
        margin-left: -.75em;
        margin-top: -.5em;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    div.item-list-item-description>div {
        display: flex;
        gap: .5rem;
    }

    .is-done {
        opacity: .7;
    }

    .is-done > span:first-child {
        opacity: 1;
    }
</style>
