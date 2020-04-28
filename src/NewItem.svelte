<script>
    import {createEventDispatcher} from 'svelte'
    import items from './items'
    import categories from './categories'

    const dispatch = createEventDispatcher()

    let description = ''
    let category = ''

    function addItem() {
        if (!description) {
            return
        }

        const newItem = {
            description,
            quantity: 1,
            isDone: false,
            category,
        }

        const [quantity, ...desc] = description.split(' ')
        console.log(desc)
        const parsed = Number.parseFloat(quantity)
        if (parsed) {
            newItem.quantity = parsed
            newItem.description = desc.join(' ')
        }
        console.table(newItem)

        items.add(newItem)

        description = ''
        category = ''

        dispatch("itemadd")
    }
</script>

<div id="new-item" class="container">
    <div>
        <label for="new-item-input">
            <input id="new-item-input" type="text" class="input is-large" on:keydown
                   bind:value={description}
                   on:keyup={(e) => e.key == 'Enter' && addItem()}>
        </label>
        <button class="button is-success is-large level-item" on:click={addItem}>Add</button>
    </div>

    <div>
        {#each $categories as cat}
            <span class="tag" class:is-primary={category == cat}
                  on:click={() => category = cat}>
                  {cat}
                </span>
        {/each}
    </div>
</div>

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
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
    }

    #new-item label {
        flex: 1;
    }

    #new-item .tag {
        cursor: pointer;
    }
</style>
