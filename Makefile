SHELL=bash

all: check-cli check-api


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
	cd seguid-tests && git fetch origin && git reset --hard origin/main

check-cli: seguid-tests install
	$(MAKE) -C "$<" check-cli/seguid-javascript

check-api: seguid-tests
	$(MAKE) -C "$<" check-api/seguid-javascript

.PHONY: seguid-tests
