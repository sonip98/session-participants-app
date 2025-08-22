// src/stores/sessionStore.js
import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    signer: { fullName: '', email: '' },
    additionalSigners: [{ fullName: '', email: '' }],
    witnesses: [{ fullName: '', email: '', address: '', zip: '', state: '' }],
    observers: [{ fullName: '', email: '', role: '', otherRole: '', phone: '' }],
  }),
})
