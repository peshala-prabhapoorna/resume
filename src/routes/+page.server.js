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

export function load( {url} ) {
    const access_token = getAccessToken(url);
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
    return { resume };
}
