import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Stack,
    Typography,
    Autocomplete,
    TextField,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    Chip,
    Tooltip,
    IconButton,
    Avatar,
} from '@mui/material';
import { System, loadSystems, getSystems } from '../data/systems';
import { SystemNode, EdgeSource } from '../types/types';
import { getCharacterInfo, CharacterInfo, refreshSession } from '../utils/auth';
import SecurityIcon from '@mui/icons-material/Security';
import RouteIcon from '@mui/icons-material/Route';
import InfoIcon from '@mui/icons-material/Info';
import PublicIcon from '@mui/icons-material/Public';
import ExploreIcon from '@mui/icons-material/Explore';
import SatelliteIcon from '@mui/icons-material/Satellite';
import TrainIcon from '@mui/icons-material/Train';
import LogoutIcon from '@mui/icons-material/Logout';

const getEdgeSourceIcon = (source: EdgeSource) => {
    switch (source) {
        case 'k-space':
            return <PublicIcon fontSize="small" />;
        case 'eve-scout-thera':
        case 'eve-scout-turnur':
            return <ExploreIcon fontSize="small" />;
        case 'tripwire':
            return <SatelliteIcon fontSize="small" />;
        case 'eve-metro':
            return <TrainIcon fontSize="small" />;
        default:
            return <PublicIcon fontSize="small" />;
    }
};

const getEdgeSourceLabel = (source: EdgeSource) => {
    switch (source) {
        case 'k-space':
            return 'K-Space';
        case 'eve-scout-thera':
            return 'Thera';
        case 'eve-scout-turnur':
            return 'Turnur';
        case 'tripwire':
            return 'Tripwire';
        case 'eve-metro':
            return 'EVE Metro';
        default:
            return source;
    }
};

export default function PathCalculator() {
    const [systems, setSystems] = useState<System[]>([]);
    const [startSystem, setStartSystem] = useState<System | null>(null);
    const [endSystem, setEndSystem] = useState<System | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [route, setRoute] = useState<SystemNode[] | null>(null);
    const [characterInfo, setCharacterInfo] = useState<CharacterInfo>({
        characterId: '',
        characterName: '',
        isAuthenticated: false,
    });
    const [mounted, setMounted] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            setMounted(true);
            const info = await getCharacterInfo(document.cookie);
            setCharacterInfo(info);

            // If we have a refresh token, try to refresh the session
            if (info.isAuthenticated) {
                setIsRefreshing(true);
                try {
                    const refreshed = await refreshSession();
                    if (refreshed) {
                        // Fetch updated character info after refresh
                        const newInfo = await getCharacterInfo(document.cookie);
                        setCharacterInfo(newInfo);
                    }
                } catch (error) {
                    console.error('Failed to refresh session:', error);
                } finally {
                    setIsRefreshing(false);
                }
            }
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                await loadSystems();
                setSystems(getSystems());
            } catch (error) {
                console.error('Failed to load systems:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);


    const handleLogout = () => {
        // Import logout function dynamically to avoid SSR issues
        import('../utils/auth').then(({ logout }) => logout());
    };

    const handleCalculate = async () => {
        if (!startSystem || !endSystem) return;

        setIsCalculating(true);
        setError(null);
        setRoute(null);

        try {
            const response = await fetch('/api/path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: startSystem.id,
                    to: endSystem.id
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to calculate path');
            }

            const result = await response.json();
            setRoute(result);
        } catch (error) {
            console.error('Error calculating path:', error);
            setError(error instanceof Error ? error.message : 'Failed to calculate path');
        } finally {
            setIsCalculating(false);
        }
    };

    const getSecurityColor = (security: number) => {
        if (security >= 0.5) return 'success';
        if (security >= 0.0) return 'warning';
        return 'error';
    };

    return (
        <Box sx={{ 
            maxWidth: 600, 
            mx: 'auto', 
            mt: 4, 
            p: 3,
            minHeight: '100vh'
        }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Stack spacing={3}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            EVE TrafficJam
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Find the optimal route between systems
                        </Typography>
                    </Box>

                    {mounted && (isRefreshing ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : characterInfo.isAuthenticated && characterInfo.characterName ? (
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                flexDirection: 'column',
                                gap: 1
                            }}
                        >
                            <Avatar
                                src={`https://images.evetech.net/characters/${characterInfo.characterId}/portrait?size=256`}
                                sx={{ width: 128, height: 128 }}
                            />
                            <Typography variant="body1" sx={{ mx: 1 }}>
                                {characterInfo.characterName}
                            </Typography>
                            <IconButton
                                onClick={handleLogout}
                                size="small"
                                sx={{ ml: 1 }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            href="/api/auth/login"
                            startIcon={<SecurityIcon />}
                        >
                            Login with EVE SSO
                        </Button>
                    ))}

                    <Divider/>

                    <Stack spacing={2}>
                        <Autocomplete
                            value={startSystem}
                            onChange={(_, newValue) => setStartSystem(newValue)}
                            options={systems}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Start System"
                                    disabled={isLoading || isCalculating || !characterInfo.isAuthenticated}
                                    fullWidth
                                />
                            )}
                            loading={isLoading}
                            loadingText="Loading systems..."
                            noOptionsText="No systems found"
                        />

                        <Autocomplete
                            value={endSystem}
                            onChange={(_, newValue) => setEndSystem(newValue)}
                            options={systems}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="End System"
                                    disabled={isLoading || isCalculating || !characterInfo.isAuthenticated}
                                    fullWidth
                                />
                            )}
                            loading={isLoading}
                            loadingText="Loading systems..."
                            noOptionsText="No systems found"
                        />
                    </Stack>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        onClick={handleCalculate}
                        disabled={!startSystem || !endSystem || isLoading || isCalculating || !characterInfo.isAuthenticated}
                        startIcon={isCalculating ? <CircularProgress size={20} color="inherit" /> : <RouteIcon />}
                    >
                        {isCalculating ? 'Calculating...' : 'Calculate Path'}
                    </Button>

                    {!characterInfo.isAuthenticated && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Please log in to calculate paths
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {route && (
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    Route Details
                                </Typography>
                                <Tooltip title="Route information">
                                    <IconButton size="small">
                                        <InfoIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Stack spacing={1}>
                                {route.map((system, index) => (
                                    <Box 
                                        key={index}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            p: 1,
                                            borderRadius: 1,
                                            bgcolor: index % 2 === 0 ? 'action.hover' : 'background.paper'
                                        }}
                                    >
                                        <Typography sx={{ minWidth: 30, fontWeight: 'bold' }}>
                                            {index + 1}.
                                        </Typography>
                                        <Typography sx={{ flexGrow: 1 }}>
                                            {system.systemName}
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Chip 
                                                icon={<SecurityIcon />}
                                                label={system.systemSecurityStatus.toFixed(1)}
                                                color={getSecurityColor(system.systemSecurityStatus)}
                                                size="small"
                                            />
                                            {index < route.length - 1 && system.systemEdges[0]?.edgeSource && (
                                                <Tooltip title={`Connection via ${getEdgeSourceLabel(system.systemEdges[0].edgeSource)}`}>
                                                    <Chip
                                                        icon={getEdgeSourceIcon(system.systemEdges[0].edgeSource)}
                                                        label={getEdgeSourceLabel(system.systemEdges[0].edgeSource)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Tooltip>
                                            )}
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}
