<template>
  <q-page class="row no-wrap bg-secondary">
    <!-- Sidebar na lavo -->
    <div class="column items-center bg-secondary q-pa-md" style="width: 100px;">
      <q-btn
        flat
        round
        icon="chat"
        :color="showFriends ? 'bg-yellow-8' : 'primary'"
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
      <div class="row justify-start items-center q-pa-md bg-yellow-2">
        <div
          v-for="friend in friends"
          :key="friend.id"
          class="column items-center cursor-pointer q-mr-md"
          style="width: 60px;"
          @click="openFriendChat(friend)"
        >
          <div class="relative-position">
            <ProfilePicture
              :avatar="friend.avatar"
              size="50px"
              bgColor="grey-3"
            />
            <div class="status-indicator" :class="`status-${friend.status}`"></div>
          </div>
          <div class="text-caption ellipsis">{{ friend.name }}</div>
        </div>

        <!-- Add friend tlačidlo -->
        <div class="column items-center justify-center cursor-pointer" @click="showAddFriendDialog = true">
          <q-avatar size="50px" color="yellow-8" text-color="black">
            <q-icon name="add" />
          </q-avatar>
          <div class="text-caption">Add friends</div>
        </div>
      </div>

      <!-- hlavna chatova cast -->
      <div class="row col">
        <!-- channels zoznams -->
        <div v-if="showChannels" class="col-3 bg-yellow-1 q-pa-sm" style="width: 250px; flex-shrink: 0;">
          <q-list bordered>
            <q-item-label header>
              <div class="row items-center">
                <span>Channels</span>
                <q-space />
                <q-btn flat round dense icon="more_vert">
                  <q-menu>
                    <q-list style="min-width: 150px;">
                      <q-item clickable v-close-popup @click="channelFilter = 'all'">
                        <q-item-section>All channels</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="channelFilter = 'public'">
                        <q-item-section>Public channels</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="channelFilter = 'private'">
                        <q-item-section>Private channels</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-item-label>

            <q-item
              v-for="channel in filteredChannels"
              :key="channel.id"
              clickable
              @click="selectChannel(channel)"
              :active="activeChannel?.id === channel.id && !activeFriend"
              active-class="bg-primary text-white"
            >
              <q-item-section>
                <div>{{ channel.name }}</div>

                <!-- Milan píše pod názvom -->
                <div
                  v-if="channel.name === 'UniLife'"
                  class="typing-indicator"
                >
                  <b class="typing-name text-caption text-grey-8">Milan is typing</b>
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </q-item-section>
            </q-item>

            <!-- vytvorenie channel -->
            <q-item clickable @click="showCreateChannelDialog = true">
              <q-item-section avatar><q-icon name="add" color="primary" /></q-item-section>
              <q-item-section>Create Channel</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- friends zoznam -->
        <div v-if="showFriends" class="col-3 bg-yellow-1 q-pa-sm" style="width: 250px; flex-shrink: 0;">
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
              <div class="relative-position q-mr-sm">
                <ProfilePicture
                  :avatar="friend.avatar"
                  size="50px"
                  bgColor="grey-3"
                />
                <div class="status-indicator" :class="`status-${friend.status}`"></div>
              </div>
              <q-item-section>{{ friend.name }}</q-item-section>
            </q-item>

            <q-item clickable @click="showAddFriendDialog = true">
              <q-item-section avatar><q-icon name="add" color="primary" /></q-item-section>
              <q-item-section>Add friends</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- chatting -->
        <div class="column relative-position" style="flex: 1;">
          <!-- obsah chatu -->
          <div v-if="activeChannel || activeFriend" class="column" style="flex: 1; overflow: hidden;">
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
                      <q-item v-if="activeChannel?.isAdmin">
                        <q-item-section>
                          <div class="row items-center justify-between">
                            <span>Private</span>
                            <q-toggle
                              v-model="activeChannel.type"
                              true-value="private"
                              false-value="public"
                              @update:model-value="toggleChannelType"
                            />
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
              <div v-if="activeFriend">
                <q-btn flat round dense icon="more_vert">
                  <q-menu>
                    <q-list style="min-width: 150px;">
                      <q-item clickable v-close-popup @click="removeFriend(activeFriend.id)">
                        <q-item-section class="text-negative">Remove friend</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>

            <q-separator />

            <!-- správy -->
              <div
                ref="chatScrollBox"
                class="q-pa-md"
                style="
                  flex: 1;
                  overflow-y: auto;
                  display: flex;
                  flex-direction: column;
                  max-height: 63vh;
                ">
              <div
                v-for="msg in currentMessages"
                :key="msg.id"
                class="q-mb-sm message-container"
                :class="{ 'mention-message': msg.text.includes('@') }"
              >
                <!-- spravy od nas doprava -->
                <div v-if="msg.user === 'You'" style="text-align: right;">
                  {{ msg.text }}
                </div>

                <!-- ostatni dolava -->
                <div v-else style="text-align: left;">
                  <b>{{ msg.user }}:</b> {{ msg.text }}
                </div>
              </div>
              <!-- Milan nam pise -->
              <div
                v-if="activeChannel?.name === 'UniLife'"
                class="typing-message text-caption text-grey-7"
              >
                <span class="typing-name"><b>Milan:</b></span>
                <span class="typing-text">Caute prosim kde najdem github r|</span>
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
            <!-- alerty nad inputom-->
            <div
              ref="alertBox"
              class="system-message"
              style="
                height: 25px;
                padding: 6px 12px;
                font-family: monospace;
                font-size: 14px;
                color: #222;
              "
            >
              {{systemMessage}}
              
            </div>

            <!-- command line -->
            <div
                class="row q-pa-sm bg-grey-2"
                style="position: sticky; bottom: 0;"
            >
                <q-input
                ref="cliInput"
                v-model="newMessage"
                placeholder="Enter a message or command"
                input-class="command-input"
                outlined
                dense
                class="col"
                @keyup.enter="sendMessage"
                />
                <q-btn color="primary" label="Send" class="q-ml-sm" @click="sendMessage" />
            </div>


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
          <q-btn flat label="Cancel" color="black" v-close-popup />
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
        <q-card-actions align="right"><q-btn flat label="Close" color="black" v-close-popup /></q-card-actions>
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
          <q-select
            v-model="newChannelType"
            :options="[
              { label: 'Public', value: 'public' },
              { label: 'Private', value: 'private' }
            ]"
            label="Channel type"
            outlined
            dense
            class="q-mt-md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="black" v-close-popup />
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
          <q-btn flat label="Cancel" color="black" v-close-popup />
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

    <!-- Dialog pre nastavenie stavu používateľa -->
    <q-dialog v-model="showStatusDialog">
      <q-card style="min-width: 300px;">
        <q-card-section>
          <div class="text-h6">Set your status</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="userStatus"
            :options="statusOptions"
            option-value="value"
            option-label="label"
            label="Status"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="black" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveUserStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import ProfilePicture from '../components/ProfilePicture.vue';

