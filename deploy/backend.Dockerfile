FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN addgroup --system cpuz && adduser --system --ingroup cpuz cpuz

COPY backend/requirements.txt ./requirements.txt
COPY backend/requirements/ ./requirements/
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY deploy/backend-entrypoint.sh /usr/local/bin/cpuz-entrypoint
RUN chmod +x /usr/local/bin/cpuz-entrypoint \
    && mkdir -p /app/staticfiles /app/media \
    && chown -R cpuz:cpuz /app

USER cpuz

EXPOSE 8000
ENTRYPOINT ["cpuz-entrypoint"]
