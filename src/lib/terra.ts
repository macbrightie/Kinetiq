export const generateTerraWidgetUrl = async (referenceId: string, providers?: string) => {
    const TERRA_API_KEY = process.env.TERRA_API_KEY;
    const TERRA_DEV_ID = process.env.TERRA_DEV_ID;

    if (!TERRA_API_KEY || !TERRA_DEV_ID) {
        console.error('Terra Error: TERRA_API_KEY or TERRA_DEV_ID is missing from environment variables');
        return undefined;
    }

    try {
        const response = await fetch('https://api.tryterra.co/v2/auth/generateWidgetSession', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'dev-id': TERRA_DEV_ID!,
                'x-api-key': TERRA_API_KEY!,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                reference_id: referenceId,
                providers: providers || 'APPLE,STRAVA', // Default to common fitness apps
                language: 'en',
                auth_success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
                auth_failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=terra`,
            })
        });

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Terra widget generation failed:', error);
        return null;
    }
};
