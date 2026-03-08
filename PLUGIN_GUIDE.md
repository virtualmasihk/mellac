# MellAC Plugin Integration Guide

## Overview

MellAC is an advanced anti-cheat system for Minecraft servers. This guide explains how to integrate the plugin with the web panel and send cheat detection data.

## Server Setup

### Step 1: Create a Server in the Panel

1. Go to `/dashboard/servers`
2. Click "Add New Server"
3. Fill in the form:
   - **Server Name**: Name of your server
   - **Server IP**: Your server's IP address
   - **Server Port**: Default is 25565 (optional)
4. Click "Add Server"
5. Copy the **API Key** that appears (you'll need this in step 2)

### Step 2: Configure Your Plugin

Create a `config.yml` file in your `plugins/MellAC/` directory:

```yaml
mellac:
  api_key: "srv_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  api_endpoint: "https://your-domain.com/api/cheat-reports"
  enabled: true
  
detection:
  aimbot:
    enabled: true
    sensitivity: 0.8
  speedhack:
    enabled: true
    threshold: 1.5
  reach:
    enabled: true
    max_reach: 3.5
```

### Step 3: Restart Your Server

Run the following command or restart your server:

```
/reload confirm
```

## Sending Cheat Detection Data

### API Endpoint

```
POST /api/cheat-reports
```

### Request Format

```json
{
  "api_key": "srv_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "player_name": "PlayerName",
  "player_ip": "192.168.1.100",
  "cheat_type": "aimbot",
  "cheat_reason": "Suspicious aiming pattern detected",
  "severity": "high"
}
```

### Parameters

- **api_key** (required): Your server's API key from the panel
- **player_name** (required): Name of the suspected player
- **player_ip** (optional): IP address of the player
- **cheat_type** (required): Type of cheat detected (e.g., "aimbot", "speedhack", "reach")
- **cheat_reason** (optional): Detailed reason for detection
- **severity** (optional): "low", "medium", or "high" (default: "medium")

### Example cURL Request

```bash
curl -X POST https://your-domain.com/api/cheat-reports \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "srv_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "player_name": "Hacker123",
    "player_ip": "192.168.1.100",
    "cheat_type": "aimbot",
    "cheat_reason": "Impossible flick shot angles",
    "severity": "high"
  }'
```

### Example JavaScript/Node.js

```javascript
async function reportCheat(cheatData) {
  const response = await fetch('/api/cheat-reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: process.env.MELLAC_API_KEY,
      ...cheatData,
    }),
  });

  if (!response.ok) {
    console.error('Failed to report cheat:', await response.json());
  }
}

// Usage
reportCheat({
  player_name: 'PlayerName',
  player_ip: '192.168.1.100',
  cheat_type: 'speedhack',
  cheat_reason: 'Player speed exceeded 0.3 blocks/tick',
  severity: 'medium',
});
```

### Example Java/Bukkit Plugin

```java
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import com.google.gson.JsonObject;
import com.google.gson.Gson;

public class MellACReporter {
    private static final String API_ENDPOINT = "https://your-domain.com/api/cheat-reports";
    private static final String API_KEY = "srv_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    
    public static void reportCheat(String playerName, String playerIp, String cheatType, String reason, String severity) {
        try {
            URL url = new URL(API_ENDPOINT);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            
            JsonObject json = new JsonObject();
            json.addProperty("api_key", API_KEY);
            json.addProperty("player_name", playerName);
            json.addProperty("player_ip", playerIp);
            json.addProperty("cheat_type", cheatType);
            json.addProperty("cheat_reason", reason);
            json.addProperty("severity", severity);
            
            String jsonString = new Gson().toJson(json);
            
            conn.setDoOutput(true);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonString.getBytes());
            }
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                System.out.println("Cheat report sent successfully!");
            } else {
                System.out.println("Failed to send cheat report: " + responseCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## Viewing Reports

Once your plugin sends cheat detection data:

1. Go to `/dashboard/servers/[server-id]` to view:
   - Total detections
   - Flagged players
   - Chart of cheat types
   - Recent detection logs
   - Top offenders

## API Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Чат отчет получен"
}
```

### Error Response (401 Unauthorized)

```json
{
  "error": "Некорректный API ключ"
}
```

### Error Response (400 Bad Request)

```json
{
  "error": "Некорректные данные"
}
```

## Supported Cheat Types

- `aimbot` - Automated aiming
- `speedhack` - Increased movement speed
- `reach` - Extended attack reach
- `noclip` - Passing through blocks
- `fly` - Unauthorized flight
- `killaura` - Automated attacking
- `scaffold` - Automated block placement
- `bhop` - Bunny hopping
- `xray` - Block transparency
- `fastplace` - Rapid block placement

## Best Practices

1. **Use HTTPS**: Always send data over HTTPS for security
2. **Validate Reports**: Implement reasonable thresholds before reporting
3. **Rate Limiting**: Don't spam reports for the same player
4. **Keep API Key Secret**: Never expose your API key in public code
5. **Test First**: Test your integration in a development environment

## Troubleshooting

### API Key Not Recognized
- Verify the API key is copied correctly
- Check that the server hasn't been deleted from the panel
- Ensure the key starts with `srv_`

### Data Not Appearing in Panel
- Check that your plugin is sending data to the correct endpoint
- Verify the server's API key matches the one in config.yml
- Check your server's internet connection

### Connection Timeout
- Verify your firewall allows outbound HTTPS connections
- Check if the panel is accessible from your server location
- Try pinging the API endpoint manually

## Support

For issues or questions:
- Visit the [Documentation](https://your-domain.com/dashboard/wiki)
- Join our [Discord Community](https://discord.gg/mellac)
- Email: support@mellac.ru
