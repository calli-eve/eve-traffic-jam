# EVE Online Traffic Jam

A standalone pathfinding application for EVE Online that combines data from multiple sources to find optimal routes between systems.

## Environment Variables

The application requires the following environment variables to be set:

### Authentication
- `EVE_SSO_CLIENT_ID`: Your EVE Online SSO application client ID
- `EVE_SSO_SECRET_KEY`: Your EVE Online SSO application secret key
- `EVE_SSO_CALLBACK_URL`: The callback URL for EVE SSO (e.g., `http://localhost:3000/callback` for development)

### Data Sources
- `EVE_SCOUT_PUBLIC_SIGNATURE_URL`: URL for EVE Scout public signature data
- `TRIPWIRE_HOST`: Tripwire API host URL
- `TRIPWIRE_USER`: Tripwire API username
- `TRIPWIRE_PASSWORD`: Tripwire API password
- `TRIPWIRE_MASK`: Tripwire mask ID
- `EVE_METRO_API_KEY`: EVE Metro API key
- `EVE_METRO_API_URL`: EVE Metro API URL
- `EVE_METRO_CHARACTER_ID`: (Optional) EVE Metro character ID
- `EVE_METRO_CORPORATION_ID`: (Optional) EVE Metro corporation ID
- `EVE_METRO_ALLIANCE_ID`: (Optional) EVE Metro alliance ID

### Logging
- `LOGGING_ENDPOINT`: (Optional) Endpoint for usage statistics logging. If not set, logs will be written to console.

### Configuration
- `NODE_ENV`: Environment (development/production)
- `PORT`: Port to run the application on (default: 3000)