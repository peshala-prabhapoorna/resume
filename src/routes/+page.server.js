import { error } from '@sveltejs/kit';
import resume from '$lib/assets/resume.pdf';
import { ACCESS_TOKENS } from '$env/static/private';

function getAccessToken(url) {
    const queryParams = new URLSearchParams(url.search);
    return queryParams.get('token') || false;
}

function isUnauthorized(access_token) {
    const tokens = ACCESS_TOKENS.split(', ');
    let unauthorized = true;
    for (let token of tokens) {
        if (token === access_token) {
            unauthorized = false;
        }
    }
    return unauthorized;
}

function logAccessTokenUsage(access_token, locals) {
    return new Promise((resolve, reject) => {
        const db = locals.db;
        const timeLK = new Date().toLocaleString({ timeZone: "LK" });

        const query = 'INSERT INTO token_usage(token, timestamp) VALUES (?, ?)'
        db.run(query, [access_token, timeLK], (err) => {
            if (err) {
                reject(new Error(`${err}: Error inserting row`));
                return;
            }
            resolve();
        });
    });
}

export async function load({ url, locals }) {
    const access_token = getAccessToken(url);
    const insertPromise = logAccessTokenUsage(access_token, locals);

    if (!access_token) {
        error(400, {
            message: "Bad request! Access token not found."
        });
    }

    if (isUnauthorized(access_token)) {
        error(401, {
            message: "Unauthorized access token."
        });
    }

    await insertPromise;
    return { resume };
}
