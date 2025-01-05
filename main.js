let previous = undefined;
let w = undefined;
let ctx = undefined;

WebAssembly.instantiateStreaming(fetch("main.wasm"), {
    env: make_env({
        InitWindow: (width, height, text_ptr) => {
            console.log("InitWindow", width, height, text_ptr);
            ctx.canvas.height = height;
            ctx.canvas.width = width;
            const buffer = w.instance.exports.memory.buffer;
            const text = cstr_by_ptr(buffer, text_ptr);
            document.title = text;
        },
        SetTargetFPS: (fps) => {
            console.log(`We want to run at ${fps} FPS, but on the Web we're just going to ignore it.`);
        },
        BeginDrawing: ()=>{},
        EndDrawing: ()=>{},
        ClearBackground: (color_ptr)=>{
            const buffer = w.instance.exports.memory.buffer;
            const rgba = new Uint8Array(buffer, color_ptr, 4);
            const hex = color_hex_unpacked(...rgba);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = hex;
            ctx.fill();
        },
    }),
}).then((wasm) => {
    console.log("WASM instantiated", wasm);
    w = wasm;
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    w.instance.exports.render_init();
    window.requestAnimationFrame(first);
}).catch((e) => {
    console.error("Failed to instantiate WASM", e);
});

function first(timestamp) {
    previous = timestamp;
    window.requestAnimationFrame(next);
}
function next(timestamp) {
    const dt = timestamp - previous;
    previous = timestamp;
    w.instance.exports.next_frame();
    //window.requestAnimationFrame(next);
}

function make_env(...envs) {
    return new Proxy(envs, {
        get(target, prop, receiver) {
            for (let env of envs) {
                if (env.hasOwnProperty(prop)) {
                    return env[prop];
                }
            }
            return (...args) => {
                console.error("NOT IMPLEMENTED: " + prop, args);
            }
        }
    });
}

function cstrlen(mem, ptr) {
    let len = 0;
    while (mem[ptr] != 0) {
        len++;
        ptr++;
    }
    return len;
}

function cstr_by_ptr(mem_buffer, ptr) {
    const mem = new Uint8Array(mem_buffer);
    const len = cstrlen(mem, ptr);
    const bytes = new Uint8Array(mem_buffer, ptr, len);
    return new TextDecoder().decode(bytes);
}

function color_hex_unpacked(r, g, b, a) {
    r = r.toString(16).padStart(2, "0");
    g = g.toString(16).padStart(2, "0");
    b = b.toString(16).padStart(2, "0");
    a = a.toString(16).padStart(2, "0");
    return `#${r}${g}${b}${a}`;
}

function color_hex(color) {
    const r = ((color>>(0*8))&0xFF).toString(16).padStart(2, "0");
    const g = ((color>>(1*8))&0xFF).toString(16).padStart(2, "0");
    const b = ((color>>(2*8))&0xFF).toString(16).padStart(2, "0");
    const a = ((color>>(3*8))&0xFF).toString(16).padStart(2, "0");
    return `#${r}${g}${b}${a}`;
}
