<template>
  <q-page class="row no-wrap bg-grey-1">
    <ChatSidebar
      :showFriends="showFriends"
      :showChannels="showChannels"
      :invitationCount="invitationCount"
      @toggleFriends="toggleFriends"
      @toggleChannels="toggleChannels"
      @openInvitations="openInvitations"
    />
    <div class="column col bg-white">
      <div class="row justify-start items-center q-pa-md bg-grey-2">
        <div v-for="friend in friends" :key="friend.id" class="column items-center cursor-pointer q-mr-md" style="width:60px" @click="openFriendChat(friend)">
          <ProfilePicture :avatar="friend.avatar" size="50px" bgColor="grey-3" />
          <div class="text-caption ellipsis">{{ friend.name }}</div>
        </div>
        <div class="column items-center justify-center cursor-pointer" @click="showAddFriendDialog = true">
          <q-avatar size="50px" color="grey-4" text-color="black"><q-icon name="add" /></q-avatar>
          <div class="text-caption">Add friends</div>
        </div>
      </div>
      <div class="row col">
        <ChannelList 
          :channels="channels" 
          :activeChannel="activeChannel" 
          :activeFriend="activeFriend" 
          @selectChannel="selectChannel" 
          @showCreateChannelDialog="showCreateChannelDialog = true"
        />
         <!-- create channel -->
        <q-dialog v-model="showCreateChannelDialog">
          <q-card style="min-width: 400px;">
            <q-card-section><div class="text-h6">Create Channel</div></q-card-section>
            <q-card-section>
              <q-input v-model="newChannelName" label="Channel name" outlined dense />
              <q-select
                v-model="selectedFriends"
                multiple
                :options="friends.map(f => ({ label: f.name, value: f.id }))"
                label="Invite people"
                outlined
                dense
                use-chips
                class="q-mt-md"
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="secondary" v-close-popup />
              <q-btn flat label="Create" color="primary" @click="createChannel" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        
        <FriendList 
          v-if="showFriends" :friends="friends" 
          :activeFriend="activeFriend" 
          @openFriendChat="openFriendChat" 
          @showAddFriendDialog="showAddFriendDialog = true"
        />
        <ChatWindow
          :activeChannel="activeChannel"
          :activeFriend="activeFriend"
          :channels="channels"
          @deleteChannel="deleteChannel"
          @leaveChannel="leaveChannel"
          @showAddPeopleDialog="showAddPeopleDialog = true"
          @showRemovePeopleDialog="showRemovePeopleDialog = true"
          @removeFriend="removeFriend"
        />
      </div>
    </div>
    <ChatDialogs
      :addFriendDialog="showAddFriendDialog"
      :invitations="invitations"
      :invitationsDialog="showInvitationsDialog"
      @addFriend="addFriend"
      @acceptInvite="acceptInvite"
      @declineInvite="declineInvite"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import FriendList from 'src/components/FriendList.vue';
import ChannelList from 'src/components/ChannelList.vue';
import ChatWindow from 'src/components/ChatWindow.vue';
import ProfilePicture from 'src/components/ProfilePicture.vue';
import type { Friend, Channel, Invitation } from '../types/types';
import ChatSidebar from 'src/components/ChatSidebar.vue';
import ChatDialogs from 'src/components/ChatDialogs.vue';

//zobrazenie channel listu
const showChannels = ref(true); // defaultne true
const toggleChannels = () => {
  showChannels.value = !showChannels.value;
  if (showChannels.value) showFriends.value = false;
};

// const showCreateChannelDialog = ref(false);
const newChannelName = ref('');
const selectedFriends = ref<number[]>([]);

// ukazanie friends listu
const showFriends = ref(false);
const toggleFriends = () => {
  showFriends.value = !showFriends.value;
  if (showFriends.value) showChannels.value = false;
};

