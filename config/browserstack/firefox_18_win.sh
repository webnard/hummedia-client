#!/bin/bash
/var/www/hummedia/config/browserstack/start_tunnel.sh
curl -u "USERNAME:PASSWORD" http://api.browserstack.com/3/worker --data "os=Windows&os_version=7&browser=firefox&browser_version=18.0&url=$1"

cat
