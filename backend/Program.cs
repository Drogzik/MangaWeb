using Microsoft.EntityFrameworkCore;
using MangaWeb.Backend.Data;
using MangaWeb.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpClient();

// Configure EF Core with MySQL Pomelo
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<MangaDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

// Register Telegram Auth Store (shared between bot and API)
builder.Services.AddSingleton<TelegramAuthStore>();

// Register Telegram Bot Service
builder.Services.AddHostedService<TelegramBotService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite React Port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Automatically ensure DB is created and seeded (Open Server connection must be active)
try
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<MangaDbContext>();
        db.Database.EnsureCreated();
        try { db.Database.ExecuteSqlRaw("ALTER TABLE Mangas ADD COLUMN MainCharacter longtext;"); } catch { }
        DbSeeder.Seed(db);
    }
}
catch (Exception ex)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine($"[DB Error] Could not connect to MySQL database on Open Server.");
    Console.WriteLine($"Details: {ex.Message}");
    Console.ResetColor();
}

// Configure the HTTP request pipeline.
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Health Check Endpoint
app.MapGet("/api/health", () => Results.Ok(new { status = "OK", message = "MangaWeb ASP.NET Core Backend is running with MySQL." }));

Console.WriteLine("=========================================");
Console.WriteLine("  MangaWeb ASP.NET Core Backend running!  ");
Console.WriteLine("  Local URL: http://localhost:5000       ");
Console.WriteLine("=========================================");

app.Run("http://localhost:5000");
