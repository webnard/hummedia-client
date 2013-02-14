#!/usr/bin/python
import json
import argparse
import re
parser = argparse.ArgumentParser(description='Convert a .po file into a JSON key-value format')
parser.add_argument("input", help="The name of the .po file to parse.", type=str)
args = parser.parse_args()

po_file = open(args.input,'r')

key = ""
translations = {}

for line in po_file:
    match = re.match("^msgid\s*\"(.*?)(?:\"$)",line)
    if match:
        key = match.group(1)
    else:
        match = re.match("^msgstr\s*\"(.*?)(?:\"$)",line)
        if match:
            translations[key] = match.group(1)
print json.dumps(translations)
