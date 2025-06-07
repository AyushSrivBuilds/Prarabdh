<template>
  <div class="home-screen">
    <h1>Welcome to Sampark</h1>
    <p>Connecting you seamlessly.</p>
    <button @click="proceedToPermissions">Get Started</button>
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

<style scoped>
.home-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>