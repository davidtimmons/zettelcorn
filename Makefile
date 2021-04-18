lock.json: deps.ts
	deno cache --lock=lock.json --lock-write --unstable ./deps.ts

.PHONY: install
install:
	deno cache --reload --lock=lock.json --unstable ./deps.ts

.PHONY: run
run:
	deno run --lock=lock.json --import-map=import_map.json --allow-read --allow-write --unstable ./lib/zettelcorn.ts

.PHONY: test
test:
	deno test --lock=lock.json --import-map=import_map.json --allow-read --allow-write --unstable ./test/
