# Single-stage production image
FROM python:3.11-slim

WORKDIR /app

# Install curl for health checks and uv (Python package manager)
RUN apt-get update && apt-get install -y curl && \
    pip install --no-cache-dir uv && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY backend/pyproject.toml backend/uv.lock backend/.python-version ./

# Install dependencies (production only, no dev dependencies)
RUN uv sync --frozen --no-dev

# Copy application code and keys
COPY backend/ /app/

# Expose port
EXPOSE 5555

# Run database migrations and start the server
CMD ["sh", "-c", "uv run alembic upgrade head && uv run main.py"]
