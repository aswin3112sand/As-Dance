# AS DANCE - Production Deployment Guide

## 🚀 Server Setup & Deployment Steps

### 1️⃣ System Update + DNS Tools
```bash
apt update -y && apt upgrade -y
apt install dnsutils dig ufw -y
```

---

### 2️⃣ Spring Boot as Systemd Service (Auto-restart)

Create service file:
```bash
cat <<EOF > /etc/systemd/system/asdance.service
[Unit]
Description=AS Dance Spring Boot App
After=network.target

[Service]
ExecStart=/usr/bin/java -jar /opt/as-dance-backend-1.0.0.jar --server.port=8085
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF
```

Enable & start:
```bash
systemctl daemon-reload
systemctl enable asdance.service
systemctl restart asdance.service
systemctl status asdance.service
```

✅ **Verify**: Status shows `active (running)`

---

### 3️⃣ Frontend Build Permissions

```bash
chmod -R 755 /opt/frontend-build
chown -R root:root /opt/frontend-build
```

---

### 4️⃣ Nginx Configuration

Edit Nginx config:
```bash
nano /etc/nginx/sites-available/asdancz
```

Replace with:
```nginx
server {
    listen 80;
    server_name asdancz.in www.asdancz.in;

    root /opt/frontend-build;
    index index.html;

    location /assets/ {
        types {
            text/css css;
            application/javascript js;
        }
        try_files $uri =403;
    }

    location / {
        proxy_pass http://127.0.0.1:8085;
        proxy_set_header Host $host;
    }
}
```

Save: `CTRL+X` → `Y` → `Enter`

Test & restart:
```bash
nginx -t
systemctl restart nginx
systemctl status nginx
```

✅ **Verify**: `syntax is ok` and `nginx active (running)`

---

### 5️⃣ Firewall Configuration

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
ufw status
```

✅ **Verify**: Ports 22, 80, 443 show `ALLOW`

---

### 6️⃣ DNS Propagation Check

```bash
dig asdancz.in +short
```

✅ **Expected**: IP address (e.g., `72.61.248.167`)
⏳ **If empty**: Wait for DNS propagation (can take 24-48 hours)

---

### 7️⃣ SSL Certificate (Let's Encrypt)

Install Certbot:
```bash
apt install certbot python3-certbot-nginx -y
```

Generate certificate:
```bash
certbot certonly --nginx -d asdancz.in -d www.asdancz.in
```

Update Nginx for HTTPS:
```bash
nano /etc/nginx/sites-available/asdancz
```

Add SSL block:
```nginx
server {
    listen 443 ssl http2;
    server_name asdancz.in www.asdancz.in;

    ssl_certificate /etc/letsencrypt/live/asdancz.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/asdancz.in/privkey.pem;

    root /opt/frontend-build;
    index index.html;

    location /assets/ {
        types {
            text/css css;
            application/javascript js;
        }
        try_files $uri =403;
    }

    location / {
        proxy_pass http://127.0.0.1:8085;
        proxy_set_header Host $host;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name asdancz.in www.asdancz.in;
    return 301 https://$server_name$request_uri;
}
```

Restart Nginx:
```bash
nginx -t
systemctl restart nginx
```

Test SSL renewal:
```bash
certbot renew --dry-run
```

✅ **Verify**: Certificate renews successfully

---

### 8️⃣ Access Application

Open browser:
```
https://asdancz.in
```

Clear cache if needed:
- **Windows/Linux**: `Ctrl+Shift+R`
- **Mac**: `Cmd+Shift+R`
- **Or**: Open in Incognito mode

✅ **Success**: App loads with HTTPS

---

## 📋 Verification Checklist

| Step | Command | Expected Result |
|------|---------|-----------------|
| System | `apt update -y` | No errors |
| Service | `systemctl status asdance.service` | `active (running)` |
| Nginx | `nginx -t` | `syntax is ok` |
| Firewall | `ufw status` | Ports 22, 80, 443 `ALLOW` |
| DNS | `dig asdancz.in +short` | IP address returned |
| SSL | `certbot renew --dry-run` | Renewal successful |
| App | `https://asdancz.in` | Page loads |

---

## 🔧 Troubleshooting

### Port 8085 Already in Use
```bash
lsof -i :8085
kill -9 <PID>
systemctl restart asdance.service
```

### Nginx Not Starting
```bash
nginx -t  # Check syntax
systemctl restart nginx
journalctl -u nginx -n 50  # View logs
```

### DNS Not Resolving
```bash
dig asdancz.in
nslookup asdancz.in
# Wait for propagation if empty
```

### SSL Certificate Issues
```bash
certbot certificates  # List certificates
certbot renew --force-renewal  # Force renew
```

### Frontend Assets 404
```bash
ls -la /opt/frontend-build/assets/
# Rebuild if empty: npm run build:backend
```

---

## 🔄 Maintenance

### Auto SSL Renewal
Certbot automatically renews 30 days before expiry. Check:
```bash
systemctl status certbot.timer
```

### View Logs
```bash
# Spring Boot
journalctl -u asdance.service -f

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
systemctl restart asdance.service
systemctl restart nginx
```

---

## 📍 Production URLs

- **Domain**: https://asdancz.in
- **Backend API**: http://127.0.0.1:8085 (internal)
- **Frontend**: Served by Nginx from `/opt/frontend-build`

