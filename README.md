

# CloudFlare graphql D1 drizzle starter with honojs



# LIVE DEMO 

[`LIVE DEMO`](https://hono.loox.workers.dev/graphql?query=%7B%0A++users%28q%3A+%22%22%2C+limit%3A+10%2C+page%3A+1%29+%7B%0A++++success%0A++++message%0A++++meta+%7B%0A++++++total%0A++++++page%0A++++++limit%0A++++%7D%0A++++payload+%7B%0A++++++id%0A++++++email%0A++++++username%0A++++++phoneNumber%0A++++++role%0A++++++isActive%0A++++++createdAt%0A++++%7D%0A++%7D%0A++posts%28q%3A+%22%22%2C+limit%3A+10%2C+page%3A+1%29+%7B%0A++++success%0A++++message%0A++++meta+%7B%0A++++++total%0A++++++page%0A++++++limit%0A++++%7D%0A++++payload+%7B%0A++++++id%0A++++++title%0A++++++description%0A++++++isActive%0A++++++createdAt%0A++++%7D%0A++%7D%0A%7D)








```
#example.wrangler.toml


name = "hono"
main = "src/index.ts"
compatibility_date = "2023-01-01"
account_id = "$account_id"
compatibility_flags = ["nodejs_compat"]

#for dev
# [dev]
# ip = "127.0.0.1"
# port = 8081
# local_protocol = "http"


[env.$ENVIRONMENT]
vars = { ENVIRONMENT = "$ENVIRONMENT" ,BASE_URL = "$BASE_URL"}
d1_databases =[{ binding = "DB" ,database_name = "$database_name" , database_id = "$database_id" , migrations_dir = "migrationsD1" }]

# ......


```

```
npm install
npm run dev
```

```
npm run deploy
```
