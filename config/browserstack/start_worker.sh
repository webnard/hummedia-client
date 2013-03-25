#!/bin/bash
/var/www/hummedia/config/browserstack/start_tunnel.sh

BROWSER_ID_STR=$(curl -u "USERNAME:PASSWORD" http://api.browserstack.com/3/worker --data "os=OS%20X&os_version=Mountain%20Lion&browser=safari&browser_version=6.0&url=$1")

echo "Browser ID String $BROWSER_ID_STR" >> leggo.txt

BROWSER_ID=$(expr "$BROWSER_ID_STR" : '.*:\([0-9]\+\)')

echo "Browser ID $BROWSER_ID" >> leggo.txt

trap "{ browserstack kill $BROWSER_ID >> leggo.txt; exit 0; }" EXIT

cat
