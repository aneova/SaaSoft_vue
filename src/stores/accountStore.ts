import { defineStore } from 'pinia'

interface Label {
  text: string
}

export interface Account {
  login: string
  password: string | null
  type: 'LDAP' | 'Локальная'
  labelsRaw: string
  labels: Label[]
  showPassword: boolean
  invalid: boolean
}

export const useAccountStore = defineStore('accountStore', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    loadAccounts() {
      const data = localStorage.getItem('accounts')
      if (data) {
        try {
          const parsed: Account[] = JSON.parse(data)

          // При необходимости очищаем пароли у LDAP
          this.accounts = parsed.map(acc => ({
            ...acc,
            password: acc.type === 'LDAP' ? null : acc.password,
          }))
        } catch (e) {
          console.error('Ошибка при загрузке аккаунтов:', e)
          this.accounts = []
        }
      }
    },
    saveAccounts() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
    },
    setAccounts(accounts: Account[]) {
      this.accounts = accounts
      this.saveAccounts()
    }
  },
})
