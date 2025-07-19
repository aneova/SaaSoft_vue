<template>
  <div class="form-row">
    <v-text-field
      v-model="account.labelsRaw"
      label="Метки (через ;)"
      @blur="processLabels"
      :error="account.invalid && !account.labelsRaw"
      density="default"
      variant="outlined"
      class="tiny-input"
    />

    <v-select
      v-model="account.type"
      :items="['Локальная', 'LDAP']"
      label="Тип записи"
      @update:modelValue="handleTypeChange"
      density="default"
      variant="outlined"
      class="tiny-input"
    />

    <v-text-field
      v-model="account.login"
      label="Логин"
      @blur="validate"
      :error="account.invalid && !account.login"
      density="default"
      variant="outlined"
      class="tiny-input"
      maxlength="100"
    />

    <v-text-field
      v-if="account.type === 'Локальная'"
      v-model="account.password"
      label="Пароль"
      @blur="validate"
      :error="account.invalid && (!account.password || account.password.length > 100)"
      :type="account.showPassword ? 'text' : 'password'"
      :append-icon="account.showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append="account.showPassword = !account.showPassword"
      density="default"
      variant="outlined"
      class="tiny-input"
      maxlength="100"
    />

    <v-btn
      color="error"
      @click="$emit('delete')"
      title="Удалить"
      class="delete-btn"
      variant="outlined"
    >
      <v-icon start>mdi-delete</v-icon>
      Удалить
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useAccountStore } from '../stores/accountStore'

const props = defineProps<{
  account: {
    labelsRaw: string
    labels: { text: string }[]
    type: 'LDAP' | 'Локальная'
    login: string
    password: string | null
    showPassword: boolean
    invalid: boolean
  }
  readonly?: boolean
}>()

const emit = defineEmits(['delete'])
const store = useAccountStore()

function processLabels() {
  const raw = props.account.labelsRaw
  const list = raw.split(';').map(s => s.trim()).filter(Boolean)
  props.account.labels = list.map(text => ({ text }))
  validate()
}

function handleTypeChange(value: 'LDAP' | 'Локальная') {
  props.account.type = value
  if (value === 'LDAP') {
    props.account.password = null
  }
  validate()
}

function validate() {
  const acc = props.account
  const validLogin = acc.login.trim().length > 0 && acc.login.trim().length <= 100
  const validPassword =
    acc.type === 'Локальная'
      ? acc.password !== null &&
        acc.password.trim().length > 0 &&
        acc.password.trim().length <= 100
      : true

  acc.invalid = !(validLogin && validPassword)
}

watch(
  () => props.account,
  () => {
    store.saveAccounts()
  },
  { deep: true }
)
</script>

<style scoped>
.form-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.tiny-input {
  flex: 1 1 150px;
  max-width: 180px;
  font-size: 13px;
  min-height: 56px;
}

.delete-btn {
  height: 40px;
  white-space: nowrap;
  align-self: center;
}
</style>
