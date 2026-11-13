# ---- build the React app ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# The public URL for canonical/OG/sitemap tags. Render sets RENDER_EXTERNAL_URL; VITE_SITE_URL overrides it.
ARG VITE_SITE_URL
ARG RENDER_EXTERNAL_URL
RUN npm run build

# ---- serve it with nginx, proxying the API to Django ----
FROM nginx:1.31-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
