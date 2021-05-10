# 基于 `rust` 编译出来的 `wasm` 版本 来进行文件`gcid` 计算

## 步骤

1. `wasm-pack build`
2. 在 `www` 目录下加载模块, `npm install --save file:../pkg`
3. 在 `www` 目录下, `npm run start`
