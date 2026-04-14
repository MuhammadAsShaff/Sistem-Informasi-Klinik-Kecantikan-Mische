<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // [Middleware Custom Kita]: 
        // Mendaftarkan penjaga pintu (JwtFromCookie) pada keseluruhan rute API dan Web.
        // Jika file ini dipasang, setiap request akan dicek Token-nya, lalu otomatis ditaruh di Header
        $middleware->append(\App\Http\Middleware\JwtFromCookie::class);

        // [Middleware Custom Kita]:
        // Mendaftarkan label alias 'admin' sehingga kita cukup tulis `->middleware('admin')` pada route terkait
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureAdminRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
