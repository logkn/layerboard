# Monorepo Makefile

# Directory names
FRONTEND_DIR=frontend
BACKEND_DIR=backend

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install         Install dependencies for frontend and backend"
	@echo "  make dev             Run frontend and backend in development mode"
	@echo "  make frontend        Start frontend dev server"
	@echo "  make backend         Start backend dev server"
	@echo "  make build           Build frontend for production"
	@echo "  make clean           Clean up generated files"

# Install dependencies
.PHONY: install
install:
	cd $(FRONTEND_DIR) && npm install
	cd $(BACKEND_DIR) && poetry install

# Run both frontend and backend
.PHONY: dev
dev:
	@echo "Starting backend..."
	cd $(BACKEND_DIR) && uvicorn main:app --reload &
	@echo "Starting frontend..."
	cd $(FRONTEND_DIR) && npm run dev

# Run only frontend
.PHONY: frontend
frontend:
	cd $(FRONTEND_DIR) && npm run dev

# Run only backend
.PHONY: backend
backend:
	cd $(BACKEND_DIR) && uvicorn main:app --reload

# Build frontend for production
.PHONY: build
build:
	cd $(FRONTEND_DIR) && npm run build

# Clean up node_modules and build artifacts
.PHONY: clean
clean:
	cd $(FRONTEND_DIR) && rm -rf node_modules dist
	cd $(BACKEND_DIR) && rm -rf __pycache__
