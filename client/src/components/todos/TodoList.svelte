<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  export let loading = false;
  export let todos = [];
  export let todo;

  const deleteIcon = "images/close-orange.svg";
  const verticalDots = "images/vertical-dots.svg";

  const pinTodoImage = "images/clip-red-400.svg";
  const archiveTodoImage = "images/archive-red-400.svg";
  const deleteTodoImage = "images/trash-red-400.svg";

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

  // const toggleIcons = e => {
  //   e.preventDefault();
  //   console.log("I clicked it");
  //   showIcons !== showIcons;
  //   console.log(showIcons);
  // };
</script>

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
    class="relative w-full flex items-center bg-black mb-1 relative z-0"
    animate:flip={{ delay: 150, duration: 400 }}>
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

    <div class="w-10 flex justify-center relative">
      <a
        href="/"
        on:click|preventDefault={remove(todo)}
        class="w-full flex justify-center">
        <img src={verticalDots} alt="Remove todo" class="h-6" />
      </a>

      <!-- <a href="/" class="w-full flex justify-center">
        <img src={verticalDots} alt="Show menu" class="h-6" />
      </a> -->

    </div>
    <div class="absolute flex flex-row right-0 hidden" transition:fade>
      <img src={pinTodoImage} alt="Pin todo" class="mx-2" />
      <img src={archiveTodoImage} alt="Archive todo" class="mx-2" />
      <img src={deleteTodoImage} alt="Delete todo" class="mx-2" />
    </div>
  </div>
{/each}
