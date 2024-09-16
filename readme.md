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
- [ ] file upload
- [ ] web socket
- [ ] send email
- [ ] graphql

### initialize

first create directory project
```bash
mkdir myproject && cd myproject
```

init with degit
```bash
degit nursyah21/deno-slim . && cp .env.example .env
```

init with git
```bash
git clone --depth 1 https://github.com/nursyah21/deno-slim . && rm -rf .git && cp .env.example .env
```

### development
```bash
deno run -A --unstable-kv --watch ./src/main.ts
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
