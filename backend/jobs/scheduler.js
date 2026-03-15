const cron = require('node-cron');
const emailConfig = require('../config/email');

const scheduler = {
    start: (supabase) => {
        console.log('Scheduler started - checking every minute for scheduled messages');

        // Run every minute to check for messages to send
        cron.schedule('* * * * *', async () => {
            try {
                const now = new Date();
                const currentDatetime = now.toISOString().slice(0, 16).replace('T', ' ');

                // Query Supabase for unsent messages that should be sent now
                const { data: messages, error } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('type', 'future-self')
                    .eq('sent', false)
                    .lte('scheduled_datetime', currentDatetime);

                if (error) {
                    console.error('Scheduler query error:', error);
                    return;
                }

                if (!messages || messages.length === 0) {
                    return;
                }

                console.log(`Found ${messages.length} message(s) to send`);

                // Process each message
                for (const message of messages) {
                    try {
                        // Send email
                        await emailConfig.sendScheduledMessage(message.email, message.message);

                        // Mark as sent in database
                        const { error: updateError } = await supabase
                            .from('messages')
                            .update({
                                sent: true,
                                sent_at: new Date().toISOString()
                            })
                            .eq('id', message.id);

                        if (updateError) {
                            console.error(`Failed to update message ${message.id}:`, updateError);
                        } else {
                            console.log(`Message ${message.id} sent to ${message.email}`);
                        }

                    } catch (emailError) {
                        console.error(`Failed to send message ${message.id}:`, emailError);
                    }
                }

            } catch (error) {
                console.error('Scheduler error:', error);
            }
        });
    }
};

module.exports = scheduler;