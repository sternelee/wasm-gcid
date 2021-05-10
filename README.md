# 基于 `rust` 编译出来的 `wasm` 版本 来进行文件`gcid` 计算

## 安装

```bash
npm install --save @sternelee/wasm-gcid
```

```javascript
import * as wasm from "@sternelee/wasm-gcid"
console.log(wasm)
```

## 打包

```bash
wasm-pack build --scope sternelee
```

## 发布

```bash
npm publish --access=public
```
