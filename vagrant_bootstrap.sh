#!/usr/bin/env bash

apt-get update
apt-get install -y apache2
rm -rf /var/www
ln -fs /vagrant /var/www

a2enmod proxy*
a2enmod rewrite
a2enmod ssl

cat << 'EOF' > /etc/apache2/sites-available/zelda.byu.edu
<VirtualHost *:443>
    ServerName zelda.byu.edu

    SSLEngine On
    SSLCertificateFile /etc/ssl/certs/ssl-cert-snakeoil.pem
    SSLCertificateFile /etc/ssl/private/ssl-cert-snakeoil.key

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
    Alias / /var/www/hummedia/
</VirtualHost>
EOF

a2ensite zelda.byu.edu
service apache2 restart
