<script>
    import {slide} from 'svelte/transition'
    import CategorySelect from './CategorySelect.svelte'
    import items from './items'

    export let item

    let isEditing = false

    let description = ''
    let category = ''
    let quantity = 1

    function setEditing(editing) {
        isEditing = editing
        if (isEditing) {
            description = item.description
            category = item.category
            quantity = item.quantity
            window.addEventListener('click', handleExternalClick)
        } else {
            items.update({
                ...item,
                description,
                category,
                quantity,
            })
            window.removeEventListener('click', handleExternalClick)
        }
    }

    function toggleDone(item) {
        items.update({
            ...item,
            isDone: !item.isDone,
        })
    }

    function handleExternalClick(event) {
        const {clientX: x, clientY: y} = event
        const {top, bottom, left, right} = document.getElementById(`item-${item._id}`).parentElement.getBoundingClientRect()

        const outsideListItem = x < left || x > right || y < top || y > bottom

        if (outsideListItem) {
            setEditing(false)
        }
    }
</script>

<article id={`item-${item._id}`} class:is-done={item.isDone} class:is-editing={isEditing}>
    <span class="checkbox" on:click={() => toggleDone(item)}>
        ✓
    </span>

  {#if !isEditing}
      <span class="description" on:click={() => setEditing(true)}>
          { item.description }
      </span>

      <span class="quantity">
        { item.quantity }
      </span>
  {:else}
      <div class="description">
          <input type="text" class="input" bind:value={description}
                 on:keydown={e => e.key == 'Enter' && setEditing(false)} autofocus>
          <div in:slide={{duration: 200}}>
              <CategorySelect bind:category />
          </div>
      </div>

      <div class="quantity">
          <input type="number" class="input" bind:value={quantity}
                 on:keydown={e => e.key == 'Enter' && setEditing(false)}>
      </div>
  {/if}
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

    span.quantity {
        opacity: .8;
    }

    div.quantity {
        align-self: start;
        margin-top: -.5em;
    }

    div.quantity > input {
        text-align: right;
    }

    .is-done > span:first-child {
        opacity: 1;
    }

    .is-editing > span:first-child {
        align-self: start;
    }
</style>
