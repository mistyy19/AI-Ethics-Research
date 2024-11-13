<template>
  <ion-page>
    <app-header />
    <ion-content>
      <section class="judge-survey-section">
        <div class="judge-survey-content">
          <h1>Judge</h1>

          <!-- Search Section -->
          <div class="search-section">
            <ion-item class="search-box">
              <ion-label position="stacked">Search Surveys</ion-label>
              <ion-input
                v-model="searchQuery"
                placeholder="Enter survey ID or keywords (location, context, etc.)"
                @ionInput="handleSearch"
                clear-input
              ></ion-input>
            </ion-item>
          </div>

          <!-- Results Section -->
          <div class="results-section">
            <div v-if="loading" class="loading-state">
              <ion-spinner></ion-spinner>
              <p>Searching surveys...</p>
            </div>

            <div v-else-if="error" class="error-state">
              <p>{{ error }}</p>
            </div>

            <div v-else-if="surveys.length === 0" class="empty-state">
              <p>No surveys found. Try different search terms.</p>
            </div>

            <!-- Survey Cards -->
            <div v-else class="survey-cards">
              <ion-card v-for="survey in surveys" :key="survey.id" class="survey-card">
                <img :src="survey.imageUrl" alt="Survey context image" class="survey-image"/>
                <ion-card-header>
                  <ion-card-subtitle>ID: {{ survey.id }}</ion-card-subtitle>
                  <ion-card-title>{{ survey.location }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <p class="survey-context">{{ truncateText(survey.context, 150) }}</p>
                  <p class="survey-person">Related to: {{ survey.person }}</p>
                  <div class="survey-stats">
                    <span>
                      <ion-icon :icon="peopleOutline"></ion-icon>
                      {{ survey.participantCount }} participants
                    </span>
                  </div>
                  <ion-button expand="block" @click="startJudging(survey.id)" class="judge-btn">
                    Start Judging
                  </ion-button>
                </ion-card-content>
              </ion-card>
            </div>

            <!-- Load More Button -->
            <ion-button 
              v-if="hasMoreSurveys" 
              expand="block" 
              @click="loadMore" 
              class="load-more-btn"
              :disabled="loading"
            >
              {{ loading ? 'Loading...' : 'Load More' }}
            </ion-button>
          </div>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { 
  IonPage, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonIcon
} from '@ionic/vue';
import { peopleOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

interface Survey {
  id: string;
  location: string;
  context: string;
  person: string;
  imageUrl: string;
  participantCount: number;
}

export default defineComponent({
  name: 'JudgeSurveys',
  components: {
    IonPage,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonSpinner,
    IonIcon,
    AppHeader
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const surveys = ref<Survey[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const hasMoreSurveys = ref(false);
    const currentPage = ref(1);
    const pageSize = 10;

    const handleSearch = async () => {
      try {
        loading.value = true;
        error.value = null;
        currentPage.value = 1;

        const response = await api.get('/api/surveys/search', {
          params: {
            query: searchQuery.value,
            page: currentPage.value,
            size: pageSize
          }
        });

        surveys.value = response.data.content;
        hasMoreSurveys.value = !response.data.last;
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to search surveys';
        surveys.value = [];
      } finally {
        loading.value = false;
      }
    };

    const loadMore = async () => {
      try {
        loading.value = true;
        currentPage.value += 1;

        const response = await api.get('/api/surveys/search', {
          params: {
            query: searchQuery.value,
            page: currentPage.value,
            size: pageSize
          }
        });

        surveys.value = [...surveys.value, ...response.data.content];
        hasMoreSurveys.value = !response.data.last;
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to load more surveys';
      } finally {
        loading.value = false;
      }
    };

    const startJudging = (surveyId: string) => {
      router.push(`/judge/${surveyId}`);
    };

    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    // 初始加载
    onMounted(async () => {
      await handleSearch();
    });

    return {
      searchQuery,
      surveys,
      loading,
      error,
      hasMoreSurveys,
      handleSearch,
      loadMore,
      startJudging,
      truncateText,
      peopleOutline
    };
  }
});
</script>

<style scoped>
.judge-survey-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.judge-survey-content {
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

.search-section {
  margin-bottom: 2rem;
}

.search-box {
  --background: #f8f9fa;
  --border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.search-type-segment {
  margin-bottom: 1rem;
}

.results-section {
  margin-top: 2rem;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 2rem;
}

.survey-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.survey-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;
}

.survey-card:hover {
  transform: translateY(-4px);
}

.survey-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.survey-context {
  margin: 1rem 0;
  color: var(--ion-color-medium);
}

.survey-person {
  font-weight: 500;
  color: var(--ion-color-dark);
}

.survey-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  color: var(--ion-color-medium);
}

.judge-btn {
  --background: var(--ion-color-primary);
  --border-radius: 28px;
  margin-top: 1rem;
}

.load-more-btn {
  --background: var(--ion-color-medium);
  --border-radius: 28px;
  margin: 2rem auto;
  max-width: 200px;
}

ion-spinner {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .judge-survey-section {
    padding: 1rem;
  }

  .survey-cards {
    grid-template-columns: 1fr;
  }
}
</style>