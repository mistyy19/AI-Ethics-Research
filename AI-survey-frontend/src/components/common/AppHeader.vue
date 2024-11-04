<template>
  <ion-header>
    <ion-toolbar>
      <div class="left-section">
        <ion-buttons slot="start">
          <ion-button router-link="/home">
            <div class="logo-container">
              <div class="logo-circle"></div>
              <span class="logo-text">AI Ethics Research</span>
            </div>
          </ion-button>
        </ion-buttons>
        
        <!-- Account -->
        <ion-buttons class="auth-buttons">
          <template v-if="isAuthenticated">
            <ion-button router-link="/user-profile" class="nav-link">My Surveys</ion-button>
            <ion-button @click="handleLogout" class="nav-link">Logout</ion-button>
          </template>
          <template v-else>
            <ion-button @click="handleAccount" class="nav-link">Account</ion-button>
          </template>
        </ion-buttons>
      </div>
      
      <ion-buttons slot="end" class="nav-buttons">
        <ion-button router-link="/why-ethics" class="nav-link">Why AI Ethics Matters</ion-button>
        <ion-button router-link="/about" class="nav-link">About the Researchers</ion-button>
        <!-- Create button now checks authentication before routing -->
        <ion-button @click="handleCreate" class="nav-link">Create</ion-button>
        <ion-button router-link="/judge" class="start-judging-btn" fill="solid">Start Judging!</ion-button>
      </ion-buttons>
    </ion-toolbar>

    <!-- Auth Dialog with redirectRoute -->
    <auth-dialog
      v-model:is-open="isAuthDialogOpen"
      @auth-success="handleAuthSuccess"
      :redirectRoute="redirectRoute"
    />
  </ion-header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonButton,
  alertController
} from '@ionic/vue';
import { useAuthStore } from '@/stores/auth';
import AuthDialog from '@/components/auth/AuthDialog.vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AppHeader',
  components: {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    AuthDialog
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { isAuthenticated } = storeToRefs(authStore);
    
    const isAuthDialogOpen = ref(false);
    const redirectRoute = ref<string | undefined>(undefined);

    const openAuthDialog = () => {
      isAuthDialogOpen.value = true;
    };

    const handleAuthSuccess = () => {
      isAuthDialogOpen.value = false;
      redirectRoute.value = undefined; 
    };

    const handleLogout = async () => {
      const alert = await alertController.create({
        header: 'Confirm Logout',
        message: 'Are you sure you want to logout?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Logout',
            role: 'confirm',
            handler: () => {
              authStore.logout();
              router.push('/home');
            }
          }
        ]
      });

      await alert.present();
    };

    const handleCreate = () => {
      if (isAuthenticated.value) {
        router.push('/create');
      } else {
        redirectRoute.value = '/create'; 
        openAuthDialog();
      }
    };

    const handleAccount = () => {
      if (isAuthenticated.value) {
        router.push('/user-profile');
      } else {
        redirectRoute.value = '/user-profile'; 
        openAuthDialog();
      }
    };

    return {
      isAuthenticated,
      isAuthDialogOpen,
      redirectRoute,
      openAuthDialog,
      handleAuthSuccess,
      handleLogout,
      handleCreate,
      handleAccount
    };
  }
});
</script>


<style scoped>
.left-section {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--ion-color-primary);
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--ion-color-dark);
  text-transform: capitalize;
}

.auth-buttons {
  margin-left: 16px;
}

.nav-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-link {
  --color: var(--ion-color-dark);
  font-weight: 500;
  text-transform: capitalize;
}

.start-judging-btn {
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 28px;
  --padding-start: 24px;
  --padding-end: 24px;
  --border-width: 0;      
  --background-activated: var(--ion-color-primary);  
  --background-focused: var(--ion-color-primary); 
  --background-hover: var(--ion-color-primary-tint); 
  height: 48px;
  margin: 0 8px;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: 0 4px 12px rgba(100, 149, 237, 0.2);
  transition: all 0.3s ease;
}

.start-judging-btn:hover {
  --background: var(--ion-color-primary-tint);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(100, 149, 237, 0.3);
}
</style>