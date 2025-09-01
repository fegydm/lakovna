# {{PROJECT_DISPLAY_NAME}}

{{PROJECT_DESCRIPTION}}

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

## 📋 Project Information

- **Name**: {{PROJECT_NAME}}
- **Version**: {{PROJECT_VERSION}}
- **Domain**: {{PROJECT_DOMAIN}}
- **Platform Type**: {{PLATFORM_TYPE}}
- **Business Model**: {{BUSINESS_MODEL}}

## 🏢 Organization Types

### Primary Types
- **{{ORG_TYPE_1}}** - {{ORG_TYPE_1_LABEL}}: {{ORG_TYPE_1_DESC}}
- **{{ORG_TYPE_2}}** - {{ORG_TYPE_2_LABEL}}: {{ORG_TYPE_2_DESC}}
- **{{ORG_TYPE_3}}** - {{ORG_TYPE_3_LABEL}}: {{ORG_TYPE_3_DESC}}

### Extended Types
- **{{ORG_TYPE_EXT_1}}** - {{ORG_TYPE_EXT_1_LABEL}}: {{ORG_TYPE_EXT_1_DESC}}
- **{{ORG_TYPE_EXT_2}}** - {{ORG_TYPE_EXT_2_LABEL}}: {{ORG_TYPE_EXT_2_DESC}}

## 🎨 Platform Categories

- **Category A**: {{ORG_TYPE_1_CATEGORY}} based organizations
- **Category B**: {{ORG_TYPE_2_CATEGORY}} based organizations
- **Category AB**: {{ORG_TYPE_3_CATEGORY}} hybrid organizations

## 🔧 Core Features

- {{CORE_FEATURE_1}}
- {{CORE_FEATURE_2}}
- {{CORE_FEATURE_3}}
- {{CORE_FEATURE_4}}

## 📦 Optional Features

- {{OPT_FEATURE_1}}
- {{OPT_FEATURE_2}}
- {{OPT_FEATURE_3}}
- {{OPT_FEATURE_4}}
- {{OPT_FEATURE_5}}
- {{OPT_FEATURE_6}}

## 🔌 Integrations

- {{INTEGRATION_1}}
- {{INTEGRATION_2}}
- {{INTEGRATION_3}}

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Real-time**: Socket.io
- **Styling**: CSS Modules

## 📁 Project Structure

```
{{PROJECT_NAME}}/
├── database/           # Prisma schema and migrations
├── environments/       # Environment configurations
├── common/            # Shared code between FE and BE
│   ├── types/         # TypeScript definitions
│   ├── configs/       # Configuration files
│   ├── constants/     # Constants
│   ├── validators/    # Zod schemas
│   └── utils/         # Utility functions
├── back/              # Backend API server
│   └── src/
│       ├── setup/     # Service initialization
│       ├── clients/   # External clients
│       ├── security/  # Security utilities
│       ├── middlewares/
│       ├── controllers/
│       ├── services/
│       └── routes/
├── front/             # React frontend
│   └── src/
│       ├── apps/      # Domain applications
│       ├── services/  # API services
│       ├── shared/    # Shared components
│       ├── contexts/  # React contexts
│       └── hooks/     # Custom hooks
└── docs/              # Documentation
```

## 🌐 Environments

- **Development**: {{DEV_DOMAIN}}
- **Staging**: {{STAGING_DOMAIN}}
- **Production**: {{PROD_DOMAIN}}

## 🎨 Branding

- **Primary Color**: {{PRIMARY_COLOR}}
- **Secondary Color**: {{SECONDARY_COLOR}}
- **Accent Color**: {{ACCENT_COLOR}}
- **Logo**: {{LOGO_TEXT}}
- **Theme**: {{THEME}}

## 📚 API Documentation

API is available at `{{API_PREFIX}}/{{API_VERSION}}`

WebSocket namespace: `{{WS_NAMESPACE}}`

## 🔐 Authentication

The platform uses a universal authentication system with multiple access roles:
- `superadmin` - Full system access
- `developer` - Development access
- `owner` - Organization owner
- `manager` - Management access
- `coordinator` - Coordination tasks
- `worker` - Basic worker access
- `partner` - Partner access
- `viewer` - Read-only access

## 📝 License

Copyright © 2024 {{PROJECT_DISPLAY_NAME}}. All rights reserved.

## 🤝 Contributing

Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support

For support, email support@{{PROJECT_DOMAIN}} or open an issue in the project repository.