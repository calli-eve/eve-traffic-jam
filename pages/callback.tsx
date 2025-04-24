import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

export default function Callback() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            const { code, state } = router.query;
            
            if (!code || !state) {
                setError('Missing required parameters');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/auth/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, state }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Authentication failed');
                }

                // Redirect to home page after successful authentication
                router.push('/');
            } catch (error) {
                console.error('Authentication error:', error);
                setError(error instanceof Error ? error.message : 'Authentication failed');
                setIsLoading(false);
            }
        };

        if (router.isReady) {
            handleCallback();
        }
    }, [router]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                p: 3,
            }}
        >
            {isLoading ? (
                <>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Authenticating...
                    </Typography>
                </>
            ) : error ? (
                <Alert severity="error" sx={{ maxWidth: 600 }}>
                    {error}
                </Alert>
            ) : null}
        </Box>
    );
} 