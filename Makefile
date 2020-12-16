include config.mk

HOMEDIR = $(shell pwd)

pushall: sync
	git push origin master

deploy:
	make build && git commit -a -m"Build" && make pushall

build:
	./node_modules/.bin/rollup -c

prettier:
	prettier --single-quote --write "**/*.html"

test:
	rm -rf tests/fixtures/*
	node -r ts-node/register tests/initial-chaos-galaxies-flow-tests.js

debug-test:
	rm -rf tests/fixtures/*
	node inspect -r ts-node/register tests/initial-chaos-galaxies-flow-tests.js

sync:
	rsync -a $(HOMEDIR)/ $(USER)@$(SERVER):/$(APPDIR) \
    --exclude node_modules/ \
		--exclude .git \
    --omit-dir-times \
    --no-perms

set-up-server-dir:
	ssh $(USER)@$(SERVER) "mkdir -p $(APPDIR)"
