import mongoose from 'mongoose'

const signerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
})

const additionalSignerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
})

const witnessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  zip: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true }
})

const observerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  otherRole: { type: String }
})

const sessionSchema = new mongoose.Schema({
  signer:  { type: signerSchema, required: true },
  additionalSigners: [additionalSignerSchema],
  witnesses: [witnessSchema],
  observers: [observerSchema],
}, { timestamps: true })

export default mongoose.model('Session', sessionSchema)
