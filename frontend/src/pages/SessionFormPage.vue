<template>
    <q-page class="q-pa-md flex flex-center">
        <q-card class="q-pa-lg" style="max-width: 800px; width: 100%;">
            <q-card-section>
                <div class="text-h6 text-primary">Create Session</div>
            </q-card-section>

            <q-separator />

            <!-- Signer -->
            <q-card-section>
                <div class="text-subtitle1">Signer</div>
                <div class="row q-col-gutter-md">
                    <div class="col">
                        <q-input v-model="store.signer.name" label="Full Name" outlined dense />
                    </div>
                    <div class="col">
                        <q-input v-model="store.signer.email" label="Email" outlined dense :rules="emailRules()"
                            @blur="validateField(store.signer.email, 'signer')" />
                    </div>
                </div>
            </q-card-section>

            <!-- Additional Signers -->
            <q-card-section>
                <div class="row items-center justify-between">
                    <div class="text-subtitle1">Additional Signers</div>
                    <q-btn flat dense icon="add" label="Add Signer" @click="addSigner" />
                </div>

                <div v-for="(signer, index) in store.additionalSigners" :key="'signer-' + index"
                    class="row q-col-gutter-md q-mt-sm">
                    <div class="col">
                        <q-input v-model="signer.name" label="Full Name" outlined dense />
                    </div>
                    <div class="col">
                        <q-input v-model="signer.email" label="Email" outlined dense :rules="emailRules()"
                            @blur="validateField(signer.email, 'additionalSigner', index)" />
                    </div>
                    <div class="col-auto">
                        <q-btn flat dense round icon="delete" color="negative" @click="removeSigner(index)" />
                    </div>
                </div>
            </q-card-section>

            <!-- Witnesses -->
            <div class="q-mt-lg">
                <div class="row items-center justify-between q-mb-sm">
                    <div class="text-h6">Witnesses</div>
                    <q-btn dense color="primary" icon="add" label="Add Witness"
                        @click="store.witnesses.push({ name: '', email: '', zip: '', address: '', state: '' })" />
                </div>

                <div v-for="(witness, index) in store.witnesses" :key="index" class="q-card q-pa-md q-mb-md">
                    <q-input v-model="witness.name" label="Full Name" :rules="[required('Full Name')]" class="q-mb-sm"
                        dense outlined />
                    <q-input v-model="witness.email" label="Email" :rules="emailRules()" class="q-mb-sm" dense
                        outlined />
                    <q-input v-model="witness.zip" label="Zip" :rules="[required('Zip')]" class="q-mb-sm" dense
                        outlined />
                    <q-input v-model="witness.address" label="Address" :rules="[required('Address')]" class="q-mb-sm"
                        dense outlined />
                    <q-input v-model="witness.state" label="State" :rules="[required('State')]" class="q-mb-sm" dense
                        outlined />

                    <q-btn dense color="negative" icon="delete" label="Remove"
                        @click="store.witnesses.splice(index, 1)" />
                </div>
            </div>


            <!-- Observers -->
            <div class="q-mt-lg">
                <div class="row items-center justify-between q-mb-sm">
                    <div class="text-h6">Observers</div>
                    <q-btn dense color="primary" icon="add" label="Add Observer"
                        @click="store.observers.push({ name: '', email: '', phone: '', role: '', otherRole: '' })" />
                </div>

                <div v-for="(observer, index) in store.observers" :key="index" class="q-card q-pa-md q-mb-md">
                    <q-input v-model="observer.name" label="Full Name" :rules="[required('Full Name')]" class="q-mb-sm"
                        dense outlined />
                    <q-input v-model="observer.email" label="Email" :rules="emailRules()" class="q-mb-sm" dense
                        outlined />
                    <q-input v-model="observer.phone" label="Phone" :rules="[required('Phone')]" class="q-mb-sm" dense
                        outlined />

                    <q-select v-model="observer.role" label="Role" :options="['Admin', 'Translator', 'Other']"
                        :rules="[required('Role')]" class="q-mb-sm" dense outlined />

                    <q-input v-if="observer.role === 'Other'" v-model="observer.otherRole" label="Other Contact Role"
                        :rules="[required('Other Contact Role')]" class="q-mb-sm" dense outlined />

                    <q-btn dense color="negative" icon="delete" label="Remove"
                        @click="store.observers.splice(index, 1)" />
                </div>
            </div>


            <!-- Actions -->
            <q-separator />
            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" />
                <q-btn label="Save Session" color="primary" @click="saveSession" />
            </q-card-actions>
        </q-card>

    </q-page>
    <q-card-section class="q-mt-lg">
        <div class="text-h6 q-mb-md">All Sessions</div>
        <q-table :rows="store.sessions" :columns="columns" row-key="_id" flat bordered dense>
            <template v-slot:body-cell-actions="props">
                <q-td align="center">
                    <q-btn flat dense color="primary" label="Edit" @click="editSession(props.row)" />
                    <q-btn flat dense color="secondary" label="View Details" @click="openDetails(props.row)" />
                    <q-btn flat dense color="negative" label="Delete" @click="deleteSession(props.row._id)" />
                </q-td>
            </template>
        </q-table>
    </q-card-section>
    <q-dialog v-model="detailsDialog">
        <q-card style="min-width: 400px; max-width: 600px;">
            <q-card-section>
                <div class="text-h6">Session Details</div>
            </q-card-section>

            <q-separator />

            <q-card-section v-if="selectedSession">
                <div>
                    <strong>Signer:</strong> {{ selectedSession.signer.name }} ({{ selectedSession.signer.email }})
                </div>

                <div class="q-mt-sm">
                    <strong>Additional Signers:</strong>
                    <ul>
                        <li v-for="s in selectedSession.additionalSigners" :key="s.email">
                            {{ s.name }} - {{ s.email }}
                        </li>
                    </ul>
                </div>

                <div class="q-mt-sm">
                    <strong>Witnesses:</strong>
                    <ul>
                        <li v-for="w in selectedSession.witnesses" :key="w.email">
                            {{ w.name }} - {{ w.email }}, {{ w.zip }}, {{ w.address }}, {{ w.state }}
                        </li>
                    </ul>
                </div>

                <div class="q-mt-sm">
                    <strong>Observers:</strong>
                    <ul>
                        <li v-for="o in selectedSession.observers" :key="o.email">
                            {{ o.name }} - {{ o.email }}, {{ o.phone }}, {{ o.role }}
                            <span v-if="o.role === 'Other'">({{ o.otherRole }})</span>
                        </li>
                    </ul>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

