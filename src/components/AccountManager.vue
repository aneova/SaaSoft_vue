<template>
  <div class="account-manager">
    <h1>Учётные записи</h1>
    <p>
      Для указания нескольких меток для одной пары логин/пароль
      используйте разделитель <code>;</code>
    </p>

    <v-btn color="primary" class="add-btn" @click="addAccount">
      Добавить учётную запись
    </v-btn>

    <div class="account-list">
      <div
        v-for="(account, index) in store.accounts"
        :key="index"
        class="account-item"
      >
        <AccountForm
          :account="store.accounts[index]"
          @delete="removeAccount(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccountStore } from '../stores/accountStore'
import AccountForm from './AccountForm.vue'

const store = useAccountStore()

function addAccount() {
  store.accounts.push({
    login: '',
    password: '',
    type: 'Локальная',
    labelsRaw: '',
    labels: [],
    showPassword: false,
    invalid: false,
  })
  store.saveAccounts()
}

function removeAccount(index: number) {
  store.accounts.splice(index, 1)
  store.saveAccounts()
}

onMounted(() => {
  store.loadAccounts()
})
</script>

<style scoped>
.account-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.add-btn {
  margin: 16px 0;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.account-item {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
}
</style>
