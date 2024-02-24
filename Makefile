SHELL=bash

all: install check check-cli


#---------------------------------------------------------------
# Install package
#---------------------------------------------------------------
install:
	npm install


#---------------------------------------------------------------
# Check CLI using 'seguid-tests' test suite
#---------------------------------------------------------------
seguid-tests:
	git clone --depth=1 https://github.com/seguid/seguid-tests.git

check-cli: seguid-tests install
	export SEGUID_HOME="$${PWD}"; \
	export NODE_PATH="$${SEGUID_HOME}/node_modules"; \
	cd "$<" && git pull && make check-cli CLI_CALL="node $${SEGUID_HOME}/cli.js"
