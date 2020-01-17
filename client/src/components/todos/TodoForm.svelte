<script>
  import { onMount } from "svelte";

  // import { getTodos } from "./Todos.svelte";

  let text = "";

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

    text = "";
  }
</script>

<style>

</style>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={text} type="text" placeholder="Add a todo" />
</form>
