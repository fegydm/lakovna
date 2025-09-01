// File: templates/project.template.config.ts
// Last change: Created master template with placeholders for new projects

import type { 
  PlatformDotCategory, 
  ProjectType 
} from '../common/configs/dot-system.config';

// ========================================
// PROJECT TEMPLATE CONFIG - MASTER
// ========================================
// Replace all {{PLACEHOLDERS}} with actual values

export const PROJECT_TEMPLATE_CONFIG = {
  // Project identity
  project: {
    name: '{{PROJECT_NAME}}',                    // e.g., 'lakovna', 'sendeliver'
    displayName: '{{PROJECT_DISPLAY_NAME}}',     // e.g., 'Lakovňa', 'Sendeliver'
    description: '{{PROJECT_DESCRIPTION}}',      // e.g., 'Automotive Workshop Management System'
    domain: '{{PROJECT_DOMAIN}}',                // e.g., 'lakovna.com', 'sendeliver.eu'
    version: '{{PROJECT_VERSION}}',              // e.g., 'v1.0.0'
  },

  // Platform context
  platform: {
    type: '{{PLATFORM_TYPE}}' as ProjectType,    // 'platform' | 'logistics' | 'automotive'
    businessModel: '{{BUSINESS_MODEL}}',         // e.g., 'automotive-workshop', 'logistics-ecosystem'
    projectCategory: '{{PROJECT_CATEGORY}}',     // e.g., 'automotive', 'logistics'
  },

  // Organization types for this project
  orgTypes: {
    primary: [
      '{{ORG_TYPE_1}}',                          // e.g., 'bodyshop', 'hauler'
      '{{ORG_TYPE_2}}',                          // e.g., 'service', 'sender'
      '{{ORG_TYPE_3}}',                          // e.g., 'dealer', 'broker'
    ],
    extended: [
      '{{ORG_TYPE_EXT_1}}',                      // e.g., 'tuning', 'warehouse'
      '{{ORG_TYPE_EXT_2}}',                      // e.g., 'autofolie', 'customs'
    ],
    labels: {
      '{{ORG_TYPE_1}}': '{{ORG_TYPE_1_LABEL}}',
      '{{ORG_TYPE_2}}': '{{ORG_TYPE_2_LABEL}}',
      '{{ORG_TYPE_3}}': '{{ORG_TYPE_3_LABEL}}',
      '{{ORG_TYPE_EXT_1}}': '{{ORG_TYPE_EXT_1_LABEL}}',
      '{{ORG_TYPE_EXT_2}}': '{{ORG_TYPE_EXT_2_LABEL}}',
    },
    descriptions: {
      '{{ORG_TYPE_1}}': '{{ORG_TYPE_1_DESC}}',
      '{{ORG_TYPE_2}}': '{{ORG_TYPE_2_DESC}}',
      '{{ORG_TYPE_3}}': '{{ORG_TYPE_3_DESC}}',
      '{{ORG_TYPE_EXT_1}}': '{{ORG_TYPE_EXT_1_DESC}}',
      '{{ORG_TYPE_EXT_2}}': '{{ORG_TYPE_EXT_2_DESC}}',
    },
  },

  // Platform dots mapping (A | B | AB)
  platformDots: {
    mapping: {
      '{{ORG_TYPE_1}}': {
        primaryCategory: '{{ORG_TYPE_1_CATEGORY}}' as PlatformDotCategory,  // 'A', 'B', or 'AB'
        subcategories: [
          '{{ORG_TYPE_1_SUBCAT_1}}',
          '{{ORG_TYPE_1_SUBCAT_2}}',
          '{{ORG_TYPE_1_SUBCAT_3}}',
        ],
        canAlsoAccess: ['{{ORG_TYPE_1_ACCESS_CAT}}'],
      },
      '{{ORG_TYPE_2}}': {
        primaryCategory: '{{ORG_TYPE_2_CATEGORY}}' as PlatformDotCategory,
        subcategories: [
          '{{ORG_TYPE_2_SUBCAT_1}}',
          '{{ORG_TYPE_2_SUBCAT_2}}',
          '{{ORG_TYPE_2_SUBCAT_3}}',
        ],
        canAlsoAccess: ['{{ORG_TYPE_2_ACCESS_CAT}}'],
      },
      '{{ORG_TYPE_3}}': {
        primaryCategory: '{{ORG_TYPE_3_CATEGORY}}' as PlatformDotCategory,
        subcategories: [
          '{{ORG_TYPE_3_SUBCAT_1}}',
          '{{ORG_TYPE_3_SUBCAT_2}}',
          '{{ORG_TYPE_3_SUBCAT_3}}',
        ],
        canAlsoAccess: ['{{ORG_TYPE_3_ACCESS_CAT_1}}', '{{ORG_TYPE_3_ACCESS_CAT_2}}'],
      },
      '{{ORG_TYPE_EXT_1}}': {
        primaryCategory: '{{ORG_TYPE_EXT_1_CATEGORY}}' as PlatformDotCategory,
        subcategories: [
          '{{ORG_TYPE_EXT_1_SUBCAT_1}}',
          '{{ORG_TYPE_EXT_1_SUBCAT_2}}',
        ],
        canAlsoAccess: ['{{ORG_TYPE_EXT_1_ACCESS_CAT}}'],
      },
      '{{ORG_TYPE_EXT_2}}': {
        primaryCategory: '{{ORG_TYPE_EXT_2_CATEGORY}}' as PlatformDotCategory,
        subcategories: [
          '{{ORG_TYPE_EXT_2_SUBCAT_1}}',
          '{{ORG_TYPE_EXT_2_SUBCAT_2}}',
        ],
        canAlsoAccess: [],
      },
    },
    
    // Row 2 dots (project-specific semantics)
    row2Semantics: '{{ROW2_SEMANTICS}}',         // e.g., 'progress', 'status', 'priority'
    row2Dots: [
      '{{ROW2_DOT_1}}',                          // e.g., 'planning', 'pending'
      '{{ROW2_DOT_2}}',                          // e.g., 'progress', 'active'
      '{{ROW2_DOT_3}}',                          // e.g., 'completed', 'delivered'
    ],
    row2Config: {
      '{{ROW2_DOT_1}}': {
        label: '{{ROW2_DOT_1_LABEL}}',
        color: '{{ROW2_DOT_1_COLOR}}',
        icon: '{{ROW2_DOT_1_ICON}}',
        description: '{{ROW2_DOT_1_DESC}}',
      },
      '{{ROW2_DOT_2}}': {
        label: '{{ROW2_DOT_2_LABEL}}',
        color: '{{ROW2_DOT_2_COLOR}}',
        icon: '{{ROW2_DOT_2_ICON}}',
        description: '{{ROW2_DOT_2_DESC}}',
      },
      '{{ROW2_DOT_3}}': {
        label: '{{ROW2_DOT_3_LABEL}}',
        color: '{{ROW2_DOT_3_COLOR}}',
        icon: '{{ROW2_DOT_3_ICON}}',
        description: '{{ROW2_DOT_3_DESC}}',
      },
    },
  },

  // Business features
  features: {
    core: [
      '{{CORE_FEATURE_1}}',                      // e.g., 'vehicle-tracking', 'shipment-tracking'
      '{{CORE_FEATURE_2}}',                      // e.g., 'stage-workflow', 'route-planning'
      '{{CORE_FEATURE_3}}',                      // e.g., 'task-management', 'load-management'
      '{{CORE_FEATURE_4}}',                      // e.g., 'customer-portal', 'carrier-portal'
    ],
    optional: [
      '{{OPT_FEATURE_1}}',                       // e.g., 'qr-tracking', 'gps-tracking'
      '{{OPT_FEATURE_2}}',                       // e.g., 'photo-documentation', 'pod-capture'
      '{{OPT_FEATURE_3}}',                       // e.g., 'inventory-management', 'fleet-management'
      '{{OPT_FEATURE_4}}',                       // e.g., 'scheduling', 'route-optimization'
      '{{OPT_FEATURE_5}}',                       // e.g., 'invoicing', 'freight-billing'
      '{{OPT_FEATURE_6}}',                       // e.g., 'analytics', 'performance-metrics'
    ],
    integrations: [
      '{{INTEGRATION_1}}',                       // e.g., 'parts-suppliers', 'fuel-cards'
      '{{INTEGRATION_2}}',                       // e.g., 'insurance-companies', 'toll-systems'
      '{{INTEGRATION_3}}',                       // e.g., 'payment-gateways', 'load-boards'
    ],
  },

  // Routing configuration
  routing: {
    homepage: {
      type: '{{HOMEPAGE_TYPE}}',                 // 'direct' | 'org-selector'
      defaultOrg: '{{DEFAULT_ORG}}',             // Default org type for direct homepage
    },
    paths: {
      '{{ORG_TYPE_1}}': '{{ORG_TYPE_1_PATH}}',  // e.g., '/', '/hauler'
      '{{ORG_TYPE_2}}': '{{ORG_TYPE_2_PATH}}',  // e.g., '/service', '/sender'
      '{{ORG_TYPE_3}}': '{{ORG_TYPE_3_PATH}}',  // e.g., '/dealer', '/broker'
      '{{ORG_TYPE_EXT_1}}': '{{ORG_TYPE_EXT_1_PATH}}',
      '{{ORG_TYPE_EXT_2}}': '{{ORG_TYPE_EXT_2_PATH}}',
    },
  },

  // Brand & visual identity
  branding: {
    colors: {
      primary: '{{PRIMARY_COLOR}}',              // e.g., '#2563eb'
      secondary: '{{SECONDARY_COLOR}}',          // e.g., '#64748b'
      accent: '{{ACCENT_COLOR}}',                // e.g., '#059669'
    },
    logo: {
      text: '{{LOGO_TEXT}}',                     // e.g., '🏭 Lakovňa'
      icon: '{{LOGO_ICON}}',                     // e.g., '🏭', '🚚'
    },
    theme: '{{THEME}}',                          // 'light' | 'dark'
  },

  // Database & technical config
  technical: {
    database: {
      name: '{{DB_NAME}}',                       // e.g., 'lakovna', 'sendeliver'
      schema: '{{DB_SCHEMA}}',                   // e.g., 'automotive_workshop', 'logistics_platform'
    },
    api: {
      prefix: '{{API_PREFIX}}',                  // e.g., '/api/lakovna', '/api/sendeliver'
      version: '{{API_VERSION}}',                // e.g., 'v1'
    },
    websocket: {
      namespace: '{{WS_NAMESPACE}}',             // e.g., '/lakovna', '/sendeliver'
      rooms: [
        '{{WS_ROOM_1}}',                         // e.g., 'workshop', 'fleet'
        '{{WS_ROOM_2}}',                         // e.g., 'customer-tracking', 'shipment-tracking'
      ],
    },
  },

  // Deployment configuration
  deployment: {
    environments: {
      development: {
        domain: '{{DEV_DOMAIN}}',                // e.g., 'localhost:3000'
        database: '{{DEV_DB}}',                  // e.g., 'lakovna_dev'
      },
      staging: {
        domain: '{{STAGING_DOMAIN}}',            // e.g., 'staging.lakovna.com'
        database: '{{STAGING_DB}}',              // e.g., 'lakovna_staging'
      },
      production: {
        domain: '{{PROD_DOMAIN}}',               // e.g., 'lakovna.com'
        database: '{{PROD_DB}}',                 // e.g., 'lakovna_prod'
      },
    },
  },

  // Template generation settings
  template: {
    replaceTokens: {
      '{{PROJECT_NAME}}': '{{PROJECT_NAME}}',
      '{{PROJECT_DISPLAY_NAME}}': '{{PROJECT_DISPLAY_NAME}}',
      '{{PROJECT_DOMAIN}}': '{{PROJECT_DOMAIN}}',
      '{{PRIMARY_COLOR}}': '{{PRIMARY_COLOR}}',
      '{{LOGO_ICON}}': '{{LOGO_ICON}}',
    },
    copyPaths: [
      'common/types/universal/*',
      'common/configs/universal/*',
      'common/utils/universal/*',
    ],
    templatePaths: [
      'common/types/project/*',
      'common/configs/project/*',
      'apps/*/pages/*',
    ],
  },
} as const;