type UserStatus = 'online' | 'dnd' | 'offline';

interface Friend { 
  id: number; 
  name: string; 
  avatar: string; 
  status: UserStatus;
  messages?: Message[]; 
}
interface Message { id: number; user: string; text: string; }
interface Channel { id: number; name: string; type: 'public' | 'private'; messages: Message[]; members?: number[]; isAdmin?: boolean; }
interface Invitation { id: number; from: string; channel: string; }

// Status options
const statusOptions = [
  { label: 'Online', value: 'online' as const },
  { label: 'Do Not Disturb', value: 'dnd' as const },
  { label: 'Offline', value: 'offline' as const },
];

// Aktuálny stav používateľa (statický pre tento príklad)
const userStatus = ref<UserStatus>('online');

// zobrazenie channel listu
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
  // zmenit im profilovky, toto je hrozneee
  { id: 1, name: 'Milan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg', status: 'online', messages: [] },
  { 
    id: 2, 
    name: 'Katka', 
    avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', 
    status: 'offline', 
    messages: [
      { id: 1, user: 'Katka', text: 'Ahoj' },
      { id: 2, user: 'Katka', text: 'Nevieš kedy máme odovzdať VPWA?' },
      { id: 3, user: 'Katka', text: 'Neviem či stíham' },
    ] 
  },
  { id: 3, name: 'Kubo', avatar: 'https://cdn.quasar.dev/img/avatar3.jpg', status: 'dnd', messages: [] },
  { id: 4, name: 'Maggie', avatar: 'https://cdn.quasar.dev/img/avatar4.jpg', status: 'dnd', messages: [] },
]);

