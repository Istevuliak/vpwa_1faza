<template>
  <div class="q-pa-md">
    <h1>Ahoj Quasar 💎</h1>
    <q-btn color="primary" label="Klikni ma!" @click="clicked = !clicked" />
    <p v-if="clicked">Klikla si na tlačidlo 🎉</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const clicked = ref(false)
</script>
