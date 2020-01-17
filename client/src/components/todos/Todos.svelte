<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import axios from "axios";
  // import TodoForm from "./TodoForm.svelte";

  export let todos = [];
  let text = "";

  // export async function preload() {
  //   const res = await fetch("http://localhost:8888/api/todos");
  //   return { todos: await res.json() };
  // }

  onMount(async () => {
    try {
      const res = await fetch("http://localhost:8888/api/todos");
      todos = await res.json();
      console.log(todos);
    } catch (err) {
      console.log("Sorry...could not find todos");
    }
  });

  async function handleSubmit() {
    text = text.trim();
    if (!text) return;
    const res = await fetch("http://localhost:8888/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));

    let newTodos = await fetch("http://localhost:8888/api/todos");

    todos = await newTodos.json();

    text = "";
  }

  async function handleRemove(id) {
    console.log(id);
    const res = await fetch(`http://localhost:8888/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    let newTodos = await fetch("http://localhost:8888/api/todos");

    todos = await newTodos.json();
  }
</script>

<styles />

<main>

  <div class="container mx-auto flex flex-row ">
    <div class="w-1/4 mx-2">
      <div class="bg-gray-200 p-4">
        <p>Here is some text</p>
      </div>
    </div>
    <div class="w-1/4 mx-2">
      <div class="bg-gray-400 p-4">
        <p>Here is some text</p>
      </div>
    </div>
    <div class="w-1/4 mx-2">
      <div class="bg-gray-600 p-4">
        <p>Here is some text</p>
      </div>
    </div>
    <div class="w-1/4 mx-2">
      <div class="bg-gray-800 p-4">
        <p>Here is some text</p>
      </div>
    </div>
  </div>

  <form on:submit|preventDefault={handleSubmit}>
    <input bind:value={text} type="text" placeholder="Add a todo" />
  </form>
  {#if todos}
    {#each todos as todo}
      <div class="w-full max-w-md mx-auto flex justify-between">
        <p transition:fly>{todo.text}</p>
        <button on:click={handleRemove(todo._id)}>Remove</button>
      </div>
    {/each}
  {:else}
    <p>There are no todos.</p>
  {/if}
</main>
