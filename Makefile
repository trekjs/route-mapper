
MOCHA = ./node_modules/.bin/mocha
TO5 = ./node_modules/.bin/6to5-node

SRC = lib/*.js

TESTS = test/*.test.js

test:
	@NODE_ENV=test $(MOCHA) \
		--require test/6to5.js \
		--require should \
		$(TESTS) \
		--bail

bench:
		@$(MAKE) -C benchmarks

koa:
	@$(TO5) ./examples/koa/index.js

express:
	@$(TO5) ./examples/express/index.js

.PHONY: test bench

