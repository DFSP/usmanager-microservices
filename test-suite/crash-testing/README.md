# Crash Testing

Microserviço desenhado para crashar, para permitir o teste do sistema de recuperação de containers.

## Executar

```shell script
docker build -f docker/Dockerfile . -t manager-master
docker run --rm -p 8080:8080 manager-master
```

ou

```shell script
docker run --rm -p 8080:8080 usmanager/crash-testing
```