<template>
  <!-- friends zoznam ako pop up spravene cez q-dialog -->
  <q-dialog v-model="localShowFriends" v-if="isSmallScreen" seamless position="left" class="friend-dialog">
    <q-card class="bg-yellow-1 q-pa-sm" style="width: 100%; width: 250px;">
      <q-list bordered>
        <q-item-label header>
          <div class="row items-center">
            <span>Friends</span>
            <q-space />
            <q-btn flat round dense icon="more_vert">
              <q-menu>
                <q-list style="min-width: 150px;">
                  <q-item clickable v-close-popup @click="emit('update:friendFilter', 'all')">
                    <q-item-section>All friends</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="emit('update:friendFilter', 'online')">
                    <q-item-section>Online friends</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="emit('update:friendFilter', 'offline')">
                    <q-item-section>Offline friends</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="emit('update:friendFilter', 'dnd')">
                    <q-item-section>Do not disturb friends</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-item-label>
        <!-- pridanie priatela -->
        <q-item clickable @click="emit('openAddFriendDialog')" class="row reverse">
          <q-item-section avatar>
            <q-icon name="add" color="primary" />
          </q-item-section>
          <q-item-section>Add friends</q-item-section>
        </q-item>
        <q-item
          v-for="friend in friends"
          :key="friend.id"
          clickable
          @click="emit('selectFriend', friend)"
          :active="activeFriend?.id === friend.id"
          active-class="bg-primary text-white"
        >
          <q-item-section avatar>
            <div class="relative-position q-mr-sm">
              <ProfilePicture :avatar="friend.avatar" size="50px" bgColor="grey-3" />
              <div class="status-indicator" :class="`status-${friend.status}`"></div>
            </div>
          </q-item-section>
          <q-item-section>
            {{ friend.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>

  <!-- friends zoznam ako staticky panel na velkych obrazovkach -->
  <div v-else-if="showFriends" class="col-auto bg-yellow-1 q-pa-sm" style="width: 250px">
    <q-list bordered>
      <q-item-label header>
        <div class="row items-center">
          <span>Friends</span>
          <q-space />
          <q-btn flat round dense icon="more_vert">
            <q-menu>
              <q-list style="min-width: 150px;">
                <q-item clickable v-close-popup @click="emit('update:friendFilter', 'all')">
                  <q-item-section>All friends</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="emit('update:friendFilter', 'online')">
                  <q-item-section>Online friends</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="emit('update:friendFilter', 'offline')">
                  <q-item-section>Offline friends</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="emit('update:friendFilter', 'dnd')">
                  <q-item-section>Do not disturb friends</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-item-label>
      <!-- pridanie priatela -->
      <q-item clickable @click="emit('openAddFriendDialog')" class="row reverse">
        <q-item-section avatar>
          <q-icon name="add" color="primary" />
        </q-item-section>
        <q-item-section>Add friends</q-item-section>
      </q-item>
      <q-item
        v-for="friend in friends"
        :key="friend.id"
        clickable
        @click="emit('selectFriend', friend)"
        :active="activeFriend?.id === friend.id"
        active-class="bg-primary text-white"
      >
        <q-item-section avatar>
          <div class="relative-position q-mr-sm">
            <ProfilePicture :avatar="friend.avatar" size="50px" bgColor="grey-3" />
            <div class="status-indicator" :class="`status-${friend.status}`"></div>
          </div>
        </q-item-section>
        <q-item-section>
          {{ friend.name }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ProfilePicture from './ProfilePicture.vue';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'dnd' | 'offline';
  messages?: { id: number; user: string; text: string }[];
}

const props = defineProps<{
  showFriends: boolean;
  isSmallScreen: boolean;
  friends: Friend[];
  activeFriend: Friend | null;
}>();

const emit = defineEmits<{
  (e: 'update:showFriends', value: boolean): void;
  (e: 'update:friendFilter', value: 'all' | 'online' | 'offline' | 'dnd'): void;
  (e: 'selectFriend', friend: Friend): void;
  (e: 'openAddFriendDialog'): void;
}>();

// Lokálna kópia pre v-model v dialogu
const localShowFriends = ref(props.showFriends);

// Sync s props
watch(() => props.showFriends, (newVal) => {
  localShowFriends.value = newVal;
});

// Emit zmeny spat
watch(localShowFriends, (newVal) => {
  emit('update:showFriends', newVal);
});
</script>

<style scoped>
/* Pop up s friends */
.friend-dialog .q-card {
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  position: absolute;
  bottom: 2px;
  right: 2px;
}
.status-online { background-color: #4CAF50; }
.status-dnd { background-color: #F44336; }
.status-offline { background-color: #9E9E9E; }
</style>