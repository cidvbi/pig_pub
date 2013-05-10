#! /bin/bash

# update pig to molvis

scp -r /opt/httpd/documents/pig/app/ tim@molvis.vbi.vt.edu:/var/www/pig451/
scp /opt/httpd/documents/pig/app.js tim@molvis.vbi.vt.edu:/var/www/pig451/

scp -r /opt/httpd/documents/pig/data/ tim@molvis.vbi.vt.edu:/var/www/pig451/

scp /opt/httpd/documents/pig/index.html tim@molvis.vbi.vt.edu:/var/www/pig451/

scp -r /opt/httpd/documents/pig/resources/ tim@molvis.vbi.vt.edu:/var/www/pig451/

scp -r /opt/httpd/documents/pig/viewer/ tim@molvis.vbi.vt.edu:/var/www/pig451/