// ========================================
// UTILITY FUNCTIONS (keep as is)
// ========================================

export const getOrgTypeConfig = (orgType: string) => {
  const config = PROJECT_TEMPLATE_CONFIG.orgTypes;
  
  return {
    label: config.labels[orgType as keyof typeof config.labels],
    description: config.descriptions[orgType as keyof typeof config.descriptions],
    isPrimary: config.primary.includes(orgType),
    isExtended: config.extended.includes(orgType),
  };
};

export const getOrgTypePlatformMapping = (orgType: string) => {
  return PROJECT_TEMPLATE_CONFIG.platformDots.mapping[orgType as keyof typeof PROJECT_TEMPLATE_CONFIG.platformDots.mapping];
};

export const getOrgTypePath = (orgType: string) => {
  return PROJECT_TEMPLATE_CONFIG.routing.paths[orgType as keyof typeof PROJECT_TEMPLATE_CONFIG.routing.paths];
};

export const hasFeature = (feature: string) => {
  return PROJECT_TEMPLATE_CONFIG.features.core.includes(feature) ||
         PROJECT_TEMPLATE_CONFIG.features.optional.includes(feature);
};

export const getEnvironmentConfig = (env: string) => {
  return PROJECT_TEMPLATE_CONFIG.deployment.environments[env as keyof typeof PROJECT_TEMPLATE_CONFIG.deployment.environments];
};

export const getTemplateTokens = () => {
  return PROJECT_TEMPLATE_CONFIG.template.replaceTokens;
};

export const getRow2DotConfig = (dot: string) => {
  return PROJECT_TEMPLATE_CONFIG.platformDots.row2Config[dot as keyof typeof PROJECT_TEMPLATE_CONFIG.platformDots.row2Config];
};

export type ProjectTemplateConfig = typeof PROJECT_TEMPLATE_CONFIG;