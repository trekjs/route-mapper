
SRC = lib/*.js

TESTS = test/*.test.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--compilers js:6to5/register \
		--require should \
		$(TESTS) \
		--bail

bench:
		@$(MAKE) -C benchmarks

.PHONY: test bench

