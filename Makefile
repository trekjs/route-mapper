
MOCHA = ./node_modules/.bin/mocha
BABEL = ./node_modules/.bin/babel
BABEL_NODE = ./node_modules/.bin/babel-node
ISTANBUL = ./node_modules/.bin/istanbul
ESLINT = ./node_modules/.bin/eslint
SRC = lib/*.js

TESTS = test/*.test.js
IOJS_ENV ?= test

BIN = iojs

ifeq ($(findstring io.js, $(shell which node)),)
	BIN = node
endif

ifeq (node, $(BIN))
	FLAGS = --harmony
endif

build:
	mkdir -p lib
	$(BIN) $(BABEL) src --out-dir lib --copy-files

clean:
	rm -rf lib

test:
	@IOJS_ENV=$(IOJS_ENV) $(BIN) $(FLAGS) $(MOCHA) \
		--require babel/register \
		--require should \
		$(TESTS) \
		--bail

bench:
	@$(MAKE) -C benchmarks

lint:
	@$(ESLINT) src

koa:
	@$(BABEL_NODE) ./examples/koa/index.js

express:
	@$(BABEL_NODE) ./examples/express/index.js

.PHONY: test bench

