<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const authStore = useAuthStore();

    // 页面加载时检查登录状态
    onMounted(async () => {
      await authStore.checkAuth();
    });
  }
});
</script>

<style>
/* Global styles */
:root {
  /* Primary color for AI Ethics theme */
  --ion-color-primary: #0040ff;
  --ion-color-primary-rgb: 0, 64, 255;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #0038e0;
  --ion-color-primary-tint: #1a53ff;
}

.container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-weight: 600;
}

/* Utility classes */
.text-center {
  text-align: center;
}

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 2rem; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-5 { margin-bottom: 2rem; }
</style>
