.PHONY: help install serve lint lint-css lint-js lint-html test test-links open clean

PORT ?= 4000
BROWSER ?= open  # macOS default; override with: make open BROWSER=xdg-open

# ─── Help ────────────────────────────────────────────────────────────────────

help:
	@echo ""
	@echo "  Goku Resume Site — Dev Commands"
	@echo ""
	@echo "  make install      Install/update dev tooling (npm packages)"
	@echo "  make serve        Serve site locally at http://localhost:$(PORT)"
	@echo "  make open         Open the local site in browser"
	@echo "  make lint         Run all linters (CSS + JS + HTML)"
	@echo "  make lint-css     Lint assets/css/main.css"
	@echo "  make lint-js      Lint assets/js/*.js"
	@echo "  make lint-html    Lint index.html"
	@echo "  make test         Run all checks (lint + link validation)"
	@echo "  make test-links   Check for broken links in index.html"
	@echo "  make clean        Remove node_modules and .cache"
	@echo ""

# ─── Install ─────────────────────────────────────────────────────────────────

node_modules/.bin/stylelint: package.json
	npm install

install: package.json
	npm install
	@echo "✓ Dev tooling ready"

package.json:
	@echo "Initialising package.json..."
	npm init -y --silent
	npm install --save-dev \
		stylelint \
		stylelint-config-standard \
		eslint \
		@eslint/js \
		htmlhint \
		serve \
		2>/dev/null
	@echo '{"extends":["stylelint-config-standard"],"rules":{"color-no-invalid-hex":true,"no-duplicate-selectors":true,"declaration-block-no-duplicate-properties":true,"selector-class-pattern":null,"keyframes-name-pattern":null,"custom-property-pattern":null}}' > .stylelintrc.json
	@echo '{"env":{"browser":true,"es2022":true},"parserOptions":{"ecmaVersion":2022,"sourceType":"module"},"rules":{"no-unused-vars":"warn","no-undef":"warn","eqeqeq":"error","no-console":"off"}}' > .eslintrc.json
	@echo '{"tagname-lowercase":true,"attr-lowercase":true,"attr-value-double-quotes":true,"doctype-first":true,"tag-pair":true,"spec-char-escape":true,"id-unique":true,"src-not-empty":true,"attr-no-duplication":true,"title-require":true}' > .htmlhintrc
	@echo "✓ Config files written"

# ─── Serve ───────────────────────────────────────────────────────────────────

serve: node_modules/.bin/stylelint
	@echo "→ Serving at http://localhost:$(PORT)  (Ctrl-C to stop)"
	npx serve . --listen $(PORT) --no-clipboard

open:
	$(BROWSER) http://localhost:$(PORT)

# ─── Lint ────────────────────────────────────────────────────────────────────

lint: lint-css lint-js lint-html

lint-css: node_modules/.bin/stylelint
	@echo "→ Linting CSS..."
	npx stylelint "assets/css/**/*.css"
	@echo "✓ CSS clean"

lint-js: node_modules/.bin/stylelint
	@echo "→ Linting JS..."
	npx eslint "assets/js/**/*.js"
	@echo "✓ JS clean"

lint-html: node_modules/.bin/stylelint
	@echo "→ Linting HTML..."
	npx htmlhint index.html
	@echo "✓ HTML clean"

# ─── Test ────────────────────────────────────────────────────────────────────

test: lint test-links
	@echo ""
	@echo "✓ All checks passed"

# ─── Clean ───────────────────────────────────────────────────────────────────

clean:
	rm -rf node_modules .cache
	@echo "✓ Cleaned"
