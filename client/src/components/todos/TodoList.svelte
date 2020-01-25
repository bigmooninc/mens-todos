<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  export let loading = false;
  export let todos = [];
  export let todo;

  const pinTodoImage = "images/clip-red-400.svg";
  const completeTodoImage = "images/check-purple-500.svg";
  const deleteTodoImage = "images/trash-purple-500.svg";

  // reactive declarations (computed prop in other frameworks)
  $: noTodos = todos.length === 0;
  $: emptyTodos = todos.length === 0 && !loading;
  $: todosInOrder = [
    ...todos.filter(t => t.state === "TODO_PINNED"),
    ...todos.filter(t => t.state !== "TODO_PINNED")
  ];

  const dispatch = createEventDispatcher();

  const remove = todo => {
    dispatch("remove", {
      id: todo._id
    });
  };

  const complete = todo => {
    dispatch("complete", {
      id: todo._id,
      completed: true
    });
  };
</script>

{#if loading}
  <div class="h-32 flex justify-center items-center">
    <p>Loading...</p>
  </div>
{/if}
<!-- {#if emptyTodos}
  <div class="h-32 flex justify-center items-center">
    <p class="text-white opacity-75 font-sans font-normal text-xl">
      There are no todos. Create one!
    </p>
  </div>
{/if} -->
{#each todosInOrder as todo (todo._id)}
  <div
    class="relative w-full flex items-center bg-black mb-2 relative z-0 p-3"
    animate:flip={{ delay: 150, duration: 400 }}>
    <div class="relative flex-1">
      <p
        class="{todo.completed ? 'line-through opacity-50' : ''} font-sans
        font-normal text-lg text-white z-10">
        {todo.text}
      </p>
      {#if todo.details}
        <p class="font-sans font-normal text-sm opacity-50 italic text-white">
          {todo.details}
        </p>
      {/if}
    </div>
    <div class="relative w-20 flex justify-center items-center">
      <a
        href="/"
        on:click|preventDefault={complete(todo)}
        class="{todo.completed ? 'opacity-100' : 'opacity-25'} hover:opacity-100
        transition-500 will-change-opacity">
        <img src={completeTodoImage} alt="Pin todo" class="h-4 mx-2" />
      </a>
      <a
        href="/"
        class="opacity-25 hover:opacity-100 transition-500 will-change-opacity"
        on:click|preventDefault={remove(todo)}>
        <img src={deleteTodoImage} alt="Delete todo" class="h-4 mx-2" />
      </a>

    </div>

  </div>
{/each}
