include config.mk

HOMEDIR = $(shell pwd)
rollup = ./node_modules/.bin/rollup
sirv = ./node_modules/.bin/sirv

pushall: sync
	git push origin master

deploy:
	make build && git commit -a -m"Build" && make pushall

build:
	$(rollup) -c

run:
	$(rollup) -c -w
	$(sirv) public --host 0.0.0.0

card-render-test:
	cd vats/card && \
    ../../$(rollup) \
    --config card-render-test.config.js \
    --watch

prettier:
	prettier --single-quote --write "**/*.html"

test:
	rm -rf tests/fixtures/*
	node -r ts-node/register tests/initial-cardfields-flow-tests.js

debug-test:
	rm -rf tests/fixtures/*
	node inspect -r ts-node/register tests/initial-cardfields-flow-tests.js

sync:
	rsync -a $(HOMEDIR)/ $(USER)@$(SERVER):/$(APPDIR) \
    --exclude node_modules/ \
		--exclude .git \
    --omit-dir-times \
    --no-perms

set-up-server-dir:
	ssh $(USER)@$(SERVER) "mkdir -p $(APPDIR)"
