# CI/CD Pipeline Documentation

This project uses GitHub Actions for continuous integration and continuous deployment.

## Workflow Overview

The CI/CD pipeline is defined in `.github/workflows/ci.yml` and includes the following jobs:

### Backend Pipeline

#### 1. Backend - Build Job (`backend-build`)
- **Trigger**: Push to `main` or `develop` branches, PR creation
- **Environment**: Ubuntu Latest
- **Python Versions**: 3.10, 3.11 (matrix testing)
- **Steps**:
  - Checkout code
  - Setup Python environment
  - Cache pip dependencies for faster builds
  - Install project dependencies from `pyproject.toml`
  - Verify critical dependencies installation (FastAPI, SQLModel)

**Status Badge**: Verifies that all backend dependencies can be installed successfully

#### 2. Backend - Test Job (`backend-test`)
- **Trigger**: Depends on successful `backend-build` completion
- **Environment**: Ubuntu Latest with PostgreSQL 15 service
- **Steps**:
  - Checkout code
  - Setup Python environment
  - Install dependencies
  - Run `flake8` for code quality checks (non-blocking)
  - Run `mypy` for type checking (non-blocking)
  - Execute pytest tests with coverage reporting
  - Upload coverage reports to Codecov

**Status Badge**: Ensures code quality, type safety, and test coverage

### Frontend Pipeline

#### 1. Frontend - Build Job (`frontend-build`)
- **Trigger**: Push to `main` or `develop` branches, PR creation
- **Environment**: Ubuntu Latest
- **Node Versions**: 18.x, 20.x (matrix testing)
- **Steps**:
  - Checkout code
  - Setup Node.js environment with npm caching
  - Install dependencies using `npm ci`
  - Build project using Vite (`npm run build`)
  - Upload build artifacts to GitHub Actions

**Status Badge**: Verifies that the project builds successfully across Node versions

#### 2. Frontend - Test Job (`frontend-test`)
- **Trigger**: Depends on successful `frontend-build` completion
- **Environment**: Ubuntu Latest
- **Steps**:
  - Checkout code
  - Setup Node.js environment
  - Install dependencies
  - Run TypeScript type checking (`tsc --noEmit`)
  - Verify build completes successfully

**Status Badge**: Ensures type safety and build consistency

### Summary Job

#### CI Status (`ci-status`)
- **Trigger**: After all build and test jobs complete
- **Purpose**: Provides overall pipeline status indication
- **Behavior**: Fails if any sub-job fails, passes if all jobs succeed

## Triggering the Pipeline

The pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop` branches

## How to Add Tests

### Backend Tests

1. Create test files in `backend/tests/` directory (e.g., `test_routes.py`)
2. Use `pytest` for testing:
   ```python
   import pytest
   from fastapi.testclient import TestClient
   from main import app

   def test_example():
       assert True
   ```
3. Tests automatically run in the `backend-test` job

### Frontend Tests

1. Configure your testing framework (e.g., Vitest, Jest)
2. Add test script to `frontend/package.json`:
   ```json
   "test": "vitest"
   ```
3. Tests automatically run in the `frontend-test` job

## Code Coverage

Backend test coverage reports are uploaded to Codecov automatically. View coverage reports:
- In GitHub Actions workflow runs
- On codecov.io (if repository is connected)

## Environment Variables

If your backend requires environment variables for testing:
1. Add secrets to GitHub repository settings
2. Reference in the workflow with `${{ secrets.VARIABLE_NAME }}`

Example:
```yaml
- name: Run tests
  env:
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
  run: pytest
```

## Caching

The pipeline uses GitHub Actions caching for:
- **Python**: pip packages cache
- **Node**: npm packages cache

This significantly speeds up pipeline execution.

## Status Badges

Add these badges to your README.md to display the CI status:

```markdown
![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)
```

## Troubleshooting

### Backend Tests Fail
1. Ensure all dependencies in `pyproject.toml` are correct
2. Check that test database connection works
3. Review pytest output in GitHub Actions logs

### Frontend Build Fails
1. Check Node.js version compatibility
2. Ensure all imports are correct
3. Verify TypeScript configuration in `tsconfig.json`

## Next Steps

1. Add unit tests to backend and frontend
2. Configure integration tests for API endpoints
3. Setup staging/production deployment workflows
4. Add performance testing jobs
5. Integrate with code quality tools (SonarQube, CodeClimate)
