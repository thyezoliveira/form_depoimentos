# Formulário de Depoimentos

Este é um projeto React personalizado criado para coletar depoimentos de usuários e enviá-los para uma API externa.

## Funcionalidades

- **Formulário de Depoimentos:** Coleta Nome, Texto do Depoimento, Avaliação (1-5) e Setor.
- **Lógica de API:**
  - O formulário verifica a disponibilidade do servidor via endpoint `/health_check` antes de realizar o envio.
  - Implementa lógica de *polling* para "acordar" servidores em estado de *sleep* (Cold Start) antes de enviar os dados.
- **Feedback Visual:** Exibe mensagens de carregamento, sucesso ou erro, com animações para indicar o processamento.
- **Estrutura:** React com TypeScript, pronto para estilização customizada.

## Como Executar

### Pré-requisitos
- Node.js
- npm ou bun

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```
