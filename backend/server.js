require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const messageRoutes = require('./routes/messages');
const scheduler = require('./jobs/scheduler');

const app = express();

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Make supabase available to routes
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// Routes
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Test Supabase connection
app.get('/api/test-connection', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('count', { count: 'exact', head: true });

        if (error) {
            return res.status(500).json({
                status: 'ERROR',
                message: 'Failed to connect to Supabase',
                error: error.message
            });
        }

        res.json({
            status: 'OK',
            message: 'Connected to Supabase successfully',
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: error.message
        });
    }
});

// Start scheduler
scheduler.start(supabase);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;