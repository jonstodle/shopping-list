<script>
    import {createEventDispatcher} from 'svelte'
    import items from './items'
    import categories from './categories'

    const dispatch = createEventDispatcher()

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

        dispatch("itemadd")
    }
</script>

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
        {#each $categories as category}
            <span class="tag" class:is-primary={newItem.category == category}
                  on:click={() => newItem.category = category}>
                  {category}
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
        gap: .5rem;
    }

    #new-item label {
        flex: 1;
    }

    #new-item .tag {
        cursor: pointer;
    }
</style>
