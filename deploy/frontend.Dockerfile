FROM node:22-alpine AS build

WORKDIR /app
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=${VITE_API_URL}

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY content/ /content/
COPY frontend/ ./
RUN npm run build

FROM nginx:1.30-alpine AS runtime

COPY deploy/nginx-app.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# The restricted release checkout uses umask 077. Vite-generated bundles get
# fresh, readable modes, but files copied verbatim from frontend/public keep
# 0600 unless we normalize the final image tree explicitly.
RUN find /usr/share/nginx/html -type d -exec chmod 0755 {} + \
    && find /usr/share/nginx/html -type f -exec chmod 0644 {} +

EXPOSE 80
