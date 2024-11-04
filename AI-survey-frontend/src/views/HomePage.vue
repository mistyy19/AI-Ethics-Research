<template>
  <ion-page>
    <app-header />
    
    <ion-content>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <p class="exciting-text">Exciting Research!</p>
          <h1>Help shape the way AI is designed</h1>
          <p class="subtitle">
            Our research aims to inform industry players on what ethical AI designs matter most to consumers
          </p>
          <ion-button 
            @click="goToJudge()" 
            class="start-judging-btn" 
            size="large"
          >
            Start Judging
          </ion-button>
        </div>
        <div class="hero-image">
          <img :src="robotImage" alt="AI Robot" />
        </div>
      </section>

      <!-- Contexts Section -->
      <section class="contexts-section">
        <h2>Different contexts</h2>
        <p class="section-subtitle">Choose one study context to get started</p>
        
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="3" v-for="context in contexts" :key="context.title">
              <ion-card class="context-card" @click="navigateToContext(context.route)">
                <ion-card-header>
                  <ion-card-title>{{ context.title }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-button fill="clear">Learn more</ion-button>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { Router } from 'vue-router'
import { useRouter } from 'vue-router'
import { 
  IonPage, 
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/vue'
import AppHeader from '@/components/common/AppHeader.vue'

// import robotImage from '@/assets/images/robot.jpg'

interface Context {
  title: string;
  route: string;
}

export default defineComponent({
  name: 'HomePage',
  components: {
    AppHeader,
    IonPage,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  },
  setup() {
    const router: Router = useRouter()
    const robotImage = ref('')  // 暂时用空字符串替代
    
    const contexts: Context[] = [
      {
        title: 'Embedded AI in Healthcare settings',
        route: '/judge?context=healthcare'
      },
      {
        title: 'Self-driving Cars',
        route: '/judge?context=cars'
      },
      {
        title: 'Embedded AI in financial application contexts',
        route: '/judge?context=finance'
      },
      {
        title: 'Chatbots in Education settings',
        route: '/judge?context=education'
      }
    ]

    const navigateToContext = (route: string): void => {
      router.push(route)
    }

    const goToJudge = (): void => {
      router.push('/judge')
    }

    return {
      robotImage,
      contexts,
      navigateToContext,
      goToJudge
    }
  }
})
</script>

<style scoped>
.hero-section {
  display: flex;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.hero-content {
  flex: 1;
  padding-right: 2rem;
}

.exciting-text {
  color: var(--ion-color-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  color: var(--ion-color-dark);
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--ion-color-medium);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.hero-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  border-radius: 12px;
}

.contexts-section {
  padding: 2rem 2rem;
  background-color: var(--ion-color-light);
  text-align: center;
}

.contexts-section h2 {
  font-size: 2.5rem;
  color: var(--ion-color-dark);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: var(--ion-color-medium);
  margin-bottom: 1rem;
}

.context-card {
  cursor: pointer;
  transition: transform 0.2s;
  background-color: white;
  border-radius: 12px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1rem;
  text-align: left;
}

.context-card ion-card-header {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: top;
  padding-top: 1rem;
  width: 100%;
}

.context-card ion-card-title {
  font-size: 1.3rem;
  line-height: 1.4;
  color: var(--ion-color-dark);
  margin-top: 0;
  text-align: left;
}

.context-card ion-card-content {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
}

.context-card ion-card-content ion-button {
  --text-transform: capitalize;
  text-transform: capitalize;  
}

.context-card:hover {
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 2rem 1rem;
  }

  .hero-content {
    padding-right: 0;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }
}

.start-judging-btn {
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 28px;
  --padding-start: 24px;
  --padding-end: 24px;
  height: 48px;
  margin: 0 8px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(100, 149, 237, 0.2);
  transition: all 0.3s ease;
}

.start-judging-btn:hover {
  --background: var(--ion-color-primary-tint);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(100, 149, 237, 0.3);
}
</style>