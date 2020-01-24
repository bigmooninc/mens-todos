<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import TodoForm from "./TodoForm.svelte";
  import TodoList from "./TodoList.svelte";

  let todo;
  let todos;

  onMount(async () => {
    try {
      const res = await fetch("http://localhost:8888/api/todos");
      todos = await res.json();
      console.log(todos);
    } catch (err) {
      console.log("Sorry...could not find todos");
    }
  });

  const handleSubmit = async event => {
    let { text } = event.detail;
    text.trim();
    console.log(text);
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
      .then(text => (text = ""))
      .catch(err => console.log(err));

    let newTodos = await fetch("http://localhost:8888/api/todos");

    todos = await newTodos.json();
  };

  const handleRemove = async event => {
    const { id } = event.detail;
    const res = await fetch(`http://localhost:8888/api/todos/${id}`, {
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
  h3 {
    @apply mb-4 ml-1 font-bold;
  }
</style>

<main class="w-full max-w-xl mx-auto mt-32">
  <h1 class="text-center text-white mb-4 text-3xl font-sans font-extrabold">
    Todo List with Svelte
  </h1>
  <TodoForm {todos} on:add={handleSubmit} />
  <TodoList {todos} on:remove={handleRemove} {todo} />
</main>
