# 📚 Template System Documentation

## Overview

This template system allows you to quickly generate new projects based on the universal SaaS platform architecture. All projects share the same Prisma schema and core infrastructure while maintaining project-specific configurations.

## 📁 Template Files Structure

```
templates/
├── project.template.config.ts    # Main configuration template
├── project-values.ts             # Preset values for projects
├── generate-project.js           # Generator script
├── README.template.md            # Project README template
├── package.template.json         # Package.json template
├── tsconfig.template.json        # TypeScript config template
├── .env.template                 # Environment variables template
└── INSTRUCTIONS.md              # This file
```

## 🚀 Quick Start

### Generate Project with Preset

```bash
# Navigate to templates directory
cd templates

# Run generator
node generate-project.js

# Select preset (lakovna/sendeliver/custom)
# Follow prompts
```

### Generate Custom Project

1. Run generator and select `custom`
2. Fill in required values:
   - Project name (lowercase, no spaces)
   - Display name
   - Description
   - Domain
   - Organization types (minimum 3)
   - Platform categories mapping

## 🎯 Template Placeholders

### Core Placeholders

| Placeholder | Description | Example |
|------------|-------------|---------|
| `{{PROJECT_NAME}}` | Project identifier | `lakovna` |
| `{{PROJECT_DISPLAY_NAME}}` | Display name | `Lakovňa` |
| `{{PROJECT_DESCRIPTION}}` | Project description | `Automotive Workshop Management` |
| `{{PROJECT_DOMAIN}}` | Primary domain | `lakovna.com` |
| `{{PROJECT_VERSION}}` | Version | `v1.0.0` |

### Platform Configuration

| Placeholder | Description | Values |
|------------|-------------|--------|
| `{{PLATFORM_TYPE}}` | Platform type | `platform`, `logistics`, `automotive` |
| `{{BUSINESS_MODEL}}` | Business model | `automotive-workshop`, `logistics-ecosystem` |
| `{{PROJECT_CATEGORY}}` | Category | `automotive`, `logistics` |

### Organization Types

Each project must define at least 3 organization types:

| Placeholder | Description |
|------------|-------------|
| `{{ORG_TYPE_1}}` | First org type key |
| `{{ORG_TYPE_1_LABEL}}` | Display label |
| `{{ORG_TYPE_1_DESC}}` | Description |
| `{{ORG_TYPE_1_CATEGORY}}` | Platform category (A/B/AB) |

### Platform Categories (3-dot system)

- **Category A**: First primary category
- **Category B**: Second primary category  
- **Category AB**: Hybrid category

### Row 2 Dots (Status/Progress)

| Placeholder | Description |
|------------|-------------|
| `{{ROW2_SEMANTICS}}` | Meaning of row 2 dots |
| `{{ROW2_DOT_1}}` | First status |
| `{{ROW2_DOT_2}}` | Second status |
| `{{ROW2_DOT_3}}` | Third status |

## 📋 Preset Values

### Lakovňa Preset

- **Org Types**: bodyshop, service, dealer (+ tuning, autofolie)
- **Categories**: A=paint, B=mechanical, AB=full-service
- **Row 2**: planning → progress → completed

### Sendeliver Preset

- **Org Types**: hauler, sender, broker (+ warehouse, customs)
- **Categories**: A=hauler, B=sender, AB=broker
- **Row 2**: pending → in-transit → delivered

## 🔧 Creating New Preset

1. Open `project-values.ts`
2. Copy existing preset structure
3. Create new object with all placeholders filled
4. Add to PRESETS object in `generate-project.js`

Example:
```javascript
export const MYPROJECT_VALUES = {
  '{{PROJECT_NAME}}': 'myproject',
  '{{PROJECT_DISPLAY_NAME}}': 'MyProject',
  // ... fill all placeholders
};
```

## 🎨 Customization Points

### Required Customization
- Organization types (minimum 3)
- Platform category mapping
- Row 2 dots semantics
- Core features list

### Optional Customization
- Colors and branding
- Extended organization types
- Optional features
- Integration list
- WebSocket rooms

## 📝 Post-Generation Steps

After generating a project:

1. **Review configuration**
   ```bash
   cat project.config.ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Initialize database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development**
   ```bash
   npm run dev
   ```

## 🔄 Updating Templates

When updating the template system:

1. **Update master template** (`project.template.config.ts`)
2. **Update preset values** (`project-values.ts`)
3. **Test generation** with both presets
4. **Document changes** in this file

## ⚠️ Important Notes

1. **Universal Prisma Schema**: All projects use the same database schema
2. **Platform Categories**: Always use A, B, AB system
3. **AccessRole**: Fixed enum (superadmin → viewer)
4. **Minimum Requirements**: 3 org types, 3 platform dots, 3 status dots

## 🐛 Troubleshooting

### Common Issues

1. **Missing placeholders**
   - Check all {{PLACEHOLDER}} are defined in values
   - Run generator with --verbose flag

2. **File not found**
   - Ensure template files exist
   - Check file paths in generator script

3. **Invalid category mapping**
   - Use only A, B, or AB for categories
   - Ensure each org type has primary category

## 📚 Advanced Usage

### Partial Generation

Generate only specific parts:
```bash
node generate-project.js --only=config
node generate-project.js --only=readme
```

### Batch Generation

Generate multiple projects:
```bash
node generate-project.js --batch=lakovna,sendeliver
```

### Validation

Validate configuration without generating:
```bash
node generate-project.js --validate
```

## 🤝 Contributing

To add new template features:

1. Add placeholder to master template
2. Update all preset values
3. Update generator script if needed
4. Document in this file
5. Test with all presets

## 📞 Support

For template issues:
- Check this documentation
- Review preset values
- Verify placeholder syntax
- Test with minimal custom project