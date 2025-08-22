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
                        @click="store.witnesses.push({ fullName: '', email: '', zip: '', address: '', state: '' })" />
                </div>

                <div v-for="(witness, index) in store.witnesses" :key="index" class="q-card q-pa-md q-mb-md">
                    <q-input v-model="witness.fullName" label="Full Name" :rules="[required('Full Name')]"
                        class="q-mb-sm" dense outlined />
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
                        @click="store.observers.push({ fullName: '', email: '', phone: '', role: '', otherRole: '' })" />
                </div>

                <div v-for="(observer, index) in store.observers" :key="index" class="q-card q-pa-md q-mb-md">
                    <q-input v-model="observer.fullName" label="Full Name" :rules="[required('Full Name')]"
                        class="q-mb-sm" dense outlined />
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
</template>

<script setup>
import { useSessionStore } from '@/stores/sessionStore'
import { useValidators } from '@/composables/useValidators'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const store = useSessionStore()
const { emailRules, required } = useValidators()

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


const saveSession = () => {
    console.log('Session Saved:', store.$state)
    $q.notify({ type: 'positive', message: 'Session saved!' })
}
</script>
