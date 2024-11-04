<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Why AI Ethics Matters</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="container">
          <h1>Why AI Ethics Matters</h1>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
  
  export default defineComponent({
    name: 'WhyEthicsPage',
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent }
  })
  </script>