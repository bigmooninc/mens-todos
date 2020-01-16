<script>
  import { onMount } from "svelte";
  import TodoForm from "./TodoForm.svelte";
  import axios from "axios";

  let todos = [];

  onMount(async () => {
    try {
      const res = await fetch("http://localhost:8888/api/todos");
      todos = await res.json();
      console.log(todos);
    } catch (err) {
      console.log("Sorry...could not find todos");
    }
  });
</script>

<styles />

<main>
  <h1>This is the Todos Component</h1>
  <TodoForm />
  {#if todos}
    {#each todos as todo}
      <p>{todo.text}</p>
    {/each}
  {:else}
    <p>There are no todos.</p>
  {/if}
</main>
