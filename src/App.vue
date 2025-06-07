<template>
  <div id="app-container">
    <HomeScreen v-if="currentStep === 'home'" @proceed="showPermissions" />
    <PermissionRequest v-else-if="currentStep === 'permissions'" @permissions-granted="showForm" />
    <SubmissionForm v-else-if="currentStep === 'form'" />
  </div>
</template>

<script>
import HomeScreen from './components/HomeScreen.vue';
import PermissionRequest from './components/PermissionRequest.vue';
import SubmissionForm from './components/SubmissionForm.vue';

export default {
  name: 'App',
  components: {
    HomeScreen,
    PermissionRequest,
    SubmissionForm
  },
  data() {
    return {
      currentStep: 'home' // Initial step
    };
  },
  methods: {
    showPermissions() {
      this.currentStep = 'permissions';
    },
    showForm() {
      this.currentStep = 'form';
    }
  }
};
</script>

<style>
#app-container { /* Changed from #app to avoid conflict if #app is used by Vue globally */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
