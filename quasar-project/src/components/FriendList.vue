<template>
  <q-list bordered>
    <q-item-label header>Friends</q-item-label>
    <q-item
      v-for="friend in friends"
      :key="friend.id"
      clickable
      @click="$emit('openFriendChat', friend)"
      :active="activeFriend?.id === friend.id"
      active-class="bg-primary text-white"
    >
      <ProfilePicture :avatar="friend.avatar" size="50px" bgColor="grey-3" class="q-mr-sm"/>
      <q-item-section>{{ friend.name }}</q-item-section>
    </q-item>

    <q-item clickable @click="$emit('showAddFriendDialog')">
      <q-item-section avatar><q-icon name="add" color="primary" /></q-item-section>
      <q-item-section>Add friends</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import ProfilePicture from '../components/ProfilePicture.vue';
import type { Friend } from '../types/types';

defineProps<{
  friends: Friend[];
  activeFriend: Friend | null;
}>();
</script>
