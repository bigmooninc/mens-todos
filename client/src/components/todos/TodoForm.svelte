<script>
  import { onMount, createEventDispatcher } from "svelte";

  export let todos = [];
  let text;
  let todoInput;

  onMount(() => todoInput.focus());

  const dispatch = createEventDispatcher();

  const add = () => {
    dispatch("add", {
      text
    });
    text = "";
  };
</script>

<style>
  .input-todo {
    background: #1e1e1e;
  }
</style>

<div class="input-todo">
  <form class="mb-3" id="todo-input" on:submit|preventDefault={add}>
    <input
      bind:this={todoInput}
      bind:value={text}
      type="text"
      placeholder={todos.length > 0 ? 'Add another todo' : 'Add a todo'}
      class="w-full py-2 px-3 text-md font-sans font-normal bg-transparent
      border-transparent shadow-none outline-none text-white text-lg" />
  </form>
</div>