const friends = ref<Friend[]>([
    // zmenit im profilovky to je strasne
  { id: 1, name: 'Milan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg', messages: [] },
  { id: 2, name: 'Katka', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', messages: [] },
  { id: 3, name: 'Kubo', avatar: 'https://cdn.quasar.dev/img/avatar3.jpg', messages: [] },
  { id: 4, name: 'Maggie', avatar: 'https://cdn.quasar.dev/img/avatar4.jpg', messages: [] },
]);
const channels = ref<Channel[]>([
  { id: 1, name: 'General', messages: [], members: [1, 2, 3], isAdmin: true },
  { id: 2, name: 'UniLife', messages: [], members: [2, 3] },
]);


const invitations = ref<Invitation[]>([{ id: 1, from: 'Tomas', channel: 'Developers' }]);

const activeChannel = ref<Channel | null>(null);
const activeFriend = ref<Friend | null>(null);
// const currentMessages = computed(() => activeFriend.value?.messages || activeChannel.value?.messages || []);
const invitationCount = computed(() => invitations.value.length);

const showAddFriendDialog = ref(false);
const showInvitationsDialog = ref(false);
const showCreateChannelDialog = ref(false);
const showAddPeopleDialog = ref(false);
const showRemovePeopleDialog = ref(false);
const newFriendName = ref('');
// const newChannelName = ref('');
// const selectedFriends = ref<number[]>([]);

const selectChannel = (ch: Channel) => {
  if (activeChannel.value?.id === ch.id) {
    activeChannel.value = null;  // zrušíme výber, zobrazí sa placeholder
  } else {
    activeFriend.value = null;
    activeChannel.value = ch;
  }
};

const openFriendChat = (f: Friend) => {
if (activeFriend.value?.id === f.id) {
    activeFriend.value = null;   // zrušíme výber, zobrazí sa placeholder
  } else {
    activeChannel.value = null;
    activeFriend.value = f;
  }
};

const addFriend = () => {
  const name = newFriendName.value.trim();
  if (!name) return;
  const newFr: Friend = {
    id: friends.value.length + 1,
    name,
    avatar: 'https://cdn.quasar.dev/img/avatar.png',
    messages: [],
  };
  friends.value.unshift(newFr);
  activeFriend.value = newFr;
  newFriendName.value = ''; showAddFriendDialog.value = false;
};
const removeFriend = (id: number) => {
  friends.value = friends.value.filter(f => f.id !== id);
  if (activeFriend.value?.id === id) activeFriend.value = null;
};

const openInvitations = () => (showInvitationsDialog.value = true);

const acceptInvite = (id: number) => {
  const inv = invitations.value.find(i => i.id === id);
  const newCh: Channel = {
    id: channels.value.length + 1,
    name: inv?.channel || 'New Channel',
    messages: [],
  };
  if (inv) channels.value.unshift(newCh);
  activeChannel.value = newCh;
  invitations.value = invitations.value.filter(i => i.id !== id);
};
const declineInvite = (id: number) => (invitations.value = invitations.value.filter(i => i.id !== id));

const createChannel = () => {
  const name = newChannelName.value.trim();
  if (!name) return;
  const newCh: Channel = {
    id: channels.value.length + 1,
    name,
    messages: [],
    members: selectedFriends.value,
    isAdmin: true,
    };
  channels.value.unshift(newCh);
  activeChannel.value = newCh;
  newChannelName.value = '';
  selectedFriends.value = [];
  showCreateChannelDialog.value = false;
};

const leaveChannel = () => {
  if (!activeChannel.value) return;
  channels.value = channels.value.filter(ch => ch.id !== activeChannel.value!.id);
  activeChannel.value = null;
};
const deleteChannel = () => {
  if (!activeChannel.value) return;
  channels.value = channels.value.filter(ch => ch.id !== activeChannel.value!.id);
  activeChannel.value = null;
};
// const getChannelMembers = () => {
//   if (!activeChannel.value?.members) return [];
//   return friends.value.filter(f => activeChannel.value!.members!.includes(f.id))
//     .map(f => ({ label: f.name, value: f.id }));
// };
// const addPeopleToChannel = () => {
//   if (!activeChannel.value) return;
//   activeChannel.value.members = Array.from(new Set([...(activeChannel.value.members || []), ...selectedFriends.value]));
//   showAddPeopleDialog.value = false;
//   selectedFriends.value = [];
// };
// const removePeopleFromChannel = () => {
//   if (!activeChannel.value) return;
//     activeChannel.value.members = (activeChannel.value.members ?? []).filter(
//     id => !selectedFriends.value.includes(id)
//     );
//   showRemovePeopleDialog.value = false;
//   selectedFriends.value = [];
// };



</script>

<style scoped>
.scroll { overflow-y: auto; height: 100%; }
.relative-position { position: relative; }
.command-input {
  font-family: monospace;
  max-height: 150px; 
  overflow-y: auto;
}
</style>