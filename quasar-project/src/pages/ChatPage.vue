<template>
  <q-page class="row no-wrap bg-grey-1">
    <!-- Sidebar na lavo -->
    <div class="column items-center bg-grey-3 q-pa-md" style="width: 100px;">
      <q-btn
        flat
        round
        icon="chat"
        :color="showFriends ? 'black' : 'primary'"
        class="q-mb-md"
        title="Chats"
        @click="toggleFriends"
      />
      <q-btn
        flat
        round
        icon="groups"
        :color="showChannels ? 'black' : 'primary'"
        class="q-mb-md"
        title="Channels"
        @click="toggleChannels"
      />

      <!-- Invitations -->
      <div class="relative-position q-mb-md">
        <q-btn flat round icon="mail" color="primary" title="Invitations" @click="openInvitations" />
        <q-badge v-if="invitationCount > 0" color="red" floating transparent>{{ invitationCount }}</q-badge>
      </div>
    </div>

    <!-- Hlavna cast chatu -->
    <div class="column col bg-white">
      <!-- freinds aby to nebolo take prazdne, na zvazenie ci to potrebujeme a chceme mat -->
      <div class="row justify-start items-center q-pa-md bg-grey-2">
        <div
          v-for="friend in friends"
          :key="friend.id"
          class="column items-center cursor-pointer q-mr-md"
          style="width: 60px;"
          @click="openFriendChat(friend)"
        >
          <ProfilePicture
            :avatar="friend.avatar"
            size="50px"
            bgColor="grey-3"
          />
          <div class="text-caption ellipsis">{{ friend.name }}</div>
        </div>


        <!-- Add friend tlačidlo -->
        <div class="column items-center justify-center cursor-pointer" @click="showAddFriendDialog = true">
          <q-avatar size="50px" color="grey-4" text-color="black">
            <q-icon name="add" />
          </q-avatar>
          <div class="text-caption">Add friends</div>
        </div>
      </div>

      <!-- hlavna chatova cast -->
      <div class="row col">
        <!-- channels zoznams -->
        <div v-if="showChannels" class="col-3 bg-grey-3 q-pa-sm" style="width: 250px; flex-shrink: 0;">
          <q-list bordered>
            <q-item-label header>Channels</q-item-label>
            <q-item
              v-for="channel in channels"
              :key="channel.id"
              clickable
              @click="selectChannel(channel)"
              :active="activeChannel?.id === channel.id && !activeFriend"
              active-class="bg-primary text-white"
            >
              <q-item-section>{{ channel.name }}</q-item-section>
            </q-item>

            <!-- vytvorenie channel -->
            <q-item clickable @click="showCreateChannelDialog = true">
              <q-item-section avatar><q-icon name="add" color="primary" /></q-item-section>
              <q-item-section>Create Channel</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- friends zoznam -->
        <div v-if="showFriends" class="col-3 bg-grey-3 q-pa-sm" style="width: 250px; flex-shrink: 0;">
          <q-list bordered>
            <q-item-label header>Friends</q-item-label>
            <q-item
              v-for="friend in friends"
              :key="friend.id"
              clickable
              @click="openFriendChat(friend)"
              :active="activeFriend?.id === friend.id"
              active-class="bg-primary text-white"
            >
              <ProfilePicture
                :avatar="friend.avatar"
                size="50px"
                bgColor="grey-3"
                class="q-mr-sm"
              />
              <q-item-section>{{ friend.name }}</q-item-section>
            </q-item>

            <q-item clickable @click="showAddFriendDialog = true">
              <q-item-section avatar><q-icon name="add" color="primary" /></q-item-section>
              <q-item-section>Add friends</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- chatting -->
        <div
          class="column relative-position"
          style="flex: 1;"
        >

        <!-- obsah chatu -->
        <div v-if="activeChannel || activeFriend" class="column" style="flex: 1;">
            <div class="q-pa-md row items-center justify-between">
            <div class="text-h6">
                {{ activeFriend ? activeFriend.name : activeChannel?.name }}
            </div>

            <!-- menu: only if channel -->
            <div v-if="activeChannel">
                <q-btn flat round dense icon="more_vert">
                <q-menu>
                    <q-list style="min-width: 150px;">
                    <q-item clickable v-close-popup @click="showAddPeopleDialog = true">
                        <q-item-section>Add people</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="showRemovePeopleDialog = true">
                        <q-item-section>Remove people</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="leaveChannel">
                        <q-item-section>Leave channel</q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-close-popup
                        v-if="activeChannel?.isAdmin"
                        @click="deleteChannel"
                    >
                        <q-item-section class="text-negative">Delete channel</q-item-section>
                    </q-item>
                    </q-list>
                </q-menu>
                </q-btn>
            </div>
            <div v-if="activeFriend">
                <q-btn flat round dense icon="more_vert">
                <q-menu>
                    <q-list style="min-width: 150px;">
                    <q-item clickable v-close-popup @click="showAddPeopleDialog = true">
                        <q-item-section class="text-negative" clickable v-close-popup @click="removeFriend(activeFriend.id)"
                        >Remove friend
                        </q-item-section>
                    </q-item>
                    </q-list>
                </q-menu>
                </q-btn>
            </div>
            </div>

            <q-separator />

            <!-- správy -->
            <div class="col scroll q-pa-md" style="flex: 1; overflow-y: auto;">
            <div v-for="msg in currentMessages" :key="msg.id" class="q-mb-sm">
                <b>{{ msg.user }}:</b> {{ msg.text }}
            </div>
            </div>
        </div>

        <!-- ak nič nie je vybrané -->
        <div v-else class="flex flex-center col text-grey" style="flex: 1; text-align: center;">
            <div>Select a channel or friend to start chatting</div>
        </div>

        <!-- fixný spodný riadok na odoslanie -->
        <div
          class="column bg-grey-2"
          style="position: sticky; bottom: 0; border-top: 1px solid #444;"
        >
          <!-- História správ -->
          <div
            ref="historyBox"
            class="message-history"
            style="
              max-height: 150px;
              overflow-y: auto;
              padding: 6px 12px;
              font-family: monospace;
              font-size: 14px;
              color: #222;
            "
          >
            <div v-for="(msg, index) in messages" :key="index">
              {{ msg }}
            </div>
          </div>

          <!-- Command line input -->
          <q-input
            ref="cliInput"
            v-model="newMessage"
            type="textarea"
            borderless
            autogrow
            input-class="command-input"
            input-style="padding-left: 12px;"
            :placeholder="showPlaceholder ? 'Enter a message' : ''"
            @focus="showPlaceholder = false"
            @blur="showPlaceholder = true"
            @keyup.enter.exact.prevent="sendMessage"
            @keyup.enter.shift.stop
          />


        </div>


        </div>

      </div>
    </div>

    <!-- dialogy -->
    <q-dialog v-model="showAddFriendDialog" persistent>
      <q-card style="min-width: 300px;">
        <q-card-section><div class="text-h6">Add new friend</div></q-card-section>
        <q-card-section><q-input v-model="newFriendName" label="Friend name" outlined dense autofocus /></q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="secondary" v-close-popup />
          <q-btn flat label="Add" color="primary" @click="addFriend" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showInvitationsDialog">
      <q-card style="min-width: 350px;">
        <q-card-section><div class="text-h6">Invitations</div></q-card-section>
        <q-list bordered separator>
          <q-item v-for="invite in invitations" :key="invite.id">
            <q-item-section>{{ invite.from }} invited you to {{ invite.channel }}</q-item-section>
            <q-item-section side>
              <q-btn dense flat color="primary" label="Accept" @click="acceptInvite(invite.id)" />
              <q-btn dense flat color="negative" label="Decline" @click="declineInvite(invite.id)" />
            </q-item-section>
          </q-item>
          <q-item v-if="invitations.length === 0"><q-item-section>No invitations yet</q-item-section></q-item>
        </q-list>
        <q-card-actions align="right"><q-btn flat label="Close" color="secondary" v-close-popup /></q-card-actions>
      </q-card>
    </q-dialog>

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

    <!-- pridaj/delete ludi z kanalov -->
    <q-dialog v-model="showAddPeopleDialog">
      <q-card style="min-width: 400px;">
        <q-card-section><div class="text-h6">Add people to {{ activeChannel?.name }}</div></q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedFriends"
            multiple
            :options="friends.map(f => ({ label: f.name, value: f.id }))"
            label="Select friends to add"
            outlined
            dense
            use-chips
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="secondary" v-close-popup />
          <q-btn flat label="Add" color="primary" @click="addPeopleToChannel" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showRemovePeopleDialog">
      <q-card style="min-width: 400px;">
        <q-card-section><div class="text-h6">Remove people from {{ activeChannel?.name }}</div></q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedFriends"
            multiple
            :options="getChannelMembers()"
            label="Select members to remove"
            outlined
            dense
            use-chips
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="secondary" v-close-popup />
          <q-btn flat label="Remove" color="negative" @click="removePeopleFromChannel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>



