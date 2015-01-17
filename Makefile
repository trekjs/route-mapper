
MOCHA = ./node_modules/.bin/mocha

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

.PHONY: test bench

