export const getStravaAuthUrl = (referenceId: string) => {
    const clientId = process.env.STRAVA_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/strava/callback`;
    const scope = 'read,activity:read_all';
    
    return `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${referenceId}`;
};

export const exchangeStravaCode = async (code: string) => {
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    
    const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code'
        })
    });
    
    return response.json();
};

export const refreshStravaToken = async (refreshToken: string) => {
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    
    const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        })
    });
    
    return response.json();
};
