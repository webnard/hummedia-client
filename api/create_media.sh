#!/bin/bash

# c/o Matt Tardiff / Stackoverflow http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "$0" )" && pwd )"

cd $DIR

mkdir -p real_files
mkdir -p ingest
mkdir -p movies

cd real_files

rm trailer.*

wget http://video.webmfiles.org/big-buck-bunny_trailer.webm -O trailer.webm
wget http://video.blendertestbuilds.de/download.blender.org/peach/trailer_480p.mov -O trailer.mp4

cd ../ingest

rm ingest-me.mp4
wget http://ftp.nluug.nl/ftp/graphics/blender/apricot/trailer/sintel_trailer-480p.mp4 -O ingest-me.mp4

FILES=`mongo hummedia --eval "db.assets.find().forEach(function(a){ if(a[\"@graph\"][\"ma:locator\"][0][\"@id\"]){ print(a[\"@graph\"][\"ma:locator\"][0][\"@id\"])}})"`

cd ../movies

rm *.webm *.mp4
for FILE in $FILES; do
    ln -s ../real_files/trailer.webm "${FILE}.webm"
    ln -s ../real_files/trailer.mp4 "${FILE}.mp4"
done
