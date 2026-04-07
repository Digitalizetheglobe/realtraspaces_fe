$f = "src\app\property-details\[title]\page.tsx"
$c = Get-Content -LiteralPath $f -Raw
$c = $c -replace 'await fetch\(`https://connector\.b2bbricks\.com/api/Property/getrecentproperties`,\s*\{[^}]*\}\s*\)', "await fetch('/api/b2b/properties')"
Set-Content -LiteralPath $f -Value $c -NoNewline
Write-Host "Done"
