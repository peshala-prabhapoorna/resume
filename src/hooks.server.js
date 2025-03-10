import sqlite3 from 'sqlite3';
const logPath ='/home/prabhapoorna/var/log/resume-logs.sqlite';

export async function handle({ event, resolve }) {
    if (!event.locals.db) {
        const db = new sqlite3.Database(logPath, (err) => {
            if (err) {
                throw new Error(`${err}: Error creating database`);
            }
        });

        event.locals.db = db;

        const query = 'CREATE TABLE IF NOT EXISTS token_usage (id INTEGER PRIMARY KEY, token TEXT, timestamp TIMESTAMP)';
        db.run(query, (err) => {
            if (err) {
                throw new Error(`${err}: Error creating table`);
            }
        });
    }

    const response = await resolve(event);
    return response;
}
