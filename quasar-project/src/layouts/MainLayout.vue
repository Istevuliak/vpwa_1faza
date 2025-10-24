<template>
  <q-layout view="lHh Rpr lFf">
    <!-- HEADER (unchanged) -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-left">
          Shello
        </q-toolbar-title>
        <div v-if="isChatPage" class="row items-center q-gutter-sm">
          <div class="relative-position">
            <q-btn
              flat
              dense
              round
              aria-label="User"
              @click="toggleRightDrawer"
            >
              <ProfilePicture
                :avatar="uploadedAvatar"
                size="33px"
                bgColor="grey-4"
              />
            </q-btn>
            <q-badge color="red" floating transparent>{{ notifications.length }}</q-badge>
          </div>
          <q-btn color="dark" flat>
            <q-icon class="material-symbols-outlined q-mr-xs">logout</q-icon>
            Log out
            <q-menu v-model="showLogoutMenu" anchor="bottom right" self="top right" :offset="[0, 16]">
              <q-card style="min-width: 200px;">
                <q-card-section class="text-center">
                  Do you want to log out?
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cancel" color="black" v-close-popup />
                  <q-btn color="primary" label="Log out" @click="confirmLogout" />
                </q-card-actions>
              </q-card>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- PRAVÉ MENU (Drawer) -->
    <q-drawer
      side="right"
      v-model="rightDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label header>
          User Menu
        </q-item-label>

        <!-- Profile Item with Collapsible Section -->
        <q-expansion-item
          :model-value="profileExpanded"
          @update:model-value="toggleProfile"
          @click.stop
          icon="person"
          :label="`${userProfile.first_name} ${userProfile.last_name}`"
          header-class="text-dark"
          expand-icon-class="text-dark"
        >
          <q-card flat class="q-pa-md">
            <q-card-section>
              <div class="q-mt-sm">
                <strong>Name:</strong> {{ userProfile.first_name }} {{ userProfile.last_name }}
              </div>
              <div>
                <strong>Nickname:</strong> {{ userProfile.nickname }}
              </div>
              <div>
                <strong>Email:</strong> {{ userProfile.email }}
              </div>
              <div>
                <strong>Password:</strong> ********
              </div>
              <q-btn
                flat
                color="primary"
                label="Edit"
                class="q-mt-md"
                style="display: flex; justify-self: flex-end;"
                @click="editProfile"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- Settings Item with q-menu -->
        <q-item
          clickable
          @click.stop="openSettingsMenu"
          class="text-dark"
        >
          <q-item-section avatar>
            <q-icon name="settings" class="text-dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
            <q-item-label caption>Account preferences</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Settings Dropdown Menu -->
        <q-menu
          v-model="settingsMenuVisible"
          anchor="bottom middle"
          self="top middle"
          :offset="[0, 8]"
        >
          <q-list style="min-width: 150px;">
            <q-item clickable v-close-popup @click="showStatusDialog = true">
              <q-item-section>Statuses</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-toggle
                  v-model="notifyOnlyWhenTagged"
                  label="Notify only when tagged"
                  @update:model-value="handleNotifyToggle"
                >
                  <q-tooltip>Receive notifications only when mentioned or tagged</q-tooltip>
                </q-toggle>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>

        <!-- Notifications -->
        <q-item v-if="notifications.length > 0">
          <q-item-section>
            <div class="notification-message">
              {{ notifications[0]?.message }}
              <q-btn
                flat
                dense
                round
                icon="close"
                size="sm"
                @click="dismissNotification"
                class="q-ml-sm"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProfilePicture from '../components/ProfilePicture.vue';

const uploadedAvatar = ref<string | undefined>(undefined);

interface UserProfile {
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  password: string;
}

// Fixný user zatiaľ
const userProfile = ref<UserProfile>({
  first_name: 'Terezia',
  last_name: 'Stevulova',
  nickname: 'Ivanka',
  email: 'tereza.stevulova@example.com',
  password: 'securepassword123',
});

// Zistenie kde sa nachádzame
const route = useRoute();
const isChatPage = computed(() => route.path === '/chat');

const router = useRouter();

// Definícia rozhrania pre notifikácie
interface Notification {
  message: string;
}

// Definícia notifikácií
const notifications = ref<Notification[]>([
  { message: 'This channel has been inactive for 30 days and will be removed.' },
]);

// Možnosti stavu
type UserStatus = 'online' | 'dnd' | 'offline';
const statusOptions = [
  { label: 'Online', value: 'online' as const },
  { label: 'Do Not Disturb', value: 'dnd' as const },
  { label: 'Offline', value: 'offline' as const },
];

// Aktuálny stav používateľa
const userStatus = ref<UserStatus>('online');

// Premenné pre dialógy a menu
const showStatusDialog = ref(false);
const rightDrawerOpen = ref(false);
const showLogoutMenu = ref(false);
const profileExpanded = ref(false);
const settingsMenuVisible = ref(false);
const notifyOnlyWhenTagged = ref(false);

// Funkcia na prepínanie profilu
function toggleProfile(value: boolean) {
  profileExpanded.value = value;
  settingsMenuVisible.value = false; // Ensure settings menu is closed
}

// Funkcia na otváranie settings menu
function openSettingsMenu() {
  console.log('Settings clicked, toggling menu'); // Debug log
  settingsMenuVisible.value = !settingsMenuVisible.value;
  profileExpanded.value = false; // Ensure profile is collapsed
}

// Funkcia na editovanie profilu
function editProfile() {
  console.log('Edit profile clicked');
  // Tu sa môže otvoriť popup na zmenu
}

// Funkcia na zatvorenie notifikácie
function dismissNotification() {
  notifications.value.shift();
}

// Funkcia na uloženie stavu
function saveUserStatus() {
  console.log('Saving user status:', userStatus.value);
  showStatusDialog.value = false;
}

// Funkcia na prepínanie notifikácií
function handleNotifyToggle(value: boolean) {
  console.log('Notify only when tagged:', value);
}

// Funkcia na odhlásenie
async function confirmLogout() {
  showLogoutMenu.value = false;
  await router.push('/login');
}

// Funkcia na prepínanie pravého menu
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>

<style scoped>
.text-center {
  flex: 1;
  text-align: center;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}

.q-toolbar {
  color: #000;
}

.notification-message {
  background-color: #F44336;
  color: #000;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-dark {
  color: #424242 !important;
}

</style>