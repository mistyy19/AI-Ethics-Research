<template>
  <ion-modal :is-open="isOpen" @didDismiss="close">
    <ion-content>
      <div class="auth-container">
        <ion-segment v-model="activeTab">
          <ion-segment-button value="login">Login</ion-segment-button>
          <ion-segment-button value="register">Register</ion-segment-button>
        </ion-segment>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="loginForm.email" type="email" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input v-model="loginForm.password" type="password" required></ion-input>
          </ion-item>
          <ion-button type="submit" expand="block" :disabled="loading">
            {{ loading ? 'Loading...' : 'Login' }}
          </ion-button>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <ion-item>
            <ion-label position="floating">Username</ion-label>
            <ion-input v-model="registerForm.username" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="registerForm.email" type="email" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input v-model="registerForm.password" type="password" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Confirm Password</ion-label>
            <ion-input v-model="registerForm.confirmPassword" type="password" required></ion-input>
          </ion-item>
          <ion-button type="submit" expand="block" :disabled="loading">
            {{ loading ? 'Loading...' : 'Register' }}
          </ion-button>
        </form>

        <ion-text color="danger" v-if="error">{{ error }}</ion-text>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { 
  IonModal, 
  IonContent, 
  IonSegment, 
  IonSegmentButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText
} from '@ionic/vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import type { LoginForm, RegisterForm } from '@/types/user';

export default defineComponent({
  name: 'AuthDialog',
  components: {
    IonModal,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    redirectRoute: {
      type: String,
      required: false
    }
  },
  emits: ['update:isOpen', 'auth-success'],
  setup(props, { emit }) {
    const router = useRouter();
    const authStore = useAuthStore();
    const activeTab = ref('login');
    const loginForm = ref<LoginForm>({ email: '', password: '' });
    const registerForm = ref<RegisterForm>({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const handleLogin = async () => {
      try {
        await authStore.login(loginForm.value);
        emit('auth-success');
        close();
        router.push(props.redirectRoute || '/user-profile'); 
      } catch (error) {
        // Error is handled by the store
      }
    };

    const handleRegister = async () => {
      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        authStore.error = 'Passwords do not match';
        return;
      }
      try {
        await authStore.register(registerForm.value);
        emit('auth-success');
        close();
      } catch (error) {
        // Error is handled by the store
      }
    };

    const close = () => {
      emit('update:isOpen', false);
    };

    return {
      activeTab,
      loginForm,
      registerForm,
      loading: authStore.loading,
      error: authStore.error,
      handleLogin,
      handleRegister,
      close
    };
  }
});
</script>

<style scoped>
.auth-container {
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
}

.auth-form {
  margin-top: 2rem;
}

ion-item {
  margin-bottom: 1rem;
}

ion-button {
  margin-top: 2rem;
}
</style>