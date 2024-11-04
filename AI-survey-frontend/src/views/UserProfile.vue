<template>
  <ion-page>
    <app-header />
    
    <ion-content>
      <div class="profile-container">
        <!-- User Info -->
        <div class="user-header">
          <h1>My Surveys</h1>
          <div class="buttons">
            <ion-button @click="returnToHome" class="capitalize">
              Return to Home
            </ion-button>
            <ion-button router-link="/create" class="capitalize">
              Create New Survey
            </ion-button>
          </div>
        </div>

        <!-- User's Surveys List -->
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="4" v-for="survey in userSurveys" :key="survey.id">
              <ion-card>
                <ion-card-header>
                  <ion-card-title>{{ survey.title }}</ion-card-title>
                  <ion-card-subtitle>{{ formatDate(survey.createdAt) }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  <p>Responses: {{ survey.responses }}</p>
                  <ion-button fill="clear" @click="viewResults(survey.id)">
                    View Results
                  </ion-button>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, 
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton
} from '@ionic/vue';
import AppHeader from '@/components/common/AppHeader.vue';
import { useSurveyStore } from '@/stores/survey';
import type { Survey } from '@/types/survey';

export default defineComponent({
  name: 'UserProfile',
  components: {
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    AppHeader
  },
  setup() {
    const router = useRouter();
    const surveyStore = useSurveyStore();
    const userSurveys = ref<Survey[]>([]);

    const loadUserSurveys = async () => {
      try {
        userSurveys.value = await surveyStore.getUserSurveys();
      } catch (error) {
        console.error('Failed to load user surveys:', error);
      }
    };

    const viewResults = (surveyId: string) => {
      router.push(`/survey/${surveyId}/results`);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString();
    };

    const returnToHome = () => {
      router.push('/home');
    };

    onMounted(loadUserSurveys);

    return {
      userSurveys,
      viewResults,
      formatDate,
      returnToHome
    };
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.buttons {
  display: flex;
  gap: 1rem;
}

.capitalize {
  text-transform: capitalize;
}

.user-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--ion-color-dark);
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
}
</style>
