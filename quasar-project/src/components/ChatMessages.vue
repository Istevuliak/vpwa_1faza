<template>
  <div class="col scroll q-pa-md" style="flex: 1; overflow-y: auto;">
    <div v-for="msg in messages" :key="msg.id" class="q-mb-sm">
      <b>{{ msg.user }}:</b> {{ msg.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Message } from '../types/types';

defineProps({
  messages: Array as () => Message[]
});
</script>
