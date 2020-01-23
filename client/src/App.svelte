<script>
  // import Tailwindcss from "./Tailwindcss.svelte";
  import Todos from "./components/todos/Todos.svelte";
  import Login from "./components/auth/Login.svelte";
  import Register from "./components/auth/Register.svelte";
  import { Router, Route } from "svelte-routing";
  import NavLink from "./components/routing/NavLink.svelte";

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";
</script>

<!-- <Tailwindcss /> -->

<!-- <main>
  <Login />
  <Register />
  <Todos />
</main> -->

<Todos />
