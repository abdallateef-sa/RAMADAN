# Deployment Guide (VPS with Caddy & Systemd)

This guide assumes you have a VPS running **Ubuntu 20.04/22.04** and root access.

## 1. Prerequisites

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js (via NVM recommended)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
npm install -g pm2 # Optional, but we will use Systemd as requested
```

### Install Git
```bash
sudo apt install git -y
```

### Install Caddy
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## 2. Project Setup

### Clone Repository
```bash
cd /var/www
sudo mkdir ramadan-planner
sudo chown -R $USER:$USER ramadan-planner
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git ramadan-planner
cd ramadan-planner
```

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
nano .env
# Edit .env with your real MongoDB URI (e.g., local instance) and Email credentials
```

### Frontend Setup & Build
```bash
cd ../client
npm install
npm run build
# This creates a 'dist' folder with static files
```

## 3. Backend Service (Systemd)

Create a systemd service to keep the Express server running.

```bash
sudo nano /etc/systemd/system/ramadan-server.service
```

Paste the following (replace `YOUR_USER` with your actual username):

```ini
[Unit]
Description=Ramadan Planner API Server
After=network.target

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/var/www/ramadan-planner/server
ExecStart=/home/YOUR_USER/.nvm/versions/node/v20.x.x/bin/node index.js
Restart=on-failure
# Environment variables used in .env are handled by the app, 
# but you can explicitly set them here if needed:
# Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Note**: To find your node path, run `which node`. Replace the path in `ExecStart` accordingly.

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ramadan-server
sudo systemctl start ramadan-server
sudo systemctl status ramadan-server
```

## 4. Web Server (Caddy)

Configure Caddy to serve the React frontend and proxy API requests.

```bash
sudo nano /etc/caddy/Caddyfile
```

Replace the content with:

```caddyfile
your-domain.com {
    # Serve React Static Files
    root * /var/www/ramadan-planner/client/dist
    file_server

    # API Proxy
    handle /api/* {
        reverse_proxy localhost:5000
    }

    # SPA Fallback (Important for React Router)
    try_files {path} /index.html
}
```

Reload Caddy:
```bash
sudo systemctl reload caddy
```

## 5. Verification

1.  Open `https://your-domain.com` in your browser.
2.  Test the login functionality (checks API connection).
3.  Check logs if needed:
    *   Backend: `sudo journalctl -u ramadan-server -f`
    *   Caddy: `sudo journalctl -u caddy -f`
