<script>
  import { onMount } from "svelte";
  import axios from "axios";

  let todos = [];

  onMount(async () => {
    try {
      const res = await axios.get("/api/todos");
      todos = await res.json();
      console.log(todos);
    } catch (err) {
      console.log("Sorry...could not find todos");
    }
  });
</script>

<styles />
<h1>This is the Todos Component</h1>
<main />
