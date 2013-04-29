SHELL:=/bin/bash
PERL_CMD = 'say "msgid \"$$1\"" while m/{{\s*"(.*?)("\s*\|)\s*tr\s*}}/g'
DIRECTIVE_FILES = $(shell find ../app/js/directives/ -type d)
PARTIAL_FILES = $(shell find ../app/partials/ -type d)
JSON_DIR = "../app/translations/"

all: pot json

pot:
	@rm -f default.pot
	@echo Pulling phrases from index.html
	@perl -nE $(PERL_CMD) ../app/index.html > default.pot.tmp
	@echo Extracting from partial files
	@for directory in $(PARTIAL_FILES); do perl -nE $(PERL_CMD) $$directory/*.html >> default.pot.tmp; done;
	@echo Extracting from directive files
	@for directory in $(DIRECTIVE_FILES); do perl -nE $(PERL_CMD) $$directory/*.js >> default.pot.tmp; done;
	@awk '{key=""; for(i=2; i<= NF; i++) key = key$$i; a[$$key]=$$0} END {for (i in a) {gsub(/\\'\''/,"'\''",a[i]); print a[i]; print "msgstr \"\"\n"}}' default.pot.tmp > default.pot.tmp2
	@rm default.pot.tmp
	@awk '{printf("%s%c",$$0,(NR%3==0)?"\n":0)}' default.pot.tmp2 | sort | tr "\0" "\n" >> default.pot
	@rm default.pot.tmp2
	@echo default.pot created!    

json:
	@for file in translations/*po; do base=$$(basename $$file); python po2json.py $$file > "$(JSON_DIR)$${base:0:-3}.json"; done;
	@echo JSON files created.
	@echo Creating list of languages
	@echo [ > $(JSON_DIR)ALL.json
	@for file in translations/*po; do base=$$(basename $$file); echo \"$${base:0:-3}\", >> $(JSON_DIR)ALL.json; done;
	@sed -i '$$s/,$$//' $(JSON_DIR)ALL.json #remove trailing comma
	@echo ] >> $(JSON_DIR)ALL.json
