SHELL:=/bin/bash
PERL_CMD = 'say "msgid \"$$1\"\nmsgstr \"\"\n" while m/{{\s*"(.*?)("\s*\|)\s*tr\s*}}/g'
TO_TRANSLATE = $(shell find ../app/partials/ -type d)
TRANSLATIONS = $(wildcard translations/*.po)
pot:
	@echo Pulling phrases from index.html
	@perl -nE $(PERL_CMD) ../app/index.html > default.pot
	@echo Extracting from partial files
	@for directory in $(TO_TRANSLATE); do perl -nE $(PERL_CMD) $$directory/*.html >> default.pot; done;
	@echo default.pot created!    

json:
	@for file in translations/*po; do base=$$(basename $$file); python po2json.py $$file > "../app/translations/$${base:0:-3}.json"; done;
	@echo JSON files created.
