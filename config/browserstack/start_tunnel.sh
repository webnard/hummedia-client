#!/bin/bash
ps aux | grep [B]rowserStackTunnel -q
if [ $? -gt 0 ]
    then
        if [ ! -x ~/.browserstack_config.sh ]; then
                echo "CANNOT load ~/.browserstack_config.sh" 1>&2
                exit 1
        fi
        #if this is not run on a detatched screen, Testacular will not be able to exit
        screen -d -m java -jar /var/www/hummedia/config/browserstack/BrowserStackTunnel.jar $AUTOMATED_TESTING_KEY localhost,9876,0
        sleep 10
fi
