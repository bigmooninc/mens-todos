<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { flip } from "svelte/animate";

  const dispatch = createEventDispatcher();

  // const notPinned = "images/pin_disabled.svg";
  // const pinned = "images/pin.svg";

  const deleteIcon = "images/icon-trash.svg";

  export let todos;

  // const tack =
  //   // event handler for Pin Todo
  //   function PinTodo() {
  //     dispatch("onPinTodo", {
  //       id: todos.id
  //     });
  //   };

  // event handler for Archive Todo
  // function ArchiveTodo() {
  //   dispatch("onArchiveTodo", {
  //     id: todo.id
  //   });
  // }

  // onMount(async () => {
  //   try {
  //     const res = await fetch("http://localhost:8888/api/todos");
  //     todos = await res.json();
  //     console.log(todos);
  //   } catch (err) {
  //     console.log("Sorry...could not find todos");
  //   }
  // });

  export let todo;

  // Todo props
  // export let todo = {
  //   id: "",
  //   text: "",
  //   state: "",
  //   updated_at: new Date(2019, 0, 1, 9, 0)
  // };

  // reactive declaration (computed prop in other frameworks)
  // $: isChecked = todo.state === "TODO_ARCHIVED";

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

<style>

</style>

<div class="w-full flex items-center bg-black mb-2 relative z-0">
  <!-- <label class="w-16 flex justify-center checkbox-container">
    <input type="checkbox" checked={isChecked} name="checked" />
    <span class="checkmark" on:click={ArchiveTodo} />
  </label> -->
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
    <!-- <input
      type="text"
      value={todo.text}
      class="w-full p-2 font-sans font-normal text-sm" /> -->
  </div>
  <div class="w-16 flex justify-center">
    <a href="/" class="text-white" on:click|preventDefault={handleRemove}>
      <img src={deleteIcon} alt="Remove todo" />
    </a>
  </div>
</div>
