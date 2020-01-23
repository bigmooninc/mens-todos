<script>
  import { onMount } from "svelte";

  export let text = "";

  export let todos;

  let todoInput;

  onMount(() => todoInput.focus());

  async function handleSubmit() {
    text = text.trim();
    if (!text) return;

    const res = await fetch("http://localhost:8888/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text
      })
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));

    let newTodos = await fetch("http://localhost:8888/api/todos");

    todos = await newTodos.json();

    text = "";

    todoInput.focus();
  }
</script>

<style>
  .input-todo {
    background: #1e1e1e;
  }
</style>

<div class="input-todo">
  <form class="mb-3" id="todo-input" on:submit|preventDefault={handleSubmit}>
    <input
      bind:this={todoInput}
      bind:value={text}
      type="text"
      placeholder={todos.length > 0 ? 'Add another todo' : 'Add a todo'}
      class="w-full py-2 px-3 text-md font-sans font-normal bg-transparent
      border-transparent shadow-none outline-none text-white text-lg" />
  </form>
</div>
