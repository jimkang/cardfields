include config.mk

HOMEDIR = $(shell pwd)
rollup = ./node_modules/.bin/rollup
sirv = ./node_modules/.bin/sirv
TSC = node_modules/typescript/bin/tsc

pushall: sync
	git push origin master

deploy:
	make build && git commit -a -m"Build" && make pushall

build:
	$(rollup) -c

run:
	$(rollup) -c -w

wily-vat:
	APP=wily make run

profiles-vat:
	APP=profiles make run

stores-vat:
	APP=stores make run

groups-vat:
	APP=groups make run

prettier:
	prettier --single-quote --write "**/*.html"

#test:
#	rm -rf tests/fixtures/*
#	node -r ts-node/register tests/initial-cardfields-flow-tests.js

#debug-test:
#	rm -rf tests/fixtures/*
#	node inspect -r ts-node/register tests/initial-cardfields-flow-tests.js

sync:
	rsync -a $(HOMEDIR)/ $(USER)@$(SERVER):/$(APPDIR) \
    --exclude node_modules/ \
		--exclude .git \
    --omit-dir-times \
    --no-perms

set-up-server-dir:
	ssh $(USER)@$(SERVER) "mkdir -p $(APPDIR)"

# https://snapcraft.io/universal-ctags
vim-tags:
	#rm tags
	ctags -R \
    --exclude=built \
    --exclude=node_modules \
    --exclude=package*.json \
    --exclude=.eslintrc.js \
    .

build-tests:
	$(TSC) wily.js/stores.ts --outDir wily.js/tests/build

test:
	node wily.js/tests/store-tests.js
