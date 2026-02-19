using TaskApp.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAppInfrastructure(builder.Configuration);

var app = builder.Build();

app.UseAppPipeline();

app.Run();
