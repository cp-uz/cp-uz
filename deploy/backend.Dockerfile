FROM python:3.12-slim@sha256:78387bc3881b8273120a12ebe6c1ab22b018ccc2c9adf565ae1ac9b536e184ea AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN addgroup --system cpuz && adduser --system --ingroup cpuz cpuz

COPY backend/requirements.txt ./requirements.txt
COPY backend/requirements/ ./requirements/
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY deploy/content-inventory.json /app/release-inventory.json
COPY deploy/prepare-content.sh /app/prepare-content.sh
COPY deploy/backup_sqlite.py /app/backup_sqlite.py
COPY deploy/volume_snapshot.py /app/volume_snapshot.py
COPY deploy/backend-entrypoint.sh /usr/local/bin/cpuz-entrypoint
RUN chmod 0755 /usr/local/bin/cpuz-entrypoint \
    && mkdir -p /app/data /app/staticfiles /app/media \
    && chown -R cpuz:cpuz /app

USER cpuz

EXPOSE 8000
ENTRYPOINT ["cpuz-entrypoint"]
