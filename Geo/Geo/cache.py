import redis

# create redis cache client connection
cache = redis.Redis(host="geo_cache_1", port=6379, decode_responses=True)
TTL = 3000 # 50 minute time to live
