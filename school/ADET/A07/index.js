const clientId = 'c88fe9d021d8463cb23cdc5ddbfda566';
const redirectUri = window.location.origin + window.location.pathname;
const scopes = 'user-top-read';

async function generateCodeVerifier(length = 128) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let verifier = '';
    for (let i = 0; i < length; i++) {
        verifier += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return verifier;
}

async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function redirectToSpotify() {
    const verifier = await generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem('verifier', verifier);

    const url = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&code_challenge=${challenge}` +
        `&code_challenge_method=S256`;

    window.location.href = url;
}

async function getAccessToken(code) {
    const verifier = localStorage.getItem('verifier');
    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: verifier
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    const data = await response.json();
    return data.access_token;
}

async function fetchTopArtists(token) {
    const res = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    const data = await res.json();
    return data.items || [];
}

async function fetchTopTracks(token) {
    const res = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    const data = await res.json();
    return data.items || [];
}

async function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';

        const token = await getAccessToken(code);
        const artists = await fetchTopArtists(token);
        const list = document.getElementById('artistList');

        if (artists.length === 0) {
            list.innerHTML = '<li class="list-group-item">No artists found.</li>';
            return;
        }

        artists.forEach(artist => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex align-items-center';
            li.innerHTML = `
            <img src="${artist.images[0]?.url}" width="50" class="me-3 rounded">
            <strong>${artist.name}</strong> – ${artist.genres.slice(0, 2).join(', ')}
          `;
            list.appendChild(li);
        });
    }
}

main();