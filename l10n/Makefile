PERL_CMD = 'say "msgid \"$$1\"\nmsgstr \"\"\n" while m/{{\s*"(.*?)("\s*\|)\s*tr\s*}}/g'
TRANSLATABLES = $(shell find ../app/partials/ -type d)

all:
	#perl -E 'for (split /\s*?(\.\.\/app\/partials)/, $(TRANSLATABLES)){say "dog"}'
	perl -nE $(PERL_CMD) ../app/index.html > default.pot
	for directory in $(TRANSLATABLES); do perl -nE $(PERL_CMD) $$directory/*.html; done;
