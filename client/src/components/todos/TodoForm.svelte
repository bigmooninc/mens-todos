<script>
  import { onMount } from "svelte";
  import axios from "axios";
  let newTodo = "";

  async function handleSubmit() {
    console.log("Handle submit function");
    console.log(newTodo);
    // newTodo = newTodo.trim();
    // // if (!newTodo) return;
    // const res = await fetch("http://localhost:8888/api/todos", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     text: newTodo
    //   })
    // })
    //   .then(res => res.json())
    //   .then(data => console.log(data))
    //   .catch(err => console.log(err));
    // return await res.json();
    newTodo = "";
  }
</script>

<style>

</style>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={newTodo} type="text" placeholder="Add a todo" />
</form>
