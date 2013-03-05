SHELL:=/bin/bash
PERL_CMD = 'say "msgid \"$$1\"" while m/{{\s*"(.*?)("\s*\|)\s*tr\s*}}/g'
TO_TRANSLATE = $(shell find ../app/partials/ -type d)
JSON_DIR = "../app/translations/"

all: pot json

pot:
	@echo Pulling phrases from index.html
	@perl -nE $(PERL_CMD) ../app/index.html > default.pot.tmp
	@echo Extracting from partial files
	@for directory in $(TO_TRANSLATE); do perl -nE $(PERL_CMD) $$directory/*.html >> default.pot.tmp; done;
	@echo Extracting text from directives
	@perl -nE $(PERL_CMD) ../app/js/directives.js >> default.pot.tmp
	@awk '{a[$$2]=$$0} END {for (i in a) {print a[i]; print "msgstr \"\"\n"}}' default.pot.tmp > default.pot
	@rm default.pot.tmp
	@echo default.pot created!    

json:
	@for file in translations/*po; do base=$$(basename $$file); python po2json.py $$file > "$(JSON_DIR)$${base:0:-3}.json"; done;
	@echo JSON files created.
	@echo Creating list of languages
	@echo [ > $(JSON_DIR)ALL.json
	@for file in translations/*po; do base=$$(basename $$file); echo \"$${base:0:-3}\", >> $(JSON_DIR)ALL.json; done;
	@sed -i '$$s/,$$//' $(JSON_DIR)ALL.json #remove trailing comma
	@echo ] >> $(JSON_DIR)ALL.json
