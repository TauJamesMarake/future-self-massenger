const express = require('express');
const router = express.Router();
const emailConfig = require('../config/email');

// Send message immediately
router.post('/send-immediate', async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Save to Supabase
        const { data, error: insertError } = await req.supabase
            .from('messages')
            .insert([
                {
                    type: 'developer',
                    message: message,
                    sent: true,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (insertError) {
            console.error('Insert error:', insertError);
            return res.status(500).json({ error: 'Failed to save message' });
        }

        // Send email to developer
        await emailConfig.sendToDevEmail(message);

        res.json({
            success: true,
            message: 'Message sent to developer',
            data: data
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Failed to send message' });
    }
});

// Schedule message for future self
router.post('/send-scheduled', async (req, res) => {
    const { message, email, scheduledDate, scheduledTime } = req.body;

    // Validation
    if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: 'Message is required' });
    }
    if (!email || !scheduledDate || !scheduledTime) {
        return res.status(400).json({ error: 'Email, date, and time are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create datetime string
    const scheduledDatetime = `${scheduledDate} ${scheduledTime}`;

    try {
        // Save to Supabase
        const { data, error: insertError } = await req.supabase
            .from('messages')
            .insert([
                {
                    type: 'future-self',
                    message: message,
                    email: email,
                    scheduled_date: scheduledDate,
                    scheduled_time: scheduledTime,
                    scheduled_datetime: scheduledDatetime,
                    sent: false,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (insertError) {
            console.error('Insert error:', insertError);
            return res.status(500).json({ error: 'Failed to save message' });
        }

        res.json({
            success: true,
            message: 'Message scheduled successfully',
            scheduledFor: scheduledDatetime,
            data: data
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Failed to schedule message' });
    }
});

// Get all messages (for admin/debugging)
router.get('/all', async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }

        res.json(data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch messages' });
    }
});

// Get unsent messages (for scheduler)
router.get('/unsent', async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from('messages')
            .select('*')
            .eq('type', 'future-self')
            .eq('sent', false)
            .order('scheduled_datetime', { ascending: true });

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }

        res.json(data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch messages' });
    }
});

// Mark message as sent
router.patch('/mark-sent/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await req.supabase
            .from('messages')
            .update({ sent: true, sent_at: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (error) {
            return res.status(500).json({ error: 'Failed to update message' });
        }

        res.json({ success: true, data: data });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Failed to update message' });
    }
});

module.exports = router;