#!/bin/bash


apt-get update
apt-get install -y apache2
rm -rf /var/www
ln -fs /vagrant /var/www

a2enmod proxy proxy_connect proxy_http rewrite headers ssl

cat << 'EOF' > /etc/apache2/sites-available/zelda.byu.edu
<VirtualHost *:443>
    ServerName zelda.byu.edu

    SSLEngine On
    SSLCertificateFile /etc/ssl/certs/ssl-cert-snakeoil.pem
    SSLCertificateKeyFile /etc/ssl/private/ssl-cert-snakeoil.key

    RewriteEngine On
    ProxyPreserveHost On
    SSLProxyEngine On
    RequestHeader set Front-End-Https "On"

    ProxyPass /api/ https://128.187.102.211/api/
    ProxyPassReverse /api/ https://128.187.102.211/api/

    ProxyPass /video/ https://128.187.102.211/video/
    ProxyPassReverse /video/ https://128.187.102.211/video/

    ProxyPass /text/ https://128.187.102.211/text/
    ProxyPassReverse /text/ https://128.187.102.211/text/

    ProxyPass /posters/ https://128.187.102.211/posters/
    ProxyPassReverse /posters/ https://128.187.102.211/posters/

    # APP
    ProxyPass / !
    Alias / /var/www/app/
</VirtualHost>
EOF

if [ ! -f /var/www/app/CONFIG.js ]; then
    cp /var/www/app/CONFIG.default.js /var/www/app/CONFIG.js
fi

a2ensite zelda.byu.edu
service apache2 restart

