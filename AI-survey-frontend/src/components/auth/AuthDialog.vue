<template>
  <ion-modal :is-open="isOpen" :backdrop-dismiss="false">
    <ion-content>
      <div class="auth-container">
        <!-- close -->
        <button class="close-button" @click="closeModal">✕</button>
        
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
import { defineComponent, ref, watch } from 'vue';
import { 
  IonModal, 
  IonContent, 
  IonSegment, 
  IonSegmentButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  toastController
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
    const error = ref('');
    const isClosingAllowed = ref(false);
    
    const loginForm = ref<LoginForm>({
      email: localStorage.getItem('loginEmail') || '',
      password: ''
    });
    
    const registerForm = ref<RegisterForm>({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const showToast = async (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
      const toast = await toastController.create({
        message: message,
        duration: 1500,
        position: 'top',
        cssClass: `toast-${type}`,
        mode: 'ios',
        translucent: false, 
        buttons: [],
        animated: true,
      });

      await toast.present();
    };
    // 登录处理函数
    const handleLogin = async () => {
      error.value = '';
      try {
        const result = await authStore.login(loginForm.value);
        if (result) {
          isClosingAllowed.value = true;
          // 存储邮箱
          localStorage.setItem('loginEmail', loginForm.value.email);
          emit('auth-success');
          
          await showToast('Login successful!', 'success');
          
          setTimeout(() => {
            emit('update:isOpen', false);
            if (props.redirectRoute) {
              router.push(props.redirectRoute);
            }
          }, 1000);
        } else {
          error.value = authStore.error || 'Login failed. Please try again.';
          isClosingAllowed.value = false;
          emit('update:isOpen', true);
        }
      } catch (err: any) {
        error.value = err.response?.status === 401 
          ? 'Invalid email or password' 
          : 'Login failed. Please try again.';
        isClosingAllowed.value = false;
        emit('update:isOpen', true);
      }
    };

    // 注册处理函数
    const handleRegister = async () => {
      error.value = '';
      
      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        error.value = 'Passwords do not match';
        isClosingAllowed.value = false;
        emit('update:isOpen', true);
        return;
      }

      try {
        const result = await authStore.register(registerForm.value);
        if (result) {
          isClosingAllowed.value = true;
          // 存储邮箱
          localStorage.setItem('loginEmail', registerForm.value.email);
          emit('auth-success');
          
          await showToast('Registration successful!', 'info');
          
          setTimeout(() => {
            emit('update:isOpen', false);
            router.push(props.redirectRoute || '/user-profile');
          }, 1000);
        } else {
          error.value = authStore.error || 'Registration failed. Please try again.';
          isClosingAllowed.value = false;
          emit('update:isOpen', true);
        }
      } catch (err: any) {
        error.value = 'Registration failed. Please try again.';
        isClosingAllowed.value = false;
        emit('update:isOpen', true);
      }
    };

    // 打开模态框
    const openModal = () => {
      error.value = '';
      isClosingAllowed.value = false;
      emit('update:isOpen', true);
    };

    // 关闭模态框
    const closeModal = () => {
      if (authStore.loading) {
        return;
      }
      error.value = '';
      isClosingAllowed.value = true;
      emit('update:isOpen', false);
    };

    watch(
      () => props.isOpen,
      (newVal: boolean) => {
        if (newVal) {
          error.value = '';
          isClosingAllowed.value = false;
        } else if (!isClosingAllowed.value && !authStore.loading) {
          emit('update:isOpen', true);
        }
      }
    );

    // 监听 activeTab 变化
    watch(activeTab, () => {
      error.value = '';
    });

    return {
      activeTab,
      loginForm,
      registerForm,
      loading: authStore.loading,
      error,
      handleLogin,
      handleRegister,
      openModal,
      closeModal
    };
  }
});
</script>

<style>
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

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  background: none;
  border: none;
  color: var(--ion-color-dark);
  cursor: pointer;
  z-index: 1000;
}
</style>