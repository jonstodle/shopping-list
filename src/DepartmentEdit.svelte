<script>
    import {getList, showDepartmentEdit} from './state'

    export let listId

    const list = getList(listId)

    let newCategory = ''

    function addCategory() {
        if (!newCategory) {
            return
        }

        list.addDepartment(newCategory)
        newCategory = ''
    }
</script>

<div class="modal" class:is-active={$showDepartmentEdit}>
    <div class="modal-background"></div>
    <div class="modal-content has-background-light">
        <h1 class="is-size-2">
            Edit departments
        </h1>

        <div>
            <input class="input" type="text" placeholder='"Snacks"' bind:value={newCategory}
                   on:keydown={(e) => e.key == 'Enter' && addCategory()}>
            <button class="button is-success" on:click={() => addCategory()}>
                Add
            </button>
        </div>

        <div>
          {#each $list.departments as dep}
              <div class="box">
              <span>
                {dep}
              </span>

                  <button class="button is-danger" on:click={() => list.removeDepartment(dep)}>
                      Delete
                  </button>
              </div>
          {/each}
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => showDepartmentEdit.hide()}></button>
</div>

<style>
    .modal-content {
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 40px);
        border-radius: 4px;
        padding: 1.5rem;
        overflow: hidden;
    }

    .modal-content > div:first-of-type {
        display: flex;
        margin-bottom: 3rem;
    }

    .modal-content > div:first-child input {
        border-radius: 4px 0 0 4px;
    }

    .modal-content > div:first-child button {
        border-radius: 0 4px 4px 0;
    }

    .modal-content > *:last-child {
        padding-bottom: 3rem;
        overflow-y: scroll;
    }

    .box {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
