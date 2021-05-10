// import * as wasm from "@sternelee/wasm-gcid";
import * as wasm from "wasm-gcid";
import CryptoJS from "crypto-js";

console.log(wasm);
const { Gcid } = wasm
const request = async function (url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onload = () => {
      resolve(request.response)
    }
    request.open('GET', url)
    request.responseType = 'arraybuffer'
    request.send()
  })
}

const calculateBlockSize = function (size) {
  if (size >= 0 && size <= (128 << 20)) {
    return 256 << 10
  }
  if (size > (128 << 20) && size <= (256 << 20)) {
    return 512 << 10
  }
  if (size > (256 << 20) && size <= (512 << 20)) {
    return 1024 << 10
  }
  return 2048 << 10
}

function JSGcid (ab, blockSize) {
    let gcidSHA1 = CryptoJS.algo.SHA1.create();
    const size = ab.byteLength
    const blockNum = size / blockSize
    for (let i = 0; i < blockNum; i++) {
      const wa = CryptoJS.lib.WordArray.create(ab.slice(blockSize * i, blockSize * (i + 1)))
      const bcidSHA1 = CryptoJS.SHA1(wa)
      gcidSHA1.update(bcidSHA1)
    }
    if (blockSize * blockNum < size) {
      const wa = CryptoJS.lib.WordArray.create(ab.slice(blockSize * blockNum, size))
      const bcidSHA1 = CryptoJS.SHA1(wa)
      gcidSHA1.update(bcidSHA1)
    }
    return gcidSHA1.finalize().toString().toUpperCase()
}

async function crypto_gcid () {
    const buffers = await request('/720P.png')
    const segment = new Uint8Array(buffers);
    const blockSize = calculateBlockSize(segment.byteLength)
    console.log('crypto_gcid blockSize: ', blockSize)
    const result = JSGcid(segment, blockSize);
    console.log('crypto_gcid result: ', result)
}

async function main () {
  const buffers = await request('/720P.png')
  const segment = new Uint8Array(buffers);
  const gcid = Gcid.new(segment.byteLength);
  console.log('main blockSize: ', gcid.block_size())
  gcid.calculate(segment);
  const result = gcid.finalize();
  console.log('main result: ', result);
  gcid.free()
}

window.onload = function () {
    main()
    crypto_gcid()
}
