#include <raylib.h>
#include <raymath.h>

#define BALL_RADIUS 100.0

static Vector2 ball_position = {0};
static Vector2 ball_velocity = {100, 100};

void next_frame()
{
    BeginDrawing();
        ClearBackground((Color){18,18,18,255});
        ball_position = Vector2Add(ball_position, Vector2Scale(ball_velocity, GetFrameTime()));
        DrawCircleV(ball_position, BALL_RADIUS, RED);
    EndDrawing();
}

void render_init()
{
    InitWindow(800, 600, "Hello from WASM");
    SetTargetFPS(60);
    int w = GetScreenWidth();
    int h = GetScreenHeight();
    ball_position.x = w * .5;
    ball_position.y = h * .5;
}

void render_close()
{
    CloseWindow();
}

#ifdef PLATFORM_NATIVE
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
