#!/bin/bash
if [ ! -x ~/.browserstack_config.sh ]; then
        echo "CANNOT EXECUTE ~/.browserstack_config.sh" 1>&2
        exit 1
fi

. ~/.browserstack_config.sh

# check each of our variables to see if they exist
for k in AUTOMATED_TESTING_KEY OS OS_VERSION BROWSER BROWSER_VERSION USERNAME PASSWORD
do
    if [ -z "${!k}" ]
    then
        echo "Variable $k does not exist in your config";
        exit 1;
    fi
done

ps aux | grep [B]rowserStackTunnel -q
if [ $? -gt 0 ]
    then
        #if this is not run on a detatched screen, Testacular will not be able to exit
        screen -d -m java -jar /var/www/hummedia/config/browserstack/BrowserStackTunnel.jar $AUTOMATED_TESTING_KEY localhost,9876,0
        sleep 10
fi
