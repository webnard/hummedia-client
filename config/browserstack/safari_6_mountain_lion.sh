#!/bin/bash
#/var/www/hummedia/config/browserstack/start_tunnel.sh
#curl -u "USERNAME:PASSWORD" http://api.browserstack.com/3/worker --data "os=OS%20X&os_version=Mountain%20Lion&browser=safari&browser_version=6.0&url=$1"

#trap "{ browserstack kill all; exit 0; }" EXIT

#cat

/var/www/hummedia/config/browserstack/start_worker.sh $1
