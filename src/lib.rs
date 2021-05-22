use sha1::{Digest, Sha1};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: usize);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u8array(a: &[u8]);
}

fn calc_block_size(size: usize) -> usize {
    if size <= (128 << 20) {
        256 << 10
    } else if size > (128 << 20) && size <= (256 << 20) {
        512 << 10
    } else if size > (256 << 20) && size <= (512 << 20) {
        1024 << 10
    } else {
        2048 << 10
    }
}

#[wasm_bindgen]
pub struct Gcid {
    context: sha1::Sha1,
    block_size: usize
}

#[wasm_bindgen]
impl Gcid {
    pub fn new (size: usize) -> Gcid {
        Gcid {
            context: Sha1::new(),
            block_size: calc_block_size(size)
        }
    }
    pub fn block_size (&mut self) -> usize {
        return self.block_size;
    }
    fn block_hash (&mut self, data: &[u8]) {
        let mut sha_b = Sha1::new();
        sha_b.update(data);
        let wa = sha_b.finalize();
        self.context.update(wa);
    }
    pub fn calculate(&mut self, buffer: &[u8]) -> usize {
        // log_u8array(&buffer);
        let buffer_size = buffer.len();
        let mut count = 262144; // block_size 最小值为262144
        let mut n: usize = 0;
        loop {
            if count > buffer_size {
                let start = n * self.block_size;
                let end = buffer_size;
                if start < buffer_size {
                    // log(&format!("the wasm is: {}, {}", start, buffer_size));
                    self.block_hash(&buffer[start..end]);
                }
                break;
            } else {
                match count % self.block_size {
                    0 => {
                        n = count / self.block_size;
                        let start = self.block_size * (n - 1);
                        let end = self.block_size * n;
                        // log(&format!("the wasm is: {}, {}", start, end));
                        self.block_hash(&buffer[start..end]);
                        count += 1;
                        // log_u32(count);
                    },
                    _ => count += 1,
                }
            }
        };
        return n;
    }
    pub fn finalize(&mut self) -> String {
        return format!("{:X}", self.context.clone().finalize());
    }
}
