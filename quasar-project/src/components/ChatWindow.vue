<template>
  <div class="column relative-position" style="flex: 1;">
    <ChatHeader
      :activeChannel="activeChannel"
      :activeFriend="activeFriend"
      @removeFriend="$emit('removeFriend', $event)"
      @showAddPeopleDialog="$emit('showAddPeopleDialog')"
      @showRemovePeopleDialog="$emit('showRemovePeopleDialog')"
      @leaveChannel="$emit('leaveChannel')"
      @deleteChannel="$emit('deleteChannel')"
    />
    <q-separator />
    <div class="col scroll q-pa-md" style="flex: 1; overflow-y: auto;" v-if="activeChannel || activeFriend">
      <ChatMessage :messages="currentMessages" />
    </div>
    <div v-else class="flex flex-center col text-grey" style="flex: 1; text-align:center;">
      <div>Select a channel or friend to start chatting</div>
    </div>
    <ChatInput :activeFriend="activeFriend" :activeChannel="activeChannel" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ChatHeader from './ChatHeader.vue';
import ChatInput from './ChatInput.vue';
import ChatMessage from './ChatMessages.vue';

import type { Channel, Friend } from '../types/types';

const props = defineProps<{
  activeChannel: Channel | null;
  activeFriend: Friend | null;
}>();

const currentMessages = computed(() => props.activeFriend?.messages || props.activeChannel?.messages || []);
</script>
