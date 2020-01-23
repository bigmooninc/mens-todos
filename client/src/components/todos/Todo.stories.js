// src/components/Task.stories.js
import "../../../public/index.css";
import Todo from "./Todo.svelte";
import { action } from "@storybook/addon-actions";
export default {
  title: "Todo",
  excludeStories: /.*Data$/
};

export const actionsData = {
  onPinTodo: action("onPinTodo"),
  onArchiveTodo: action("onArchiveTodo")
};

export const todoData = {
  id: "1",
  text: "Test Todo",
  state: "Todo_INBOX",
  updated_at: new Date(2019, 0, 1, 9, 0)
};

// default task state
export const Default = () => ({
  Component: Todo,
  props: {
    todo: todoData
  },
  on: {
    ...actionsData
  }
});
// pinned todo state
export const Pinned = () => ({
  Component: Todo,
  props: {
    todo: {
      ...todoData,
      state: "TODO_PINNED"
    }
  },
  on: {
    ...actionsData
  }
});
// archived task state
export const Archived = () => ({
  Component: Todo,
  props: {
    todo: {
      ...todoData,
      state: "TODO_ARCHIVED"
    }
  },
  on: {
    ...actionsData
  }
});
