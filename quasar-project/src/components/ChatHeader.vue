<template>
  <div class="q-pa-md row items-center justify-between">
    <div class="text-h6">{{ activeFriend ? activeFriend.name : activeChannel?.name }}</div>

    <!-- Channel menu -->
    <div v-if="activeChannel">
      <q-btn flat round dense icon="more_vert">
        <q-menu>
          <q-list style="min-width: 150px;">
            <q-item clickable v-close-popup @click="$emit('showAddPeopleDialog')">
              <q-item-section>Add people</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="$emit('showRemovePeopleDialog')">
              <q-item-section>Remove people</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="$emit('leaveChannel')">
              <q-item-section>Leave channel</q-item-section>
            </q-item>
            <q-item
              clickable v-close-popup
              v-if="activeChannel?.isAdmin"
              @click="$emit('deleteChannel')"
            >
              <q-item-section class="text-negative">Delete channel</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- Friend menu -->
    <div v-if="activeFriend">
      <q-btn flat round dense icon="more_vert">
        <q-menu>
          <q-list style="min-width: 150px;">
            <q-item clickable v-close-popup @click="$emit('removeFriend', activeFriend.id)">
              <q-item-section class="text-negative">Remove friend</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Channel, Friend } from '../types/types';

defineProps<{
  activeChannel: Channel | null;
  activeFriend: Friend | null;
}>();
</script>
