<template>
  <q-list bordered>
    <q-item-label header>Channels</q-item-label>
    <q-item
      v-for="channel in channels"
      :key="channel.id"
      clickable
      @click="$emit('selectChannel', channel)"
      :active="activeChannel?.id === channel.id && !activeFriend"
      active-class="bg-primary text-white"
    >
      <q-item-section>{{ channel.name }}</q-item-section>
    </q-item>
      

    <q-item clickable @click="$emit('showCreateChannelDialog')">
      <q-item-section avatar><q-icon name="add" color="primary" /></q-item-section>
      <q-item-section>Create Channel</q-item-section>
    </q-item>

  </q-list>
</template>

<script setup lang="ts">
import type { Channel, Friend } from '../types/types';

defineProps<{
  channels: Channel[];
  activeChannel: Channel | null;
  activeFriend: Friend | null;
}>();
</script>
