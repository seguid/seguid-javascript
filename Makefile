SHELL=bash

all: check-cli


#---------------------------------------------------------------
# Install package
#---------------------------------------------------------------
install: seguid.js cli.js package.json
	npm install


#---------------------------------------------------------------
# Check CLI using 'seguid-tests' test suite
#---------------------------------------------------------------
add-submodules:
	git submodule add https://github.com/seguid/seguid-tests seguid-tests

seguid-tests:
	git submodule init
	git submodule update
	cd seguid-tests && git pull origin main

check-cli: seguid-tests install
	$(MAKE) -C seguid-tests check-cli CLI_CALL="npx seguid"

.PHONY: seguid-tests
