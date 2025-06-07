<template>
  <div class="submission-form">
    <h2>Submit Your Details for a Reading</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name or Nickname:</label>
        <input type="text" id="name" v-model="formData.name" @input="handleNameInput" placeholder="e.g., Priya Sharma" required />
      </div>

      <div class="form-group">
        <label for="dob">Date of Birth:</label>
        <input type="date" id="dob" v-model="formData.dob" required />
      </div>

      <div class="form-group">
        <label for="tob">Time of Birth (or Estimated):</label>
        <input type="time" id="tob" v-model="formData.tob" placeholder="hh:mm" />
        <small>If unknown, you can leave this blank or provide an estimate.</small>
      </div>

      <div class="form-group">
        <label for="pob">Place of Birth:</label>
        <input type="text" id="pob" v-model="formData.pob" @input="handlePobInput" placeholder="e.g., Mumbai, Maharashtra" required />
      </div>

      <div class="form-group">
        <label for="palmScan">Palm Scan Image:</label>
        <input type="file" id="palmScan" @change="handleFileChange" accept="image/*" required />
        <small>Please upload a clear image of your dominant hand's palm.</small>
      </div>

      <div v-if="errorMessage !== ''" class="message error-message">
        <span class="icon">&#x26A0;</span> {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="message success-message">
        <span class="icon">&#x2713;</span> {{ successMessage }}
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>

      <div class="info-messages">
        <div class="info-message">
          <span class="icon">&#x1F512;</span> Your information is kept confidential and secure.
        </div>
        <div class="info-message">
          <span class="icon">&#x23F3;</span> You'll receive your reading within 24-48 hours.
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from 'browser-image-compression';

export default {
  name: 'SubmissionForm',
  setup() {
    const formData = ref({
      name: '',
      dob: '',
      tob: '',
      pob: '',
      palmScanFile: null,
    });
    const isSubmitting = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        formData.value.palmScanFile = file;
      }
    };

    const handleNameInput = (event) => {
      const namePattern = /[^A-Za-z\s]/g; // Find any character NOT a letter or space
      event.target.value = event.target.value.replace(namePattern, '');
      formData.value.name = event.target.value;
    };

    const handlePobInput = (event) => {
      const pobPattern = /[^A-Za-z\s.,-]/g; // Find any char NOT letter, space, comma, period, hyphen
      const sanitizedValue = event.target.value.replace(pobPattern, '');
      event.target.value = sanitizedValue;
      formData.value.pob = sanitizedValue;
    };

    const handleSubmit = async () => {
      isSubmitting.value = true;
      errorMessage.value = ''; // Clear previous error
      successMessage.value = '';

      // Validate name field
      const nameValidationPattern = /^[A-Za-z\s]+$/;
      if (!formData.value.name || !nameValidationPattern.test(formData.value.name.trim())) {
        errorMessage.value = 'Name is required and can only contain letters and spaces.';
        isSubmitting.value = false;
        return;
      }
      
      // Validate Date of Birth
      if (!formData.value.dob) {
        errorMessage.value = 'Date of Birth is required.';
        isSubmitting.value = false;
        return;
      }

      // Validate Place of Birth
      const pobValidationPattern = /^[A-Za-z\s.,-]+$/; // Allows letters, spaces, comma, period, hyphen
      if (!formData.value.pob || !pobValidationPattern.test(formData.value.pob.trim())) {
        errorMessage.value = 'Place of Birth is required and can only contain letters, spaces, commas, periods, or hyphens.';
        isSubmitting.value = false;
        return;
      }

      // Validate Palm Scan
      if (!formData.value.palmScanFile) {
        errorMessage.value = 'Please select a palm scan image.';
        isSubmitting.value = false;
        return;
      }

      // successMessage.value = 'Submitting your details...'; // Removed optimistic message

      try {
        // 1. Compress image
        const imageFile = formData.value.palmScanFile;
        console.log('Original image file:', imageFile);
        console.log(`Original image size: ${imageFile.size / 1024 / 1024} MB`);

        const options = {
          maxSizeMB: 0.5, // Max file size in MB
          maxWidthOrHeight: 1024, // Max width or height
          useWebWorker: true,
          fileType: 'image/webp', // Convert to WebP
        };

        let compressedFile;
        try {
          compressedFile = await imageCompression(imageFile, options);
          console.log('Compressed image file:', compressedFile);
          console.log(`Compressed image size: ${compressedFile.size / 1024 / 1024} MB`);
        } catch (compressionError) {
          console.error('Image compression error:', compressionError);
          // Fallback to original file if compression fails, or handle error appropriately
          errorMessage.value = 'Could not compress image. Please try a different image or try again. Details: ' + compressionError.message;
          isSubmitting.value = false;
          // successMessage.value = ''; // No optimistic message to clear
          return;
        }
        
        // 2. Upload compressed image to Firebase Storage
        // Ensure the filename has a .webp extension
        const originalNameWithoutExtension = imageFile.name.split('.').slice(0, -1).join('.');
        const uniqueFileName = `${Date.now()}-${originalNameWithoutExtension}.webp`;
        const palmImageRef = storageRef(storage, `palmScans/${uniqueFileName}`);
        
        await uploadBytes(palmImageRef, compressedFile); // Use compressedFile
        const imageUrl = await getDownloadURL(palmImageRef);

        // 3. Save form data (including image URL) to Firestore
        await addDoc(collection(db, "submissions"), {
          name: formData.value.name.trim(),
          dob: formData.value.dob,
          tob: formData.value.tob, // Optional, so can be empty
          pob: formData.value.pob.trim(),
          palmScanUrl: imageUrl,
          status: 'Submitted', // Initial status
          submittedAt: serverTimestamp(), // Use server timestamp
        });
        
        // Update to final success message
        successMessage.value = 'Your details have been submitted successfully! We will get back to you with your reading soon.';
        errorMessage.value = ''; // Clear any potential error message if retrying after a failure
        // Reset form
        formData.value = { name: '', dob: '', tob: '', pob: '', palmScanFile: null };
        const fileInput = document.getElementById('palmScan');
        if (fileInput) {
          fileInput.value = ''; // Clears the file input display
        }

      } catch (error) {
        console.error("Error submitting form:", error);
        // successMessage.value = ''; // No optimistic message to clear
        errorMessage.value = 'An error occurred while submitting your details. Please try again. Details: ' + error.message;
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      formData,
      isSubmitting,
      errorMessage,
      successMessage,
      handleFileChange,
      handleSubmit,
      handleNameInput,
      handlePobInput,
    };
  },
};
</script>

<style scoped>
.submission-form {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group input[type="time"],
.form-group input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* So padding doesn't add to width */
}

.form-group small {
  display: block;
  margin-top: 3px;
  font-size: 0.8em;
  color: #666;
}

button[type="submit"] {
  background-color: #4CAF50; /* Green */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  display: block; /* To allow margin auto for centering if needed, and margin-bottom */
  margin: 0 auto 15px auto; /* Centering and margin bottom */
}

button[type="submit"]:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.message { /* Common style for error and success */
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.error-message {
  color: red;
  border: 1px solid red;
  background-color: #ffebeb;
}

.success-message {
  color: green;
  border: 1px solid green;
  background-color: #e6ffed;
}

.icon {
  margin-right: 8px; /* Space between icon and text */
  font-size: 1.2em; /* Slightly larger icon */
}

.info-messages {
  margin-top: 15px;
  font-size: 0.9em;
  color: #555;
}

.info-message {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-message .icon { /* Re-using .icon style for consistency */
  margin-right: 8px;
  font-size: 1.1em;
}
</style>