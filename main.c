#include <raylib.h>

void next_frame()
{
    BeginDrawing();
    ClearBackground(RED);
    EndDrawing();
}

void render_init()
{
    InitWindow(800, 600, "Hello from WASM");
    SetTargetFPS(60);
}

void render_close()
{
    CloseWindow();
}

#ifdef PLATFORM_WEB
int main()
{
    render_init();
    while (!WindowShouldClose())
    {
        next_frame();
    }
    render_close();
    return 0;
}
#endif
