# README

## initialize

first create directory project
```bash
mkdir myproject && cd myproject
```

with degit
```bash
degit nursyah21/deno-slim .
```

with git
```bash
git clone --depth 1 https://github.com/nursyah21/deno-slim . && rm -rf .git
```

## development
```bash
deno task dev
```

## deploy
install deployctl

```bash
deno install -Arf jsr:@deno/deployctl
```

deploy
```bash
deployctl deploy
```