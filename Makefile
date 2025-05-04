# Monorepo Makefile

# Directory names
FRONTEND_DIR=./frontend
BACKEND_DIR=./backend


CYAN  := \033[36m
RESET := \033[0m

.PHONY: help
help: ## Show this help message.
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z0-9_/-]+:.*?## ' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  '"$(CYAN)"'%-15s'"$(RESET)"' %s\n", $$1, $$2}'

# Install dependencies
.PHONY: install
install:		## Install dependencies for both frontend and backend
	@echo "Installing dependencies..."
	$(MAKE) frontend/install
	$(MAKE) backend/install

.PHONY: frontend/add
frontend/add:		## Add a new frontend dependency
	@echo "Adding frontend dependency..."
	cd $(FRONTEND_DIR) && npm install -D $(PACKAGE) --registry https://registry.npmjs.org

.PHONY: backend/add
backend/add:		## Add a new backend dependency
	@echo "Adding backend dependency..."
	cd $(BACKEND_DIR) && uv add $(PACKAGE)

.PHONY: frontend/list
frontend/list:		## List frontend dependencies
	@echo "Frontend dependencies:"
	cd $(FRONTEND_DIR) && npm list --depth=0

.PHONY: backend/list
backend/list:		## List backend dependencies
	echo "Backend dependencies:"
	cd $(BACKEND_DIR) && uv list

.PHONY: backend/install
backend/install: ## Install backend dependencies
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && uv sync

# Install dependencies
.PHONY: frontend/install
frontend/install:		## Install frontend dependencies
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm i --registry https://registry.npmjs.org

.PHONY: backend/kill
backend/kill:	## Kill any running backend processes
	@echo "Killing backend processes..."
	pkill -f "uvicorn app.main:app" || true

# Update your dev target to include trap for clean shutdown
.PHONY: dev
dev:		## Run both frontend and backend
	@echo "Starting services. Press Ctrl+C to stop."
	@trap 'make backend/kill' INT TERM; \
	$(MAKE) backend/start & \
	$(MAKE) frontend/start

# Run only frontend
.PHONY: frontend/start
frontend/start: 	## Run only frontend
	@echo "Starting frontend..."
	cd $(FRONTEND_DIR) && npm run dev
	# open the react app in the default browser
	xdg-open http://localhost:3000
	

# Run only backend
.PHONY: backend/start
backend/start: 	## Run only backend
	@echo "Starting backend..."
	cd $(BACKEND_DIR) && source .venv/bin/activate && PYTHONPATH=. uvicorn app.main:app --reload --app-dir .

# Build frontend for production
.PHONY: frontend/build
frontend/build:		## Build frontend for production
	cd $(FRONTEND_DIR) && npm run build

# Clean up node_modules and build artifacts
.PHONY: clean
clean:		## Clean up node_modules and build artifacts
	# $(MAKE) frontend/clean
	$(MAKE) backend/clean

# Clean up build artifacts
.PHONY: backend/clean
backend/clean: 	## Clean up __pycache__ and build artifacts
	cd $(BACKEND_DIR) && find . -type d -name "__pycache__" -exec rm -rf {} +
	
# # Clean up node_modules and build artifacts
# .PHONY: frontend/clean
# frontend/clean: 	## Clean up frontend node_modules and build artifacts
# 	cd $(FRONTEND_DIR) && rm -rf node_modules dist


.PHONY: backend/lint
backend/lint: 	## Lint backend code
	cd $(BACKEND_DIR) && uv run ruff check --select I --fix . && uv run ruff format .
