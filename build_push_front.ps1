# build_push_front.ps1
# Builda o Angular em prod, gera imagem Docker e envia pro Docker Hub

$dockerUser = "wimagroup"
$dockerRepo = "datahound-front"
$dockerTag = "latest"
$fullTag = "$($dockerUser)/$($dockerRepo):$($dockerTag)"

Write-Host "==> Buildando Angular (produção)..."
npx ng build --configuration production

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build Angular falhou."
    exit 1
}

Write-Host "==> Buildando imagem Docker: $fullTag"
docker build -t $fullTag .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build falhou."
    exit 1
}

Write-Host "==> Enviando imagem ao Docker Hub..."
docker push $fullTag

if ($LASTEXITCODE -ne 0) {
    Write-Error "Push Docker falhou."
    exit 1
}

Write-Host "✅ Imagem publicada com sucesso!"
Write-Host "Use esta tag no Railway ou outro ambiente: $fullTag"
