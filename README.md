# Sistema de agendamento e gestão para barbearias — demonstração

Demonstração com **dados fictícios** de uma plataforma de marcações para barbearias:
marcação online para o cliente, agenda e gestão para o barbeiro (PC e telemóvel),
clientes, equipa, serviços, lembretes por WhatsApp e análises.

> Os dados ficam guardados apenas no browser (localStorage). Não há base de dados
> nem login: é uma demonstração de interface, não um sistema em produção.

## Antes de enviar a demo

Edita `src/data/contact.ts` e preenche `whatsapp` e/ou `email`. Enquanto estiverem
vazios, o botão "Quero isto na minha barbearia" não aparece.

`DEMO_MODE = true` impede que as mensagens de WhatsApp sigam para números de exemplo.

## Correr localmente

```bash
npm install
npm run dev
```

## Ficheiros úteis

- `src/data/initialData.ts` — dados de exemplo (barbearia, serviços, barbeiros, clientes)
- `src/data/contact.ts` — o teu contacto e o modo demonstração
- `src/utils/calendar.ts` — mensagens de WhatsApp e ficheiro de calendário
