<template>
  <div class="column items-center bg-grey-3 q-pa-md" style="width: 100px;">
    <q-btn
      flat round icon="chat"
      :color="showFriends ? 'black' : 'primary'"
      class="q-mb-md"
      title="Chats"
      @click="$emit('toggleFriends')"
    />
    <q-btn
      flat round icon="groups"
      :color="showChannels ? 'black' : 'primary'"
      class="q-mb-md"
      title="Channels"
      @click="$emit('toggleChannels')"
    />
    <div class="relative-position q-mb-md">
      <q-btn flat round icon="mail" color="primary" title="Invitations" @click="$emit('openInvitations')" />
      <q-badge v-if="invitationCount > 0" color="red" floating transparent>{{ invitationCount }}</q-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  showFriends: boolean;
  showChannels: boolean;
  invitationCount: number;
}>();
</script>
