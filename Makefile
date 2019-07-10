dev:
	npm run webpack-dev-server

install-deps:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npm run webpack

lint:
	npm run eslint ./src

publish:
	npm publish --dry-run

.PHONY: test