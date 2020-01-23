<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import TodoForm from "./TodoForm.svelte";
  import TodoList from "./TodoList.svelte";

  let todos = [];

  let todo;

  let text = "";

  onMount(async () => {
    try {
      const res = await fetch("http://localhost:8888/api/todos");
      todos = await res.json();
      console.log(todos);
    } catch (err) {
      console.log("Sorry...could not find todos");
    }
  });

  // async function handleRemove(id) {
  //   console.log(id);
  //   const res = await fetch(`http://localhost:8888/api/todos/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   });

  //   let newTodos = await fetch("http://localhost:8888/api/todos");

  //   todos = await newTodos.json();
  // }
</script>

<style>
  h3 {
    @apply mb-4 ml-1 font-bold;
  }
</style>

<main class="w-full max-w-xl mx-auto mt-32">
  <h1 class="text-center text-white mb-4 text-3xl font-sans font-extrabold">
    Todo List with Svelte
  </h1>
  <TodoForm bind:text bind:todos />
  <TodoList {todos} bind:todo />
</main>
