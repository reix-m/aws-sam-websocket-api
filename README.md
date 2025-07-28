# AWS SAM WebSocket API
Este projeto implementa uma API Websocket utilizando AWS Serverless Application Model (SAM).

## Funcionalidades

- Conexão e desconexão de clientes via WebSocket.
- Envio de mensagens em tempo real entre clientes conectados.
- Gerenciamento de sessões de usuários.
- Autenticação.
- Integração com AWS Lambda para processamento de mensagens.
- Integração com AWS SQS para envio de eventos.

## Requisitos
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- [NodeJS 20](https://nodejs.org/en)

## Test locally
Para realizar o teste local primeiro faça o build da aplicação:
```bash
npm run build
```
Depois inicie a função que deseja testar com o AWS SAM CLI.
```bash
sam local invoke ConnectFunction --env-vars env.json --event events/ws-connect.event.json -t template-qa.yaml
```

## Deploy
Para realizar o deploy é necessário realizar o build e deploy com AWS SAM CLI.
```bash
sam build
sam deploy --guided
```

## Unit Tests
Os testes estão definidos na pasta `test`. Use o npm para instalar as dependências e rodar os testes unitários.
```bash
npm install
npm run test # Ou npm run test:cov para coverage
```
