@echo off
docker exec -it geo_db psql -U geo_user -d geo_db -c ^
"insert into api_apikey (id, key, created_at, expires_at, usage_count, revoked, app_name) values(1, '1234567890', now(), '6/1/26', 0, FALSE, 'onlyFirstTimeUse');"
cd ./react-front-end-wip/Geo_app/
echo VITE_API_KEY=1234567890 > .env
docker compose down && docker compose up --build