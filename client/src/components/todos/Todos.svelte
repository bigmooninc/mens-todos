<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import TodoForm from "./TodoForm.svelte";
  import TodoList from "./TodoList.svelte";

  let todo;
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

  const handleComplete = async event => {
    const { id, completed } = event.detail;
    const res = await fetch(`http://localhost:8888/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));

    let updateToCompletedTodos = await fetch("http://localhost:8888/api/todos");
    todos = await updateToCompletedTodos.json();
  };

  // console.log("These are: ", todos);

  $: numActive = todos.filter(todo => !todo.completed).length;

  $: numCompleted = todos.filter(todo => todo.completed).length;
</script>

<style>
  .badge {
    margin: -10px -20px 0 0;
  }
</style>

<main class="w-full max-w-xl mx-auto mt-32">
  <h1 class="text-center text-white mb-4 text-3xl font-sans font-extrabold">
    Todo List with Svelte
  </h1>
  <div class="flex mx-auto w-2/3 justify-between mb-5">
    <div>
      <a
        class="font-sans font-normal text-white hover:text-purple-500
        hover:no-underline transition-500 opacity-25 hover:opacity-100
        transition-opacity"
        href="#">
        All
      </a>
    </div>
    <div class="relative">
      <a
        class="font-sans font-normal text-white hover:text-purple-500
        hover:no-underline transition-500 opacity-25 hover:opacity-100
        transition:opacity"
        href="#">
        Active
      </a>
      <div
        class="absolute top-0 right-0 bg-purple-500 text-white font-sans
        font-extrabold text-xs w-5 h-5 flex justify-center items-center
        rounded-full badge">
        {numActive}
      </div>
    </div>
    <div class="relative">
      <a
        class="font-sans font-normal text-white hover:text-purple-500
        hover:no-underline transition-500 opacity-25 hover:opacity-100
        transition:opacity"
        href="#">
        Completed
      </a>
      <div
        class="absolute top-0 right-0 bg-purple-500 text-white font-sans
        font-extrabold text-xs w-5 h-5 flex justify-center items-center
        rounded-full badge">
        {numCompleted}
      </div>
    </div>
  </div>
  <TodoForm {todos} on:add={handleSubmit} />
  <TodoList
    {todos}
    on:remove={handleRemove}
    {todo}
    on:complete={handleComplete} />
</main>
