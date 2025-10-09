<template>
  <div
    class="column items-center cursor-pointer"
    style="width: 60px;"
    @click="$emit('click', friend)"
  >
    <q-avatar :size="size" :color="bgColor">
      <img v-if="friend.avatar" :src="friend.avatar" alt="avatar" />
      <q-icon v-else name="person" color="grey-7" />
    </q-avatar>
    <div class="text-caption ellipsis">{{ friend.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Friend {
  id: number
  name: string
  avatar?: string
}

defineProps<{
  friend: Friend
  size?: string
  bgColor?: string
}>()
</script>

<style scoped>
.ellipsis {
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
