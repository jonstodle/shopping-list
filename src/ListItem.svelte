<script>
    import items from './items'

    export let item;

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

<article class:is-done={item.isDone}>
                    <span class="checkbox" on:click={() => toggleDone(item)}>
                        ✓
                    </span>

    <span class="description" on:click={() => setEditing(item, true)}>
                            { item.description }
                        </span>

    <span class="quantity">
                    { item.quantity }
                  </span>
</article>

<style>
    article {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
    }

    .checkbox {
        padding: 1.25rem;
        margin: -1.25rem;
        opacity: 0;
    }

    .description {
        flex: 1;
    }

    span.description {
        padding: 1.25rem;
        margin: -1.25rem;
    }

    div.description {
        margin-left: -.75em;
        margin-top: -.5em;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    div.description > div {
        display: flex;
        gap: .5rem;
    }

    .quantity {
        opacity: .8;
    }

    .is-done > span:first-child {
        opacity: 1;
    }
</style>
