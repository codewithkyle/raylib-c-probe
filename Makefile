main: main.c
	clang -Wall -Wextra -Wswitch-enum -Os -fno-builtin --target=wasm32 -I./raylib/include --no-standard-libraries -Wl,--no-entry -Wl,--allow-undefined -Wl,--export=render_init -Wl,--export=next_frame -Wl,--export=render_end -o main.wasm main.c -DPLATFORM_WEB

native: main.c
	clang -Wall -Wextra -Wswitch-enum -Os -fno-builtin -I./raylib/include --no-standard-libraries -o main main.c
