import TodoList from "./TodoList.svelte";
import { todoData, actionsData } from "./Todo.stories";
export default {
  title: "TodoList",
  excludeStories: /.*Data$/
};

export const defaultTodosData = [
  { ...todoData, id: "1", title: "todo 1" },
  { ...todoData, id: "2", title: "todo 2" },
  { ...todoData, id: "3", title: "todo 3" },
  { ...todoData, id: "4", title: "todo 4" },
  { ...todoData, id: "5", title: "todo 5" },
  { ...todoData, id: "6", title: "todo 6" }
];
export const withPinnedTodosData = [
  ...defaultTodosData.slice(0, 5),
  { id: "6", text: "todo 6 has been pinned", state: "TODO_PINNED" }
];

// default TaskList state
export const Default = () => ({
  Component: TodoList,
  props: {
    todos: defaultTodosData
  },
  on: {
    ...actionsData
  }
});
// tasklist with pinned tasks
export const WithPinnedTodos = () => ({
  Component: TodoList,
  props: {
    todos: withPinnedTodosData
  },
  on: {
    ...actionsData
  }
});
// tasklist in loading state
export const Loading = () => ({
  Component: TodoList,
  props: {
    loading: true
  }
});
// tasklist no tasks
export const Empty = () => ({
  Component: TodoList
});
