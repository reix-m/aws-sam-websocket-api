.PHONY: build-RuntimeDependenciesLayer build-lambda-common
.PHONY: build-ConnectFunction build-DisconnectFunction build-DefaultFunction build-SendEventFunction

build-ConnectFunction:
	$(MAKE) HANDLER=src/functions/connect.ts build-lambda-common
build-DisconnectFunction:
	$(MAKE) HANDLER=src/functions/disconnect.ts build-lambda-common
build-DefaultFunction:
	$(MAKE) HANDLER=src/functions/default.ts build-lambda-common
build-SendEventFunction:
	$(MAKE) HANDLER=src/functions/send-event.ts build-lambda-common

build-lambda-common:
	npm install
	rm -rf dist
	printf "{\"extends\": \"./tsconfig.build.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	npm run build -- --build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --omit=dev --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json"