<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import ProfilePicture from '../components/ProfilePicture.vue';

interface Friend { id: number; name: string; avatar: string; messages?: Message[]; }
interface Message { id: number; user: string; text: string; }
interface Channel { id: number; name: string; messages: Message[]; members?: number[]; isAdmin?: boolean; }
interface Invitation { id: number; from: string; channel: string; }

//zobrazenie channel listu
const showChannels = ref(true); // defaultne true
const toggleChannels = () => {
  showChannels.value = !showChannels.value;
  if (showChannels.value) showFriends.value = false;
};

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
const currentMessages = computed(() => activeFriend.value?.messages || activeChannel.value?.messages || []);
const invitationCount = computed(() => invitations.value.length);

const showAddFriendDialog = ref(false);
const showInvitationsDialog = ref(false);
const showCreateChannelDialog = ref(false);
const showAddPeopleDialog = ref(false);
const showRemovePeopleDialog = ref(false);
const newFriendName = ref('');
const newChannelName = ref('');
const selectedFriends = ref<number[]>([]);

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
const getChannelMembers = () => {
  if (!activeChannel.value?.members) return [];
  return friends.value.filter(f => activeChannel.value!.members!.includes(f.id))
    .map(f => ({ label: f.name, value: f.id }));
};
const addPeopleToChannel = () => {
  if (!activeChannel.value) return;
  activeChannel.value.members = Array.from(new Set([...(activeChannel.value.members || []), ...selectedFriends.value]));
  showAddPeopleDialog.value = false;
  selectedFriends.value = [];
};
const removePeopleFromChannel = () => {
  if (!activeChannel.value) return;
    activeChannel.value.members = (activeChannel.value.members ?? []).filter(
    id => !selectedFriends.value.includes(id)
    );
  showRemovePeopleDialog.value = false;
  selectedFriends.value = [];
};

// CLI fixne
const historyBox = ref<HTMLElement | null>(null);
const newMessage = ref("");
const messages = ref<string[]>([]);
const showPlaceholder = ref(true);

function sendMessage() {
  const text = newMessage.value.trim();
  if (!text) return;

  // Ak správa začína "/", ide do CLI (ako príkaz)
  if (text.startsWith("/")) {
    messages.value.push(text);
  } else if (activeFriend.value || activeChannel.value) {
    // Získame správny cieľ (friend alebo channel)
    const target = activeFriend.value ?? activeChannel.value;

    if (target?.messages) {
      target.messages.push({
        id: Date.now(),
        user: "You",
        text
      });
    }
  } else {
    // Ak nič nie je otvorené, fallback do CLI
    messages.value.push(text);
  }

  newMessage.value = "";

  // Scroll CLI iba ak išlo do histórie
  void nextTick(() => {
    if (text.startsWith("/") && historyBox.value) {
      historyBox.value.scrollTop = historyBox.value.scrollHeight;
    }
  });
}
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
