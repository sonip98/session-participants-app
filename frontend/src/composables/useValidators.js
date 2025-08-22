// src/composables/useValidators.js
import { useSessionStore } from '@/stores/sessionStore'

export function useValidators() {
  const store = useSessionStore()

  const required = (field = 'Field') => (val) =>
    !!val || `${field} is required`

  const emailFormat = (val) =>
    /.+@.+\..+/.test(val) || 'Invalid email format'

  const uniqueEmail = (val) => {
    if (!val) return true
    const emails = []
    if (store.signer.email) emails.push(store.signer.email)
    store.additionalSigners.forEach((s) => s.email && emails.push(s.email))
    store.witnesses.forEach((w) => w.email && emails.push(w.email))
    store.observers.forEach((o) => o.email && emails.push(o.email))

    const count = emails.filter((e) => e === val).length
    return count > 1 ? 'Email must be unique' : true
  }

  const emailRules = () => [required('Email'), emailFormat, uniqueEmail]

  return {
    required,
    emailFormat,
    uniqueEmail,
    emailRules,
  }
}
