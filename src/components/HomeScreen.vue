<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
    <h1 class="text-4xl font-bold text-blue-600 mb-4">Welcome to Sampark</h1>
    <p class="text-lg text-gray-700 mb-8">Connecting you seamlessly.</p>
    <button
      @click="proceedToPermissions"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out"
    >
      Get Started
    </button>
  </div>
</template>

<script>
export default {
  name: 'HomeScreen',
  methods: {
    proceedToPermissions() {
      this.$emit('proceed');
    }
  }
};
</script>

<!-- Removed <style scoped> block as Tailwind classes are used directly -->