<script>
  // import Todo from "./Todo.svelte";
  import { flip } from "svelte/animate";
  export let loading = false;
  export let todos = [];
  let todo;
  // export let todo;
  const deleteIcon = "images/close-orange.svg";
  const verticalDots = "images/vertical-dots.svg";

  // reactive declarations (computed prop in other frameworks)
  $: noTodos = todos.length === 0;
  $: emptyTodos = todos.length === 0 && !loading;
  $: todosInOrder = [
    ...todos.filter(t => t.state === "TODO_PINNED"),
    ...todos.filter(t => t.state !== "TODO_PINNED")
  ];

  const handleRemove = async todo => {
    const res = await fetch(`http://localhost:8888/api/todos/${todo._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => console.log(res));
    let newTodos = await fetch("http://localhost:8888/api/todos");
    todos = await newTodos.json();
  };
</script>

<style>

</style>

{#if loading}
  <div class="h-32 flex justify-center items-center">
    <p>Loading...</p>
  </div>
{/if}
{#if emptyTodos}
  <div class="h-32 flex justify-center items-center">
    <p class="text-white opacity-75 font-sans font-normal text-xl">
      There are no todos. Create one!
    </p>
  </div>
{/if}
{#each todosInOrder as todo (todo._id)}
  <div
    class="w-full flex items-center bg-black mb-1 relative z-0"
    animate:flip={{ delay: 150, duration: 200 }}>
    <div class="flex-1">
      {#if todo.status === 'TODO_ARCHIVED'}
        <p class="font-sans font-normal text-md p-3 text-white z-10">
          {todo.text}
        </p>
      {:else}
        <p class="font-sans font-normal text-md p-3 text-white z-10">
          {todo.text}
        </p>
      {/if}
    </div>
    <div class="w-10 flex justify-center">
      <a href="/" on:click|preventDefault={handleRemove(todo)}>
        <img src={verticalDots} alt="Remove todo" class="h-6" />
      </a>
    </div>
  </div>
{/each}
