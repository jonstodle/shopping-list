<script>
    import {createEventDispatcher} from 'svelte'
    import {getList, showDepartmentEdit} from './state'

    export let listId
    export let department = ''

    const dispatch = createEventDispatcher()
    const list = getList(listId)

    $: departments = $list.departments
      .sort((a, b) => a.localeCompare(b))

    const select = (dep) => {
        department = dep == department ? '' : dep
        dispatch('select', dep)
    }
</script>

<div>
  {#each $list.departments as dep}
      <span class="tag" class:is-primary={department == dep} on:click={() => select(dep)}>
        {dep}
      </span>
  {/each}
    <span class="tag edit" on:click={() => showDepartmentEdit.show()}>
        Edit...
    </span>
</div>

<style>
    div {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
    }

    .tag {
        cursor: pointer;
    }

    .edit {
        border: solid darkslategrey 1px;
    }
</style>
