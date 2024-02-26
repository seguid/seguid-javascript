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
seguid-tests:
	cd seguid-tests && git pull origin main
	git submodule init
	git submodule update

check-cli: seguid-tests install
	$(MAKE) -C seguid-tests check-cli CLI_CALL="npx seguid"

.PHONY: seguid-tests