</template>

<script setup>
import { useSessionStore } from '@/stores/sessionStore'
import { useValidators } from '@/composables/useValidators'
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'

const $q = useQuasar()
const store = useSessionStore()
const { emailRules, required } = useValidators()

import { ref } from 'vue'

const detailsDialog = ref(false)
const selectedSession = ref(null)

const openDetails = (session) => {
  selectedSession.value = session
  detailsDialog.value = true
}

const columns = [
    { name: 'signer', label: 'Signer', field: row => row.signer.name },
    { name: 'additionalSigners', label: 'Additional Signers', field: row => row.additionalSigners.map(s => s.name).join(', ') },
    { name: 'witnesses', label: 'Witnesses', field: row => row.witnesses.map(w => w.name).join(', ') },
    { name: 'observers', label: 'Observers', field: row => row.observers.map(o => o.name).join(', ') },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
]

const validateField = (val) => {
    const rules = emailRules()
    for (const rule of rules) {
        const result = rule(val)
        if (result !== true) {
            $q.notify({ type: 'negative', message: result })
            break
        }
    }
}

// Add / Remove helpers (aligned with UI data structures)
const addSigner = () => {
    store.additionalSigners.push({ name: '', email: '' })
}
const removeSigner = (i) => {
    store.additionalSigners.splice(i, 1)
}

const editSession = (session) => {
    store.setEditingSession(session)
    $q.notify({ type: 'info', message: `Editing session: ${session.signer.name}` })
}

const deleteSession = async (id) => {
    try {
        await store.deleteSession(id)
        $q.notify({ type: 'positive', message: 'Session deleted' })
    } catch {
        $q.notify({ type: 'negative', message: 'Failed to delete session' })
    }
}

onMounted(() => {
    store.fetchSessions()
})

const saveSession = async () => {
    try {
        await store.saveSession() // handles both create & update
        $q.notify({
            type: 'positive',
            message: store.editingSessionId ? 'Session updated!' : 'Session saved!'
        })
        store.resetForm() // clear form after save
    } catch (err) {
        if(err.response?.data.errors){
            err.response?.data.errors.forEach(error => {
                $q.notify({ type: 'negative', message: error })
            });
        } else {
            $q.notify({ type: 'negative', message: 'Failed to save session' })
        }
    }
}

</script>
