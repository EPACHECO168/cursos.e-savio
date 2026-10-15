# Roadmap — Área do Cliente com cursos + Mercado Pago

## Cursos — outubro 2026
- [ ] Finalizar fundo exato #001C54 e item 8 do curso anterior.
- [ ] Exibir dois cursos lado a lado com programas e investimentos próprios.
- [ ] Cadastrar novo curso e armazenar PDF privado, mantendo cartão Mercado Pago e Pix direto.
- [ ] Verificar catálogo, seleção e acesso protegido ao novo PDF.

## Contexto
Conta Mercado Pago criada e aprovada. Usuário recebeu orientação sobre token de produção (APP_USR-).

## Tarefas
- [ ] Criar tabelas: digital_products, client_purchases; adicionar CPF em client_profiles
- [ ] Atualizar trigger handle_new_client para CPF/CNPJ
- [ ] Criar bucket privado "materiais-cursos" e subir PDF do curso
- [ ] Cadastrar produto "Importação para Executivos com efeitos da Reforma Tributária" (R$120 Pix / 2x R$75)
- [ ] Edge function login: aceitar CPF ou CNPJ
- [ ] Edge function create-payment (Checkout Pro Mercado Pago)
- [ ] Edge function mercadopago-webhook (liberação automática pós-pagamento)
- [ ] Edge function get-download-url (PDF via link assinado, só se pago)
- [x] Frontend: login/cadastro unificados CPF/CNPJ
- [x] Frontend: Painel do Cliente (Meus Cursos [Biblioteca de PDF's + Vídeo aulas], Simuladores, Meus Dados)
- [x] Vídeo aulas: 4 aulas com players demonstrativos (iframe, pronto p/ Panda Video)
- [x] Salvar MERCADOPAGO_ACCESS_TOKEN no cofre (APP_USR, salvo)
- [x] Deploy das edge functions e teste ponta a ponta
- [x] Teste E2E: painel abre, botão Comprar cria preferência e redireciona ao Mercado Pago

## Bloqueios
- Checkout exibe "Hubo un error accediendo a esta página" no lado do Mercado Pago — provável validação cadastral da conta ainda em andamento (usuário deve testar no navegador próprio e acompanhar o painel MP)
- Embeds Panda Video reais ainda não fornecidos (players demonstrativos por ora)

## Correção em andamento (04/10)
- [x] create-payment: preferências separadas Pix (R$ 120) e cartão (R$ 150, parcelas limitadas a 2)
- [x] PainelCliente: dois botões — "Comprar no Cartão 2x sem juros" e "Comprar no Pix (com desconto)"
- [x] Deploy + teste (logs: method=card unitPrice=150 / method=pix unitPrice=120)
- [ ] Usuário ativar "parcelamento sem juros (a seu cargo)" no painel do Mercado Pago, se o 2x aparecer com juros
- [ ] Usuário retestar compra no site publicado

## Subdomínio cursos.e-savio.com.br (07/10)
- [ ] Conectar cursos.e-savio.com.br ao projeto, apontando para /cursos (aguardando confirmação do usuário no cartão de conexão + DNS no Registro.br)
