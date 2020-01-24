import TodoList from './TodoList.svelte';
import '../../../public/index.css';
// import { todoData, actionsData } from './Todo.stories';
export default {
  title: 'TodoList',
  excludeStories: /.*Data$/
};

export const defaultTodosData = [
  {
    id: '1',
    text: 'Aliqua aute elit dolor dolore reprehenderit magna.',
    details:
      'Amet sunt esse ullamco nisi eiusmod mollit non magna et mollit aliqua culpa deserunt. Aliquip labore aliqua officia id commodo deserunt quis eiusmod incididunt non do. Ex nostrud id amet tempor aliquip proident aute cupidatat et irure sunt.',
    clipped: false,
    archived: false,
    date: Date.now
  },
  {
    id: '2',
    text: 'Laborum proident ex nostrud eiusmod exercitation.',
    details: '',
    clipped: false,
    archived: false,
    date: Date.now
  },
  {
    id: '3',
    text: 'Sit enim laboris enim proident nisi.',
    details:
      'Ex et aliquip Lorem exercitation aliquip. Amet anim ea velit ex quis fugiat aute tempor proident non occaecat commodo voluptate cupidatat. Deserunt laborum dolore magna dolore aliqua irure veniam sit sit.',
    clipped: false,
    archived: false,
    date: Date.now
  },
  {
    id: '4',
    text: 'Reprehenderit est non deserunt velit dolor eu.',
    details: '',
    clipped: false,
    archived: false,
    date: Date.now
  },
  {
    id: '5',
    text: 'Consectetur eiusmod consectetur eu do veniam pariatur.',
    details: '',
    clipped: false,
    archived: false,
    date: Date.now
  },
  {
    id: '6',
    text: 'Labore proident fugiat dolore ipsum reprehenderit commodo.',
    details: '',
    clipped: false,
    archived: false,
    date: Date.now
  }
];
export const withClippedTodosData = [
  ...defaultTodosData.slice(0, 5),
  {
    id: '6',
    text: 'Esse est in elit duis sit.',
    details: '',
    clipped: true,
    archived: false,
    date: Date.now
  }
];

export const withArchivedTodosData = [
  ...defaultTodosData.slice(0, 5),
  {
    id: '6',
    text: 'Lorem incididunt do mollit deserunt.',
    details: '',
    clipped: false,
    archived: true,
    date: Date.now
  }
];

// default TaskList state
export const Default = () => ({
  Component: TodoList,
  props: {
    todos: defaultTodosData
  }
});
// tasklist with pinned todo
export const WithClippedTodos = () => ({
  Component: TodoList,
  props: {
    todos: withClippedTodosData
  }
});

// tasklist with archived todo
export const WithArchivedTodos = () => ({
  Component: TodoList,
  props: {
    todos: withArchivedTodosData
  }
});

// tasklist in loading state
export const Loading = () => ({
  Component: TodoList,
  props: {
    loading: true
  }
});
// tasklist no todos
export const Empty = () => ({
  Component: TodoList
});
