<script>
    import {slide} from 'svelte/transition'
    import DepartmentSelect from './DepartmentSelect.svelte'
    import {getList} from './state'

    export let listId
    export let item

    let list = getList(listId)
    let isEditing = false

    let description = ''
    let department = ''

    function setEditing(editing) {
        isEditing = editing
        if (isEditing) {
            description = [item.quantity, item.description].join(' ')
            department = item.department
            window.addEventListener('click', handleExternalClick)
        } else {
            list.updateItem(item, {
                description,
                department,
            })
            window.removeEventListener('click', handleExternalClick)
        }
    }

    function toggleDone() {
        list.updateItem(item, {isDone: !item.isDone})
    }

    function handleExternalClick(event) {
        const {clientX: x, clientY: y} = event
        const {top, bottom, left, right} = document.getElementById(`item-${item.id}`).parentElement.getBoundingClientRect()

        const outsideListItem = x < left || x > right || y < top || y > bottom

        if (outsideListItem) {
            setEditing(false)
        }
    }
</script>

<article id={`item-${item.id}`} class:is-done={item.isDone} class:is-editing={isEditing}>
    <span class="checkbox" on:click={toggleDone}>
        <img src={`/assets/checkmark-${item.isDone ? 'filled' : 'empty'}.svg`} alt="item is done indicator">
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
          <input type="text" class="input is-small" bind:value={description}
                 on:keydown={e => e.key == 'Enter' && setEditing(false)} autofocus>
          <div in:slide={{duration: 200}}>
              <DepartmentSelect {listId} bind:department on:select={() => document.querySelector('.description>input').focus()}/>
          </div>
      </div>
  {/if}
</article>

<style>
    article {
        display: flex;
        align-items: center;
        cursor: pointer;
        width: 100%;
    }

    .checkbox {
        padding: .5rem 1rem .5rem .5rem;
    }

    img {
        width: 24px;
        height: 24px;
    }

    .description {
        flex: 1;
        padding: .5rem 0;
    }

    div.description {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-right: .5rem;
    }

    .quantity {
        padding: .5rem;
    }

    span.quantity {
        justify-self: flex-end;
        opacity: .8;
    }

    .is-editing > span:first-child {
        align-self: start;
    }
</style>
