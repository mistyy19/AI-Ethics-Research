<template>
  <ion-page>
    <app-header />
    <ion-content>
      <section class="create-survey-section">
        <div class="create-survey-content">
          <h1>Create a New Survey</h1>

          <!-- Upload Image Section -->
          <ion-item class="form-item">
            <ion-label position="stacked">Upload Image</ion-label>
            <div class="upload-section">
              <ion-button class="standard-btn" expand="block" @click="triggerFileInput">
                Choose file
              </ion-button>
              <input
                type="file"
                ref="fileInput"
                @change="handleImageUpload"
                accept="image/*"
                class="hidden-input"
              />
            </div>
            <!-- Image Preview -->
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" />
            </div>
          </ion-item>

          <!-- Location Input -->
          <ion-item class="form-item">
            <ion-label position="stacked">Location</ion-label>
            <ion-input v-model="surveyData.location" placeholder="Enter the location" required></ion-input>
          </ion-item>

          <!-- Context Input -->
          <ion-item class="form-item">
            <ion-label position="stacked">Context</ion-label>
            <ion-textarea
              v-model="surveyData.context"
              placeholder="Describe the context"
              :auto-grow="true"
              :rows="6"
              class="context-textarea"
            ></ion-textarea>
          </ion-item>

          <!-- Person Input -->
          <ion-item class="form-item">
            <ion-label position="stacked">Person</ion-label>
            <ion-input v-model="surveyData.person" placeholder="Related person or group" required></ion-input>
          </ion-item>

          <!-- Publish Survey Option -->
          <ion-item class="form-item" lines="none">
            <ion-label>Make this survey public?</ion-label>
            <ion-toggle v-model="surveyData.isPublic"></ion-toggle>
          </ion-item>

          <!-- Create Survey Button -->
          <ion-button expand="block" @click="createSurvey" :disabled="!isFormValid" class="create-survey-btn">
            Create Survey
          </ion-button>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonToggle } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/common/AppHeader.vue';
import axios from 'axios';

// axios
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default defineComponent({
  name: 'CreateSurvey',
  components: {
    IonPage,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonToggle,
    AppHeader,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const loading = ref(false);

    onMounted(async () => {
      try {
        await authStore.checkAuth();
        if (!authStore.isAuthenticated || !authStore.user?.id) {
          console.log('User not authenticated, redirecting to home');
          router.push('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/');
      }
    });

    const fileInput = ref<HTMLInputElement | null>(null);
    const imagePreview = ref<string | null>(null);
    const surveyData = ref({
      location: '',
      context: '',
      person: '',
      image: null as File | null,
      isPublic: false,
    });

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const handleImageUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0] || null;
      surveyData.value.image = file;
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.value = null;
      }
    };

    const isFormValid = computed(() => {
      return (
        surveyData.value.location &&
        surveyData.value.context &&
        surveyData.value.person &&
        surveyData.value.image
      );
    });

    const createSurvey = async () => {
      if (!authStore.isAuthenticated || !authStore.user?.id) {
        console.error('User not authenticated or user ID missing');
        router.push('/');
        return;
      }

      loading.value = true;
      try {
        const formData = new FormData();
        formData.append('userId', String(authStore.user.id));
        formData.append('location', surveyData.value.location);
        formData.append('context', surveyData.value.context);
        formData.append('person', surveyData.value.person);
        formData.append('isPublic', String(surveyData.value.isPublic));
        
        if (surveyData.value.image) {
          formData.append('image', surveyData.value.image);
        }

        const response = await api.post('/api/qualtrics/createSurvey', formData);
        console.log('Survey created successfully');
        router.push('/user-profile');
      } catch (error: any) {
        console.error('Failed to create survey:', error);
        if (error.response?.status === 401) {
          console.log('Authentication expired, redirecting to login');
          await authStore.logout();
          router.push('/');
        } else {
          alert(error.response?.data?.message || 'Failed to create survey. Please try again.');
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      surveyData,
      handleImageUpload,
      isFormValid,
      createSurvey,
      fileInput,
      imagePreview,
      triggerFileInput,
      loading,
    };
  },
});
</script>

<style scoped>
.create-survey-section {
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.create-survey-content {
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  color: var(--ion-color-dark);
  text-align: center;
  margin-bottom: 2rem;
}

.form-item {
  margin-bottom: 1.5rem;
}

.form-item ion-label {
  font-size: 1.5rem !important;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.upload-section {
  width: 100%;
  margin: 0.5rem 0;
}

.standard-btn {
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 28px;
  height: 48px;
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(100, 149, 237, 0.2);
  transition: all 0.3s ease;
  width: 100%;
  margin: 0;
}

.standard-btn:hover {
  --background: var(--ion-color-primary-tint);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(100, 149, 237, 0.3);
}

.hidden-input {
  display: none;
}

.image-preview {
  width: 100%;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--ion-color-light);
}

.image-preview img {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  display: block;
}

.context-textarea {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  --background: #f8f9fa;
  --padding-top: 1rem;
  --padding-bottom: 1rem;
  --padding-start: 1rem;
  --padding-end: 1rem;
  margin-top: 0.5rem;
}

.create-survey-btn {
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 28px;
  height: 48px;
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: capitalize;
  box-shadow: 0 4px 12px rgba(100, 149, 237, 0.2);
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.create-survey-btn:hover {
  --background: var(--ion-color-primary-tint);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(100, 149, 237, 0.3);
}
</style>