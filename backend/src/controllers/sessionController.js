import Session from '../models/Session.js'

export const createSession = async (req, res) => {
    try {
        const { signer, additionalSigners = [], witnesses = [], observers = [] } = req.body

        const allEmails = [
            signer?.email,
            ...additionalSigners.map(s => s.email),
            ...witnesses.map(w => w.email),
            ...observers.map(o => o.email)
        ]

        const uniqueEmails = new Set(allEmails)
        if (uniqueEmails.size !== allEmails.length) {
            return res.status(400).json({ error: 'Duplicate emails found among participants' });
        }

        const session = new Session({ signer, additionalSigners, witnesses, observers })
        await session.save()

        res.status(201).json({ message: 'Session created successfully', session })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find();
        return res.status(200).json({ sessions }); // wrap in object
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateSession = async (req, res) => {
    const { id } = req.params
    try {
        const session = await Session.findByIdAndUpdate(id, req.body, { new: true })
        if (!session) return res.status(404).json({ error: 'Session not found' })
        res.json({ session })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const deleteSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        return res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

