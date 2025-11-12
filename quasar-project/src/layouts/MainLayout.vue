<template>
  <q-layout view="lHh Rpr lFf">
    <!-- HEADER  -->
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

    <!-- prave menu -->
    <q-drawer
      side="right"
      v-model="rightDrawerOpen"
      bordered
      overlay
      :width="drawerWidth"
    >
      <q-item class="row items-center justify-between">
        <q-item-label header>
          User Menu
        </q-item-label>
        <q-btn flat icon="close" size="sm" @click="rightDrawerOpen = false">
        </q-btn>
      </q-item>

      <q-list>
        <!-- profile a ked nanho kliknem tak sa rozbali -->
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

        <!-- setting item -->
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

        <!-- setting dropdown menu -->
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

        <!-- notifikacie -->
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

    <!-- status -->
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
import { useQuasar } from 'quasar';

// responzivny sidebar sirka

const $q = useQuasar()

const drawerWidth = computed(() => {
  if ($q.screen.xs) {
    return $q.screen.width //vrati celu sirku
  }
  return 350
})


const uploadedAvatar = ref<string | undefined>(undefined);

interface UserProfile {
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  password: string;
}

// fixny user zatial
const userProfile = ref<UserProfile>({
  first_name: 'Terezia',
  last_name: 'Stevulova',
  nickname: 'Ivanka',
  email: 'tereza.stevulova@example.com',
  password: 'securepassword123',
});

// zistenie, kde sme
const route = useRoute();
const isChatPage = computed(() => route.path === '/chat');

const router = useRouter();

interface Notification {
  message: string;
}

const notifications = ref<Notification[]>([
  { message: 'This channel has been inactive for 30 days and will be removed.' },
]);

// statusy
type UserStatus = 'online' | 'dnd' | 'offline';
const statusOptions = [
  { label: 'Online', value: 'online' as const },
  { label: 'Do Not Disturb', value: 'dnd' as const },
  { label: 'Offline', value: 'offline' as const },
];

// aktualny status pouzivatela
const userStatus = ref<UserStatus>('online');

const showStatusDialog = ref(false);
const rightDrawerOpen = ref(false);
const showLogoutMenu = ref(false);
const profileExpanded = ref(false);
const settingsMenuVisible = ref(false);
const notifyOnlyWhenTagged = ref(false);


// funk na prepinanie profilu
function toggleProfile(value: boolean) {
  profileExpanded.value = value;
  settingsMenuVisible.value = false;
}

// funk. na otvaranie settings menu
function openSettingsMenu() {
  console.log('Settings clicked, toggling menu'); 
  settingsMenuVisible.value = !settingsMenuVisible.value;
  profileExpanded.value = false; 
}

// funk. na editovanie profilu
function editProfile() {
  console.log('Edit profile clicked');
  // tu by sme mohli vymysliet este nejaky popup dialog
}

function dismissNotification() {
  notifications.value.shift();
}

function saveUserStatus() {
  console.log('Saving user status:', userStatus.value);
  showStatusDialog.value = false;
}

// prepinanie notifikacii
function handleNotifyToggle(value: boolean) {
  console.log('Notify only when tagged:', value);
}
//logout
async function confirmLogout() {
  showLogoutMenu.value = false;
  await router.push('/login');
}

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