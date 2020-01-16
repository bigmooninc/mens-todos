<script>
  let email = "";
  let password = "";
</script>

<style>
  h2 {
    @apply text-2xl mb-4;
  }
  input {
    @apply border border-gray-300 p-2 mb-3;
  }
  button {
    @apply py-2 text-white;
  }
  p {
    @apply mt-4 text-sm;
  }
</style>

<div
  class="max-w-xs w-full mx-auto h-screen flex flex-col justify-center
  items-center pb-20">
  <h2 class="text-center">Login</h2>
  <form class="flex flex-col w-full">
    <input
      type="text"
      placeholder="Email"
      aria-label="Enter your email address"
      value={email} />
    <input
      type="password"
      placeholder="Password"
      aria-label="Enter your password"
      value={password} />
    <button
      type="submit"
      class="bg-red-800 hover:bg-red-900 transition-bg transition-500">
      Login
    </button>
  </form>
  <p>
    Don't have an account?
    <a href="#" class="text-red-700 hover:underline transition-500">Register</a>
  </p>
</div>
