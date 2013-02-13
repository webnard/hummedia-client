all:
	perl -nE 'say "msgid \"$$1\"\nmsgstr \"\"\n" while m/{{\s*(.*?)(\s*\|)\s*tr\s*}}/g' ../app/*.html > default.pot
