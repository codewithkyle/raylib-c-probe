#include <raylib.h>
float floorf(float);
float fabsf(float);
double fabs(double);
float fmaxf(float, float);
float fminf(float, float);
float sqrtf(float);
float atan2f(float, float);
float cosf(float);
float sinf(float);
double tan(double);
float acosf(float);
float asinf(float);
#include <raymath.h>

#define BALL_RADIUS 100.0

static Vector2 ball_position = {0};
static Vector2 ball_velocity = {200, 200};

void next_frame()
{
    BeginDrawing();
        ClearBackground((Color){18,18,18,255});
        Vector2 new_ball_position = Vector2Add(ball_position, Vector2Scale(ball_velocity, GetFrameTime()));
        if (new_ball_position.x - BALL_RADIUS < 0.0 || new_ball_position.x + BALL_RADIUS >= GetScreenWidth())
        {
            ball_velocity.x *= -1.0f;
        } else {
            ball_position.x = new_ball_position.x;
        }
        if (new_ball_position.y - BALL_RADIUS < 0.0 || new_ball_position.y + BALL_RADIUS >= GetScreenHeight())
        {
            ball_velocity.y *= -1.0f;
        } else {
            ball_position.y = new_ball_position.y;
        }
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
