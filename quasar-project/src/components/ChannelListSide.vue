<template>
  <!-- channels zoznam ako pop up spravene cez q-dialog -->
  <q-dialog v-model="localShowChannels" v-if="isSmallScreen" seamless position="left" class="channel-dialog">
    <q-card class="bg-yellow-1 q-pa-sm" style="width: 100%; width: 250px;">
      <q-list bordered>
        <q-item-label header>
          <div class="row items-center">
            <span>Channels</span>
            <q-space />
            <q-btn flat round dense icon="more_vert">
              <q-menu>
                <q-list style="min-width: 150px;">
                  <q-item clickable v-close-popup @click="emit('update:channelFilter', 'all')">
                    <q-item-section>All channels</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="emit('update:channelFilter', 'public')">
                    <q-item-section>Public channels</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="emit('update:channelFilter', 'private')">
                    <q-item-section>Private channels</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-item-label>
        <!-- vytvorenie channel -->
        <q-item clickable @click="emit('openCreateChannelDialog')" class="row reverse">       
            <q-item-section avatar>
                <q-icon name="add" color="primary" />
            </q-item-section>
            <q-item-section>Create Channel</q-item-section>
        </q-item>
        <q-item
          v-for="channel in channels"
          :key="channel.id"
          clickable
          @click="emit('selectChannel', channel)"
          :active="activeChannel?.id === channel.id && !activeFriend"
          active-class="bg-primary text-white"
        >
          <q-item-section>
            <div class="row items-center justify-between">
              <span>{{ channel.name }}</span>
              <q-icon v-if="channel.type === 'public'" class="material-symbols-outlined symbol">public</q-icon>
              <q-icon v-else class="material-symbols-outlined symbol">lock</q-icon>
            </div>
            <div v-if="channel.name === 'UniLife'" class="typing-indicator">
              <b class="typing-name text-caption text-grey-8">Milan is typing</b>
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>

  <!-- channels zoznam ako staticky panel na velkych obrazovkach -->
  <div v-else-if="showChannels" class="col-auto bg-yellow-1 q-pa-sm" style="width:250px;">
    <q-list bordered>
      <q-item-label header>
        <div class="row items-center">
          <span>Channels</span>
          <q-space />
          <q-btn flat round dense icon="more_vert">
            <q-menu>
              <q-list style="min-width: 150px;">
                <q-item clickable v-close-popup @click="emit('update:channelFilter', 'all')">
                  <q-item-section>All channels</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="emit('update:channelFilter', 'public')">
                  <q-item-section>Public channels</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="emit('update:channelFilter', 'private')">
                  <q-item-section>Private channels</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-item-label>
        <!-- vytvorenie channel -->
        <q-item clickable @click="emit('openCreateChannelDialog')" class="row reverse">       
            <q-item-section avatar>
                <q-icon name="add" color="primary" />
            </q-item-section>
            <q-item-section>Create Channel</q-item-section>
        </q-item>
      <q-item
        v-for="channel in channels"
        :key="channel.id"
        clickable
        @click="emit('selectChannel', channel)"
        :active="activeChannel?.id === channel.id && !activeFriend"
        active-class="bg-primary text-white"
      >
        <q-item-section>
          <div class="row items-center justify-between">
            <span>{{ channel.name }}</span>
            <q-icon v-if="channel.type === 'public'" class="material-symbols-outlined symbol">public</q-icon>
            <q-icon v-else class="material-symbols-outlined symbol">lock</q-icon>
          </div>
          <div v-if="channel.name === 'UniLife'" class="typing-indicator">
            <b class="typing-name text-caption text-grey-8">Milan is typing</b>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Channel {
  id: number;
  name: string;
  type: 'public' | 'private';
  messages: { id: number; user: string; text: string }[];
  members?: number[];
  isAdmin?: boolean;
}

interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'dnd' | 'offline';
  messages?: { id: number; user: string; text: string }[];
}

const props = defineProps<{
  showChannels: boolean;
  isSmallScreen: boolean;
  channels: Channel[];
  activeChannel: Channel | null;
  activeFriend: Friend | null;
}>();

const emit = defineEmits<{
  (e: 'update:showChannels', value: boolean): void;
  (e: 'update:channelFilter', value: 'all' | 'public' | 'private'): void;
  (e: 'selectChannel', channel: Channel): void;
  (e: 'openCreateChannelDialog'): void;
}>();

// lokalna kopia pre v-model v dialogu lebo v-model nefunguje 
const localShowChannels = ref(props.showChannels);

// sync s props , ak je zmena v props
watch(() => props.showChannels, (newVal) => {
  localShowChannels.value = newVal;
});

// emit zmeny spat napr. ked pouzivatel zatvori dialog manualne
watch(localShowChannels, (newVal) => {
  emit('update:showChannels', newVal);
});
</script>

<style scoped>


/* pop up s channels zatvaraci */
.channel-dialog .q-card {
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.typing-indicator {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 4px;
  gap: 3px;
}
.typing-name {
  margin-right: 4px;
}
.dot {
  width: 4px;
  height: 4px;
  background-color: #999;
  border-radius: 50%;
  animation: blink 1.2s infinite ease-in-out;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes blink {
  0%, 80%, 100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}
</style>