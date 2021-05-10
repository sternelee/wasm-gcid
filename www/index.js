import * as wasm from "@sternelee/wasm-gcid";

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

async function main () {
  const buffers = await request('/720P.mp4')
  const segment = new Uint8Array(buffers);
  console.log('buffers', segment)
  const gcid = Gcid.new(segment.byteLength);
  console.log(gcid.block_size())
  gcid.calculate(segment);
  const result = gcid.finalize();
  console.log(result);
  gcid.free()
}

window.onload = main()
