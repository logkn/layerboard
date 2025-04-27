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

# Install dependencies
.PHONY: frontend/install
frontend/install:		## Install frontend dependencies
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install

# Install dependencies
.PHONY: backend/install
backend/install: 		## Install backend dependencies
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && source .venv/bin/activate && uv sync

# Run both frontend and backend
.PHONY: dev
dev:		## Run both frontend and backend
	$(MAKE) backend/start &
	$(MAKE) frontend/start

# Run only frontend
.PHONY: frontend/start
frontend/start: 	## Run only frontend
	@echo "Starting frontend..."
	cd $(FRONTEND_DIR) && npm run dev

# Run only backend
.PHONY: backend/start
backend/start: 	## Run only backend
	@echo "Starting backend..."
	cd $(BACKEND_DIR) && uv run uvicorn main:app --reload

# Build frontend for production
.PHONY: frontend/build
frontend/build:		## Build frontend for production
	cd $(FRONTEND_DIR) && npm run build

# Clean up node_modules and build artifacts
.PHONY: clean
clean:		## Clean up node_modules and build artifacts
	$(MAKE) frontend/clean
	$(MAKE) backend/clean

# Clean up build artifacts
.PHONY: backend/clean
backend/clean: 	## Clean up backend build artifacts
	cd $(BACKEND_DIR) && rm -rf __pycache__

# Clean up node_modules and build artifacts
.PHONY: frontend/clean
frontend/clean: 	## Clean up frontend node_modules and build artifacts
	cd $(FRONTEND_DIR) && rm -rf node_modules dist