const newChannelType = ref<'public' | 'private'>('public');
const channels = ref<Channel[]>([
  { id: 1, name: 'General', type: 'public', messages: [], members: [1, 2, 3], isAdmin: true },
  { id: 2, name: 'UniLife', type: 'private', messages: [], members: [2, 3] },
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
const showStatusDialog = ref(false);
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
  const nicknameExists = friends.value.some(f => f.name.toLowerCase() === name.toLowerCase());
  if (nicknameExists) {
    // musi mat unikatne meno
    alert('You are already friends with this person!');
    return;
  }

  const newFr: Friend = {
    id: friends.value.length + 1,
    name,
    avatar: 'https://cdn.quasar.dev/img/avatar.png',
    status: 'offline' as const,
    messages: [],
  };
  friends.value.unshift(newFr);
  activeFriend.value = newFr;
  newFriendName.value = ''; 
  showAddFriendDialog.value = false;
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
    type: 'private', 
    messages: [],
  };
  if (inv) channels.value.unshift(newCh);
  activeChannel.value = newCh;
  invitations.value = invitations.value.filter(i => i.id !== id);
};
const declineInvite = (id: number) => (invitations.value = invitations.value.filter(i => i.id !== id));

const channelFilter = ref<'all' | 'public' | 'private'>('all');

const filteredChannels = computed(() => {
  if (channelFilter.value === 'all') return channels.value;
  return channels.value.filter(ch => ch.type === channelFilter.value);
});

const createChannel = () => {
  const name = newChannelName.value.trim();
  if (!name) return;

  // kontrola ci uz meno existuje
  const nameExists = channels.value.some(ch => ch.name.toLowerCase() === name.toLowerCase());
  if (nameExists) {
    // musi mat unikatne meno
    alert('Channel name already exists!');
    return;
  }

  const newCh: Channel = {
    id: channels.value.length + 1,
    name,
    type: newChannelType.value,
    messages: [],
    members: selectedFriends.value,
    isAdmin: true,
  };

  channels.value.unshift(newCh);
  activeChannel.value = newCh;

  // reset hodnot
  newChannelName.value = '';
  selectedFriends.value = [];
  newChannelType.value = 'public';
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

const toggleChannelType = (val: 'public' | 'private') => {
  if (!activeChannel.value) return;
  activeChannel.value.type = val;
};

// Funkcia na uloženie stavu používateľa
const saveUserStatus = () => {
  // Tu by sa stav uložil na server, momentálne len zatvoríme dialog
  showStatusDialog.value = false;
};

// CLI fixne
const newMessage = ref("");
const systemMessage = ref("");
const chatScrollBox = ref<HTMLElement | null>(null);

function sendMessage() {
  const text = newMessage.value.trim();
  if (!text) return;

  if (text.startsWith("/")) {
    const parts = text.slice(1).split(" ");
    const command = parts[0]?.toLowerCase() ?? "";

    if (command === "join") {
      const channelName = parts[1]?.trim();
      let type: 'public' | 'private' = 'public';
      const rest = parts.slice(2).join(' ').toLowerCase();
      if (rest.includes('private')) type = 'private';

      if (!channelName) {
        systemMessage.value = "Usage: /join channelName [private]";
      } else {
        const ch = channels.value.find(c => c.name.toLowerCase() === channelName.toLowerCase());
        if (!ch) {
          const newCh: Channel = {
            id: channels.value.length + 1,
            name: channelName,
            type,
            messages: [],
            members: [0],
            isAdmin: true,
          };
          channels.value.unshift(newCh);
          activeChannel.value = newCh;
          systemMessage.value = `Channel "${channelName}" created (${type})`;
        }
      }
    } else {
      // ostatné CLI príkazy
      systemMessage.value = "Unknown command: " + text;
    }
  } else if (activeFriend.value || activeChannel.value) {
    // správa do chatov
    const target = activeFriend.value ?? activeChannel.value;
    if (target?.messages) {
      target.messages.push({
        id: Date.now(),
        user: "You",
        text
      });
    }
    void nextTick(() => {
      if (chatScrollBox.value) {
        chatScrollBox.value.scrollTop = chatScrollBox.value.scrollHeight;
      }
    });

  } else if (!activeFriend.value && !activeChannel.value) {
    systemMessage.value = "You are outside of channel";
  } else {
    // fallback CLI
    systemMessage.value = `Unknown command: ${text}`;
  }

  newMessage.value = "";
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
.message-container {
  padding: 8px;
  border-radius: 4px;
}
.mention-message {
  background-color: #9bc3ff; 
}

/* status indicators */
.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index: 1;
}

.status-online {
  background-color: #4CAF50;
}

.status-dnd {
  background-color: #F44336; 
}

.status-offline {
  background-color: #9E9E9E; 
}

/* milan nam pise */
.typing-indicator {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 4px;
  gap: 3px;
}
.typing-name{
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
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
}

/* realna message typing */
.typing-message {
  position: absolute;
  bottom: 100px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 6px 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.typing-text {
  color: #666;
}
</style>
