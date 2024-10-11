# README

very minimalist deno framework

### feature

- [x] routing
- [x] dotenv
- [x] cors
- [x] jwt
- [x] bcrypt
- [x] bodyparser
- [x] logging
- [x] kv database
- [ ] file upload (s3)
- [ ] web socket
- [ ] send email
- [ ] graphql

### initialize

clone repo
```bash
git clone --depth 1 https://github.com/nursyah21/deno-slim
```

### development
```bash
deno run dev
```

### deploy
install deployctl

```bash
deno install -Arf jsr:@deno/deployctl
```

deploy

> if you want to deploy make sure you comment database in .env
```bash
deployctl deploy
```
