#!/bin/bash
/var/www/hummedia/config/browserstack/start_tunnel.sh

if [ $? -gt 0 ]
then
    exit $!
fi

BROWSER_ID_STR=$(curl -u "USERNAME:PASSWORD" http://api.browserstack.com/3/worker --data-urlencode "os=$OS&os_version=$OS_VERSION&browser=$BROWSER&browser_version=$BROWSE&url=$1")

echo "Browser ID String $BROWSER_ID_STR" >> leggo.txt

BROWSER_ID=$(expr "$BROWSER_ID_STR" : '.*:\([0-9]\+\)')

echo "Browser ID $BROWSER_ID" >> leggo.txt

trap "{ browserstack kill $BROWSER_ID >> leggo.txt; exit 0; }" EXIT

cat
