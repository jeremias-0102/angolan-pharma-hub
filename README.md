
# PharmaGest - Sistema de Gestão Farmacêutica

![PharmaGest](https://via.placeholder.com/1200x400/2563eb/FFFFFF?text=PharmaGest)

## 🌟 Visão Geral

PharmaGest é um sistema completo de gestão farmacêutica com arquitetura moderna e recursos avançados para otimizar as operações diárias de farmácias. O sistema integra gestão de estoque, vendas, entregas e relatórios em uma plataforma unificada.

### 🔑 Funcionalidades Principais

- 🔐 **Autenticação e RBAC**: Diferentes perfis com permissões específicas
- 📦 **Gestão de Inventário**: Controle rigoroso de stock por lote e validade
- 🛒 **Vendas Online e POS**: Sistema completo para e-commerce e PDV físico
- 🚚 **Gestão de Entregas**: Atribuição, rastreamento e confirmação
- 📊 **Relatórios Avançados**: Analytics e exportação para decisões informadas
- 👨‍💼 **Administração**: Gestão de colaboradores, auditoria e configurações

## 🛠️ Stack Tecnológico

### Frontend
- React com TypeScript
- TailwindCSS para UI responsiva
- React Hook Form + Zod para validação
- React Query para cache e fetching
- Framer Motion para animações
- Context API para estado global

### Backend (a ser implementado)
- Node.js + TypeScript
- Express/NestJS para API REST
- PostgreSQL para armazenamento
- JWT para autenticação
- Zod para validação
- Swagger/OpenAPI para documentação

## 📋 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
│   ├── layout/         # Componentes de layout
│   ├── products/       # Componentes relacionados a produtos
│   └── ui/             # Componentes de UI genéricos
├── contexts/           # Contextos React para estado global
├── hooks/              # Custom hooks
├── lib/                # Utilitários e funções auxiliares
├── pages/              # Componentes de página
│   ├── admin/          # Páginas do painel de administração
│   ├── pharmacist/     # Páginas do painel de farmacêutico
│   ├── delivery/       # Páginas para entregadores
│   └── client/         # Páginas de perfil de clientes
├── types/              # Tipos e interfaces TypeScript
└── services/           # Serviços de comunicação com a API
```

## 🚀 Roadmap de Desenvolvimento

### Fase 1: Configuração e Autenticação
- [x] Setup do projeto React + TypeScript
- [x] Implementação de UI base com TailwindCSS
- [x] Sistema de autenticação com diferentes perfis
- [x] Página inicial e navbar responsivos

### Fase 2: Catálogo e Carrinho
- [ ] Implementação completa do catálogo de produtos
- [ ] Filtros avançados de busca
- [ ] Sistema de carrinho persistente
- [ ] Checkout com integração de pagamento

### Fase 3: Painel Administrativo
- [ ] Dashboard para administradores
- [ ] Gestão de produtos e stock
- [ ] Controle de lotes e alertas
- [ ] Gestão de colaboradores

### Fase 4: Operações Farmacêuticas
- [ ] Painel para farmacêuticos
- [ ] Processamento de encomendas
- [ ] POS para atendimento físico
- [ ] Controle de receitas médicas

### Fase 5: Entregas e Logística
- [ ] Atribuição de entregas
- [ ] Rastreamento de entregadores
- [ ] Gestão de status
- [ ] Histórico e comprovantes

### Fase 6: Relatórios e Analytics
- [ ] Relatórios financeiros
- [ ] Analytics de vendas
- [ ] Previsão de stock
- [ ] Exportação de dados

## 🌐 Configuração e Instalação

```bash
# Clonar o repositório
git clone https://github.com/your-username/pharmagest.git

# Entrar na pasta do projeto
cd pharmagest

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

---

> "Uma farmácia eficiente é uma sinfonia de cuidados, onde cada compasso é marcado pela precisão, segurança e compromisso com a saúde."
