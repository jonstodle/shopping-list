<script>
    import {getList, showDepartmentEdit} from './state'

    export let listId
    export let department = ''

    const list = getList(listId)
</script>

<div>
  {#each $list.departments as dep}
      <span class="tag" class:is-primary={department == dep} on:click={() => department = dep == department ? '' : dep}>
        {dep}
      </span>
  {/each}
    <span class="tag" on:click={() => showDepartmentEdit.show()}>
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
</style>
