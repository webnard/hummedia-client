#!/bin/bash
. /var/www/hummedia/config/browserstack/start_tunnel.sh

if [ $? -gt 0 ]
then
    exit $!
fi

for k in OS OS_VERSION BROWSER BROWSER_VERSION USERNAME PASSWORD
do
    if [ -z "${!k}" ]
    then
        echo "Variable $k does not exist in your config";
        exit 1;
    fi
done

BROWSER_ID_STR=$(curl -u "$USERNAME:$PASSWORD" http://api.browserstack.com/3/worker --data-urlencode "os=$OS" --data-urlencode "os_version=$OS_VERSION" --data-urlencode "browser=$BROWSER" --data-urlencode "browser_version=$BROWSER_VERSION" --data-urlencode "url=$1")

BROWSER_ID=$(expr "$BROWSER_ID_STR" : '.*:\([0-9]\+\)')

# Kills the browser
trap "{ curl -u \"$USERNAME:$PASSWORD\" http://api.browserstack.com/3/worker/$BROWSER_ID -X DELETE > test.txt; exit 0; }" EXIT

cat
