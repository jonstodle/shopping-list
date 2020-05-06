<script>
    import DepartmentSelect from './DepartmentSelect.svelte'
    import {getList} from './state'

    export let listId

    const list = getList(listId)

    let description = ''
    let department = ''

    function addItem() {
        if (!description) {
            return
        }

        const newItem = {
            description,
            department,
        }

        const [quantity, ...desc] = description.split(' ')
        const parsed = Number.parseFloat(quantity)
        if (parsed) {
            newItem.quantity = parsed
            newItem.description = desc.join(' ')
        }

        list.addItem(newItem)

        description = ''
        department = ''
    }
</script>

<div class="container">
    <div>
        <label for="new-item-input">
            <input id="new-item-input" type="text" class="input is-large"
                   placeholder="3 Milk"
                   bind:value={description}
                   on:keyup={(e) => e.key == 'Enter' && addItem()}>
        </label>
        <button class="button is-success is-large level-item" on:click={addItem}>Add</button>
    </div>

    <DepartmentSelect {listId} bind:department />
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .container>div {
        display: flex;
    }

    label {
        flex: 1;
    }

    input {
        border-radius: 4px 0 0 4px;
        border-right: 0;
    }

    button {
        border-radius: 0 4px 4px 0;
    }
</style>
