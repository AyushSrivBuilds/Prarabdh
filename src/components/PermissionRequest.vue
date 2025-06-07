<template>
  <div class="permission-request">
    <h2>Permissions Required</h2>
    <p>To provide the best experience, Sampark needs the following permissions:</p>
    <ul>
      <!-- Replace with actual permission requests -->
      <li>Notifications: To keep you updated.</li>
      <li>Camera: To capture images for submissions (optional).</li>
      <li>Location: To tag submissions with your current location (optional).</li>
    </ul>
    <button @click="grantAllPermissions">Grant Permissions</button>
    <button @click="skipPermissions" class="skip-button">Skip for now</button>
  </div>
</template>

<script>
export default {
  name: 'PermissionRequest',
  methods: {
    grantAllPermissions() {
      // Placeholder for actual permission granting logic
      // For now, we'll just emit an event to proceed
      console.log('Permissions granted (simulated)');
      this.$emit('permissions-granted');
    },
    skipPermissions() {
      // Placeholder for skipping permissions
      // For now, we'll just emit an event to proceed
      console.log('Permissions skipped');
      this.$emit('permissions-granted'); // Or a different event like 'permissions-skipped'
    }
  }
};
</script>

<style scoped>
.permission-request {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
}
li {
  margin-bottom: 10px;
}
button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px; /* Add some space between buttons */
}
.skip-button {
  background-color: #f0f0f0;
  color: #333;
}
</style>