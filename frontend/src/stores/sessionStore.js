// src/stores/sessionStore.js
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useSessionStore = defineStore('session', {
    state: () => ({
        signer: { name: '', email: '' },
        additionalSigners: [],
        witnesses: [],
        observers: [],
        sessions: [],
        editingSessionId: null
    }),
    actions: {
        async fetchSessions() {
            try {
                const res = await api.get('/sessions')
                this.sessions = res.data.sessions || []
            } catch (err) {
                console.error('Error fetching sessions:', err)
            }
        },
        async saveSession() {
            try {
                if (this.editingSessionId) {
                    // Update existing session
                    await this.updateSession(this.editingSessionId, {
                        signer: this.signer,
                        additionalSigners: this.additionalSigners,
                        witnesses: this.witnesses,
                        observers: this.observers
                    })
                    this.editingSessionId = null
                } else {
                    // Save new session
                    await api.post('/sessions', {
                        signer: this.signer,
                        additionalSigners: this.additionalSigners,
                        witnesses: this.witnesses,
                        observers: this.observers
                    })
                    await this.fetchSessions()
                }
            } catch (err) {
                console.error(err)
                throw err
            }
        },
        async updateSession(id, updatedData) {
            try {
                await api.put(`/sessions/${id}`, updatedData)
                await this.fetchSessions()
            } catch (err) {
                console.error(err)
                throw err
            }
        },
        setEditingSession(session) {
            this.editingSessionId = session._id
            // populate form
            this.signer = { ...session.signer }
            this.additionalSigners = [...session.additionalSigners]
            this.witnesses = [...session.witnesses]
            this.observers = [...session.observers]
        },
        resetForm() {
            this.signer = { name: '', email: '' }
            this.additionalSigners = []
            this.witnesses = []
            this.observers = []
            this.editingSessionId = null
        },
        async deleteSession(id) {
            try {
                await api.delete(`/sessions/${id}`)
                this.sessions = this.sessions.filter(s => s._id !== id)
            } catch (err) {
                console.error('Error deleting session:', err)
                throw err
            }
        }
    }
})