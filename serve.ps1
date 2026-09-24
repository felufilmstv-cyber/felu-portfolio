# FELU portfolio — zero-dependency local server (PowerShell + .NET HttpListener).
# Run:  powershell -ExecutionPolicy Bypass -File serve.ps1 [-Port 8000]
# Stop: Stop-Process -Id (Get-Content .server.pid)
param([int]$Port = 8000)
$root = $PSScriptRoot
$mime = @{
  ".html" = "text/html; charset=utf-8"; ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"; ".svg" = "image/svg+xml"
  ".png" = "image/png"; ".webp" = "image/webp"; ".ico" = "image/x-icon"
  ".json" = "application/json"; ".txt" = "text/plain"
}
$listener = New-Object Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
$PID | Out-File (Join-Path $root ".server.pid")
Write-Host "Serving $root at http://localhost:$Port/ (Ctrl+C to stop)"
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart("/") -replace "/", "\"
    if ([string]::IsNullOrEmpty($path)) { $path = "index.html" }
    $file = Join-Path $root $path
    if ((Test-Path $file -PathType Container)) { $file = Join-Path $file "index.html" }
    if (-not (Test-Path $file -PathType Leaf) -or -not $file.StartsWith($root)) {
      $file = Join-Path $root "404.html"
      $ctx.Response.StatusCode = 404
    }
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
    $bytes = [IO.File]::ReadAllBytes($file)
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $ctx.Response.Close()
  }
} finally { $listener.Stop() }
