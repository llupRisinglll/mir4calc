require('dotenv').config();
const mongoose = require('mongoose');

const http = require("https");


class ReminderScheduler {
    constructor() {
        this.cronSchedules = [];
        this.tries = 0;
        this.maxTries = 10;
        this.currentTimestamp = new Date();
        this.threeMinutesAgo = new Date(this.currentTimestamp.getTime() - 3 * 60000);
        this.timerId = null;

        // Define the Reminder schema
        const reminderSchema = new mongoose.Schema({
            title: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            },
            timeHour: {
                type: Number,
                required: true
            },
            timeMinute: {
                type: Number,
                required: true
            },
            day: {
                type: Number
            },
            server: {
                type: String,
                required: true
            },
            channel: {
                type: String,
                required: true
            },
            lastExecuted: {
                type: Date
            }
        });

        // Create the Reminder model
        this.Reminder = mongoose.model('Reminder', reminderSchema);
    }

    connectToMongoDB() {
        return mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    async queryReminders() {
        try {
            const today = new Date();
            const singaporeTime = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));

            singaporeTime.setHours(0, 0, 0, 0); // Set the time to the start of today in Singapore time

            const reminders = await this.Reminder.find({
                $or: [
                    { lastExecuted: { $exists: false } },
                    { lastExecuted: { $lt: today } }
                ]
            }).exec();

            this.cronSchedules = (reminders);

            // Use cronSchedule variable for further processing
            console.log('Query successful. cronSchedule:', this.cronSchedules);
        } catch (error) {
            console.error('Query failed:', error);

            if (this.tries < this.maxTries) {
                this.tries++;
                setTimeout(() => this.queryReminders(), 5000);
            }
        }
    }

    async sendMessage(message, server, channel, callback) {
        try {
            const endpoint = `https://mir4-serverless.ue.r.appspot.com/api/discord/reminder/${server}/${channel}`;
            const formData = new URLSearchParams();
            formData.append('message', message);

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };

            const request = http.request(endpoint, requestOptions, (response) => {
                let responseData = '';

                response.on('data', (chunk) => {
                    responseData += chunk;
                });

                response.on('end', () => {
                    if (response.statusCode !== 200) {
                        throw new Error('Request failed with status code ' + response.statusCode);
                    }

                    const jsonResponse = JSON.parse(responseData);
                    if (jsonResponse.success === true) {
                        callback(); // Invoke the provided callback function
                    }
                    console.log({ message: 'executed' });
                });
            });

            request.on('error', (error) => {
                console.error('Error:', error);
            });

            request.write(formData.toString());
            request.end();
        } catch (error) {
            console.error('Error:', error);
        }
    }



    async start() {
        await this.connectToMongoDB();
        await this.queryReminders();

        // Get the updated data
        this.timerId = setInterval(async () => {
            await this.queryReminders();
        }, 1000 * 60 * 3);

        const now = new Date();
        const next3Minutes = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes() + 3,
            0
        );

        setInterval(() => {
            const now = new Date();
            const utc8 = now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
            const utc8Date = new Date(utc8);
            const utc8Hour = utc8Date.getHours();
            const utc8Minute = utc8Date.getMinutes();

            console.log('Checking jobs for the time', utc8Hour, utc8Minute);

            for (let i = 0; i < this.cronSchedules.length; i++) {
                const { timeHour, timeMinute, message, server, channel, day, _id, lastExecuted } = this.cronSchedules[i];

                // Stop executing if we already excuted it.
                if (lastExecuted) {
                    const lastExecutedDate = new Date(lastExecuted);
                    const lastExecutedHour = lastExecutedDate.getHours();
                    const lastExecutedMinute = lastExecutedDate.getMinutes();

                    if (
                        lastExecutedDate.getDate() === utc8Date.getDate() &&
                        lastExecutedHour === utc8Hour &&
                        lastExecutedMinute === utc8Minute
                    ) {
                        continue;
                    }
                }

                if (utc8Hour === timeHour && utc8Minute === timeMinute) {
                    if (typeof day !== 'undefined' && day !== null && day < 7 && day >= 1) {
                        const utc8Day = utc8Date.getDay() + 1;
                        if (utc8Day !== day) {
                            continue;
                        }
                    }

                    this.sendMessage(message, server, channel,  () => {
                        // Update the MongoDB document with matching _id and set lastExecuted to current datetime
                        this.Reminder.updateOne(
                            { _id },
                            { $set: { lastExecuted: new Date() } },
                            { upsert: false }
                        )
                            .then(updateResult => {
                                console.log('Reminder updated successfully.');
                                // Update the data in this.cronSchedules array
                                this.cronSchedules[i].lastExecuted = new Date();
                            })
                            .catch(error => {
                                console.error('Error updating reminder:', error);
                            });
                    });
                }
            }
        }, 1000 * 10);


    }
}

const reminderScheduler = new ReminderScheduler();
reminderScheduler.start();
