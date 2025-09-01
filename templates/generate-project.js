// File: templates/generate-project.js
// Last change: Created project generator from template

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Import template values
const { LAKOVNA_VALUES, SENDELIVER_VALUES } = require('./project-values');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Available project presets
const PRESETS = {
  lakovna: LAKOVNA_VALUES,
  sendeliver: SENDELIVER_VALUES,
  custom: {}
};

// Helper function to prompt user
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

// Replace placeholders in content
const replacePlaceholders = (content, values) => {
  let result = content;
  
  Object.entries(values).forEach(([placeholder, value]) => {
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, value);
  });
  
  return result;
};

// Process a single file
const processFile = (sourcePath, targetPath, values) => {
  const content = fs.readFileSync(sourcePath, 'utf8');
  const processedContent = replacePlaceholders(content, values);
  
  // Create directory if it doesn't exist
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(targetPath, processedContent);
  console.log(`✅ Generated: ${targetPath}`);
};

// Copy files without processing
const copyFile = (sourcePath, targetPath) => {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`📋 Copied: ${targetPath}`);
};

// Main generator function
const generateProject = async () => {
  console.log('\n🚀 PROJECT GENERATOR FROM TEMPLATE\n');
  console.log('Available presets:');
  console.log('  1. lakovna   - Automotive Workshop Management');
  console.log('  2. sendeliver - Logistics Ecosystem Platform');
  console.log('  3. custom    - Create new project from scratch\n');
  
  const preset = await prompt('Select preset (lakovna/sendeliver/custom): ');
  
  let values;
  
  if (preset === 'custom') {
    // Custom project - prompt for all values
    console.log('\n📝 Creating custom project...\n');
    
    values = {};
    values['{{PROJECT_NAME}}'] = await prompt('Project name (lowercase): ');
    values['{{PROJECT_DISPLAY_NAME}}'] = await prompt('Display name: ');
    values['{{PROJECT_DESCRIPTION}}'] = await prompt('Description: ');
    values['{{PROJECT_DOMAIN}}'] = await prompt('Domain (e.g., example.com): ');
    values['{{PROJECT_VERSION}}'] = await prompt('Version (e.g., v1.0.0): ');
    
    console.log('\n🎨 Platform Configuration\n');
    values['{{PLATFORM_TYPE}}'] = await prompt('Platform type (platform/logistics/automotive): ');
    values['{{BUSINESS_MODEL}}'] = await prompt('Business model: ');
    values['{{PROJECT_CATEGORY}}'] = await prompt('Project category: ');
    
    console.log('\n🏢 Organization Types (3 required)\n');
    values['{{ORG_TYPE_1}}'] = await prompt('Org type 1 (key): ');
    values['{{ORG_TYPE_1_LABEL}}'] = await prompt('Org type 1 (label): ');
    values['{{ORG_TYPE_1_DESC}}'] = await prompt('Org type 1 (description): ');
    values['{{ORG_TYPE_1_CATEGORY}}'] = await prompt('Org type 1 category (A/B/AB): ');
    
    values['{{ORG_TYPE_2}}'] = await prompt('Org type 2 (key): ');
    values['{{ORG_TYPE_2_LABEL}}'] = await prompt('Org type 2 (label): ');
    values['{{ORG_TYPE_2_DESC}}'] = await prompt('Org type 2 (description): ');
    values['{{ORG_TYPE_2_CATEGORY}}'] = await prompt('Org type 2 category (A/B/AB): ');
    
    values['{{ORG_TYPE_3}}'] = await prompt('Org type 3 (key): ');
    values['{{ORG_TYPE_3_LABEL}}'] = await prompt('Org type 3 (label): ');
    values['{{ORG_TYPE_3_DESC}}'] = await prompt('Org type 3 (description): ');
    values['{{ORG_TYPE_3_CATEGORY}}'] = await prompt('Org type 3 category (A/B/AB): ');
    
    // Fill in remaining required values with defaults
    values = {
      ...values,
      '{{PRIMARY_COLOR}}': '#2563eb',
      '{{SECONDARY_COLOR}}': '#64748b',
      '{{ACCENT_COLOR}}': '#059669',
      '{{LOGO_ICON}}': '🏢',
      '{{LOGO_TEXT}}': `🏢 ${values['{{PROJECT_DISPLAY_NAME}}']}`,
      '{{THEME}}': 'light',
      '{{DB_NAME}}': values['{{PROJECT_NAME}}'],
      '{{DB_SCHEMA}}': values['{{PROJECT_NAME}}'].replace('-', '_'),
      '{{API_PREFIX}}': `/api/${values['{{PROJECT_NAME}}']}`,
      '{{API_VERSION}}': 'v1',
      '{{WS_NAMESPACE}}': `/${values['{{PROJECT_NAME}}']}`,
      '{{DEV_DOMAIN}}': 'localhost:3000',
      '{{DEV_DB}}': `${values['{{PROJECT_NAME}}']}_dev`,
      '{{STAGING_DOMAIN}}': `staging.${values['{{PROJECT_DOMAIN}}']}`,
      '{{STAGING_DB}}': `${values['{{PROJECT_NAME}}']}_staging`,
      '{{PROD_DOMAIN}}': values['{{PROJECT_DOMAIN}}'],
      '{{PROD_DB}}': `${values['{{PROJECT_NAME}}']}_prod`,
      // Add other defaults...
    };
    
  } else if (PRESETS[preset]) {
    values = PRESETS[preset];
    console.log(`\n✅ Using ${preset} preset\n`);
  } else {
    console.log('❌ Invalid preset');
    rl.close();
    return;
  }
  
  const projectName = values['{{PROJECT_NAME}}'];
  const targetDir = await prompt(`Target directory (default: ../${projectName}): `) || `../${projectName}`;
  
  console.log(`\n📦 Generating project in: ${targetDir}\n`);
  
  // Create target directory
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Process template files
  const templateFiles = [
    'project.template.config.ts',
    'README.template.md',
    'package.template.json',
    'tsconfig.template.json',
    '.env.template',
  ];
  
  templateFiles.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    if (fs.existsSync(sourcePath)) {
      const targetFileName = file.replace('.template', '');
      const targetPath = path.join(targetDir, targetFileName);
      processFile(sourcePath, targetPath, values);
    }
  });
  
  // Generate project.config.ts from template
  const templateConfig = fs.readFileSync(path.join(__dirname, 'project.template.config.ts'), 'utf8');
  const projectConfig = replacePlaceholders(templateConfig, values);
  fs.writeFileSync(path.join(targetDir, 'project.config.ts'), projectConfig);
  console.log(`✅ Generated: ${targetDir}/project.config.ts`);
  
  // Copy universal files (no placeholders)
  const universalFiles = [
    'database/schema.prisma',
    'common/types/universal/role-system.types.ts',
    'common/types/universal/auth.types.ts',
    'common/types/universal/platform-dots.types.ts',
    'common/configs/universal/platform-dots.config.ts',
    'common/configs/universal/auth.config.ts',
  ];
  
  universalFiles.forEach(file => {
    const sourcePath = path.join(__dirname, '..', file);
    if (fs.existsSync(sourcePath)) {
      const targetPath = path.join(targetDir, file);
      copyFile(sourcePath, targetPath);
    }
  });
  
  // Create folder structure
  const folders = [
    'database/migrations',
    'database/seeds',
    'environments',
    'common/types/project',
    'common/types/shared',
    'common/types/backend',
    'common/types/frontend',
    'common/configs',
    'common/constants',
    'common/validators',
    'common/utils',
    'back/src/setup',
    'back/src/clients',
    'back/src/security',
    'back/src/middlewares',
    'back/src/controllers',
    'back/src/services',
    'back/src/routes',
    'front/src/apps',
    'front/src/services',
    'front/src/shared',
    'front/src/contexts',
    'front/src/hooks',
    'front/public',
    'docs',
  ];
  
  folders.forEach(folder => {
    const folderPath = path.join(targetDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`📁 Created: ${folderPath}`);
    }
  });
  
  console.log('\n✨ Project generated successfully!\n');
  console.log('Next steps:');
  console.log(`  1. cd ${targetDir}`);
  console.log('  2. npm install');
  console.log('  3. Configure your .env file');
  console.log('  4. npm run dev\n');
  
  rl.close();
};

// Run generator
generateProject().catch(err => {
  console.error('❌ Error:', err);
  rl.close();
});