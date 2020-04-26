<script>
    import {slide} from 'svelte/transition'
    import items from './items'

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
        quantity: 1,
        isDone: false,
        isEditing: false,
        category: '',
    }

    function addItem() {
        if (!newItem.description) {
            return
        }

        const [quantity, description] = newItem.description.split(' ', 2)
        const parsed = Number.parseFloat(quantity)
        if (parsed) {
            newItem.quantity = parsed
            newItem.description = description
        }

        items.add(newItem)
        newItem = {
            description: '',
            quantity: 1,
            isDone: false,
            isEditing: false,
            category: '',
        }
    }

    function toggleDone(item) {
        items.update({
            ...item,
            isDone: !item.isDone,
        })
    }

    function setEditing(item, isEditing) {
        items.update({
            ...item,
            isEditing,
        })
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
          {#each $items as item, index}
            {#if index == 0 && !item.isDone}
                <h2 class="title">{ $items.filter(i => !i.isDone).length } left</h2>
            {:else if (index == 0 && item.isDone) || item.isDone != $items[index - 1].isDone}
                <h2 class="title">Done</h2>
            {/if}

            {#if !item.isDone && (index == 0 || item.category != $items[index - 1].category)}
                <h2 class="subtitle">{ item.category || 'Uncategorised' }</h2>
            {/if}

              <article class="box item-list-item" class:is-done={item.isDone} transition:slide={{duration: 200}}>
                    <span class="checkbox" on:click={() => toggleDone(item)}>
                        ✓
                    </span>

                  <span class="item-list-item-description" on:click={() => setEditing(true)}>
                            { item.description }
                        </span>

                  <span class="item-list-item-quantity">
                    { item.quantity }
                  </span>
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

    div.item-list-item-description > div {
        display: flex;
        gap: .5rem;
    }

    .item-list-item-quantity {
        opacity: .8;
    }

    .is-done {
        opacity: .7;
    }

    .is-done > span:first-child {
        opacity: 1;
    }
</style>
