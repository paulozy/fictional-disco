# 🔐 CORS Configuration Guide

## Overview

The Fictional Disco API includes automatic CORS (Cross-Origin Resource Sharing) configuration that adapts based on the deployment environment.

## Environment Detection

The CORS configuration is determined by the `NODE_ENV` environment variable:

- **Development** (`NODE_ENV != "production"`): Allow all origins
- **Production** (`NODE_ENV = "production"`): Restrict to configured origins only

## Configuration

### Environment Variables

```bash
# Set the environment
NODE_ENV=production

# Frontend URL (primary allowed origin)
FRONTEND_URL=https://myapp.com

# Additional allowed origins (optional, comma-separated)
ALLOWED_ORIGINS=https://app.myapp.com,https://staging.myapp.com
```

### Development Environment

```bash
NODE_ENV=development
```

- ✅ Allows requests from **any origin** (`*`)
- ✅ Useful for local development with multiple frontends
- ✅ Allows credentials
- ⚠️ Do NOT use in production

**Example: Local Development**
```bash
# .env
NODE_ENV=development
PORT=3000
```

### Production Environment

```bash
NODE_ENV=production
FRONTEND_URL=https://myapp.com
```

- ✅ Restricts requests to configured origins only
- ✅ Only `FRONTEND_URL` and `ALLOWED_ORIGINS` are allowed
- ✅ Enhanced security
- ✅ Credentials enabled for authenticated requests

**Example: Production**
```bash
# .env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://myapp.com
ALLOWED_ORIGINS=https://app.myapp.com,https://staging.myapp.com
```

## Allowed Methods & Headers

All environments allow:

**HTTP Methods:**
- GET
- POST
- PUT
- DELETE
- PATCH
- OPTIONS

**Headers:**
- `Content-Type`
- `Authorization` (for JWT tokens)
- `ngrok-skip-browser-warning` (for ngrok tunneling)

**Max Age:** 24 hours (for CORS preflight cache)

## Logging

CORS configuration is logged on application startup with details about:
- Current environment
- Whether all origins are allowed
- Specific allowed origins (in production)
- Any custom origins added

Example log output:
```
[INFO] [CORS] {Configuration} Setting up CORS configuration | {"environment":"production","isDevelopment":false,"allowedOrigins":["https://myapp.com"]}
[INFO] [CORS] {Configuration} Added FRONTEND_URL to allowed origins | {"url":"https://myapp.com"}
```

## Security Considerations

### Development vs Production

| Feature | Development | Production |
|---------|-------------|-----------|
| Origin Restriction | None (all allowed) | Configured only |
| Credentials | Yes | Yes |
| Preflight Cache | 24h | 24h |
| Recommended Use | Local testing only | Deployment |

### Best Practices

1. **Always set `NODE_ENV=production` in production**
   ```bash
   export NODE_ENV=production
   ```

2. **Configure `FRONTEND_URL` for your main domain**
   ```bash
   FRONTEND_URL=https://myapp.com
   ```

3. **Use `ALLOWED_ORIGINS` for additional domains**
   ```bash
   ALLOWED_ORIGINS=https://app.myapp.com,https://staging.myapp.com
   ```

4. **Never expose development mode in production**
   - Use proper environment detection
   - Do not hardcode origins

5. **Monitor CORS rejections**
   - Check logs for rejected origins
   - Warnings indicate origins not in allowed list

## Troubleshooting

### CORS Error: "No 'Access-Control-Allow-Origin' header"

**Cause:** Your frontend origin is not in the allowed list

**Solution:**
```bash
# Add your frontend URL
FRONTEND_URL=https://your-frontend.com
```

### CORS Error in Production

**Check:**
1. Verify `NODE_ENV=production` is set
2. Check `FRONTEND_URL` matches your frontend domain
3. Review logs for specific rejected origins
4. Add additional origins via `ALLOWED_ORIGINS` if needed

### Working in Development but Not Production

**Common Issue:** Forgot to configure `FRONTEND_URL`

**Fix:**
```bash
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

## API Response Example

All endpoints respect CORS configuration:

```bash
# Development
curl -X GET http://localhost:3000/health \
  -H "Origin: http://any-domain.com"
# Response: ✅ OK with CORS headers

# Production (if origin not allowed)
curl -X GET https://api.myapp.com/health \
  -H "Origin: http://unauthorized-domain.com"
# Response: ❌ No CORS headers (origin rejected)
```

---

For more information, see [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
