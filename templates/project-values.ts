// File: templates/project-values.ts
// Last change: Created template values for Lakovna and Sendeliver

export const LAKOVNA_VALUES = {
  // Project identity
  '{{PROJECT_NAME}}': 'lakovna',
  '{{PROJECT_DISPLAY_NAME}}': 'Lakovňa',
  '{{PROJECT_DESCRIPTION}}': 'Automotive Workshop Management System',
  '{{PROJECT_DOMAIN}}': 'lakovna.com',
  '{{PROJECT_VERSION}}': 'v4.0.0',

  // Platform context
  '{{PLATFORM_TYPE}}': 'platform',
  '{{BUSINESS_MODEL}}': 'automotive-workshop',
  '{{PROJECT_CATEGORY}}': 'automotive',

  // Organization types
  '{{ORG_TYPE_1}}': 'bodyshop',
  '{{ORG_TYPE_2}}': 'service',
  '{{ORG_TYPE_3}}': 'dealer',
  '{{ORG_TYPE_EXT_1}}': 'tuning',
  '{{ORG_TYPE_EXT_2}}': 'autofolie',

  // Org type labels
  '{{ORG_TYPE_1_LABEL}}': 'Body Shop',
  '{{ORG_TYPE_2_LABEL}}': 'Auto Service',
  '{{ORG_TYPE_3_LABEL}}': 'Auto Dealer',
  '{{ORG_TYPE_EXT_1_LABEL}}': 'Performance Tuning',
  '{{ORG_TYPE_EXT_2_LABEL}}': 'Vehicle Wrapping',

  // Org type descriptions
  '{{ORG_TYPE_1_DESC}}': 'Karoséria a lakovanie po havárii',
  '{{ORG_TYPE_2_DESC}}': 'Komplexný servis osobných vozidiel',
  '{{ORG_TYPE_3_DESC}}': 'Predaj a komplexný servis vozidiel',
  '{{ORG_TYPE_EXT_1_DESC}}': 'Výkonové úpravy a tuning',
  '{{ORG_TYPE_EXT_2_DESC}}': 'Autofolie a vizuálne úpravy',

  // Platform dots mapping
  '{{ORG_TYPE_1_CATEGORY}}': 'A',  // paint
  '{{ORG_TYPE_2_CATEGORY}}': 'B',  // mechanical
  '{{ORG_TYPE_3_CATEGORY}}': 'AB', // full-service
  '{{ORG_TYPE_EXT_1_CATEGORY}}': 'B',
  '{{ORG_TYPE_EXT_2_CATEGORY}}': 'A',

  // Subcategories
  '{{ORG_TYPE_1_SUBCAT_1}}': 'bodyshop',
  '{{ORG_TYPE_1_SUBCAT_2}}': 'paint-service',
  '{{ORG_TYPE_1_SUBCAT_3}}': 'vehicle-wrapping',
  '{{ORG_TYPE_2_SUBCAT_1}}': 'auto-service',
  '{{ORG_TYPE_2_SUBCAT_2}}': 'engine-repair',
  '{{ORG_TYPE_2_SUBCAT_3}}': 'tire-service',
  '{{ORG_TYPE_3_SUBCAT_1}}': 'auto-dealer',
  '{{ORG_TYPE_3_SUBCAT_2}}': 'authorized-service',
  '{{ORG_TYPE_3_SUBCAT_3}}': 'car-rental',
  '{{ORG_TYPE_EXT_1_SUBCAT_1}}': 'tuning',
  '{{ORG_TYPE_EXT_1_SUBCAT_2}}': 'engine-repair',
  '{{ORG_TYPE_EXT_2_SUBCAT_1}}': 'vehicle-wrapping',
  '{{ORG_TYPE_EXT_2_SUBCAT_2}}': 'detailing',

  // Access categories
  '{{ORG_TYPE_1_ACCESS_CAT}}': 'B',  // bodyshop can access mechanical
  '{{ORG_TYPE_2_ACCESS_CAT}}': 'A',  // service can access paint
  '{{ORG_TYPE_3_ACCESS_CAT_1}}': 'A',
  '{{ORG_TYPE_3_ACCESS_CAT_2}}': 'B',
  '{{ORG_TYPE_EXT_1_ACCESS_CAT}}': 'A',
  '{{ORG_TYPE_EXT_2_ACCESS_CAT}}': '',

  // Row 2 dots (progress tracking)
  '{{ROW2_SEMANTICS}}': 'progress',
  '{{ROW2_DOT_1}}': 'planning',
  '{{ROW2_DOT_2}}': 'progress',
  '{{ROW2_DOT_3}}': 'completed',
  '{{ROW2_DOT_1_LABEL}}': 'Plánovanie',
  '{{ROW2_DOT_1_COLOR}}': '#6b7280',
  '{{ROW2_DOT_1_ICON}}': '📋',
  '{{ROW2_DOT_1_DESC}}': 'Vozidlo v plánovaní a príprave',
  '{{ROW2_DOT_2_LABEL}}': 'V procese',
  '{{ROW2_DOT_2_COLOR}}': '#f59e0b',
  '{{ROW2_DOT_2_ICON}}': '⚡',
  '{{ROW2_DOT_2_DESC}}': 'Vozidlo sa aktívne spracováva',
  '{{ROW2_DOT_3_LABEL}}': 'Hotovo',
  '{{ROW2_DOT_3_COLOR}}': '#10b981',
  '{{ROW2_DOT_3_ICON}}': '✅',
  '{{ROW2_DOT_3_DESC}}': 'Vozidlo je dokončené',

  // Features
  '{{CORE_FEATURE_1}}': 'shipment-tracking',
  '{{CORE_FEATURE_2}}': 'route-planning',
  '{{CORE_FEATURE_3}}': 'load-management',
  '{{CORE_FEATURE_4}}': 'carrier-portal',
  '{{OPT_FEATURE_1}}': 'gps-tracking',
  '{{OPT_FEATURE_2}}': 'pod-capture',
  '{{OPT_FEATURE_3}}': 'fleet-management',
  '{{OPT_FEATURE_4}}': 'route-optimization',
  '{{OPT_FEATURE_5}}': 'freight-billing',
  '{{OPT_FEATURE_6}}': 'performance-metrics',
  '{{INTEGRATION_1}}': 'fuel-cards',
  '{{INTEGRATION_2}}': 'toll-systems',
  '{{INTEGRATION_3}}': 'load-boards',

  // Routing
  '{{HOMEPAGE_TYPE}}': 'org-selector',
  '{{DEFAULT_ORG}}': 'hauler',
  '{{ORG_TYPE_1_PATH}}': '/hauler',
  '{{ORG_TYPE_2_PATH}}': '/sender',
  '{{ORG_TYPE_3_PATH}}': '/broker',
  '{{ORG_TYPE_EXT_1_PATH}}': '/warehouse',
  '{{ORG_TYPE_EXT_2_PATH}}': '/customs',

  // Branding
  '{{PRIMARY_COLOR}}': '#0ea5e9',
  '{{SECONDARY_COLOR}}': '#64748b',
  '{{ACCENT_COLOR}}': '#10b981',
  '{{LOGO_TEXT}}': '🚚 Sendeliver',
  '{{LOGO_ICON}}': '🚚',
  '{{THEME}}': 'light',

  // Technical
  '{{DB_NAME}}': 'sendeliver',
  '{{DB_SCHEMA}}': 'logistics_platform',
  '{{API_PREFIX}}': '/api/sendeliver',
  '{{API_VERSION}}': 'v1',
  '{{WS_NAMESPACE}}': '/sendeliver',
  '{{WS_ROOM_1}}': 'fleet',
  '{{WS_ROOM_2}}': 'shipment-tracking',

  // Deployment
  '{{DEV_DOMAIN}}': 'localhost:3001',
  '{{DEV_DB}}': 'sendeliver_dev',
  '{{STAGING_DOMAIN}}': 'staging.sendeliver.eu',
  '{{STAGING_DB}}': 'sendeliver_staging',
  '{{PROD_DOMAIN}}': 'sendeliver.eu',
  '{{PROD_DB}}': 'sendeliver_prod',
};CORE_FEATURE_1}}': 'vehicle-tracking',
  '{{CORE_FEATURE_2}}': 'stage-workflow',
  '{{CORE_FEATURE_3}}': 'task-management',
  '{{CORE_FEATURE_4}}': 'customer-portal',
  '{{OPT_FEATURE_1}}': 'qr-tracking',
  '{{OPT_FEATURE_2}}': 'photo-documentation',
  '{{OPT_FEATURE_3}}': 'inventory-management',
  '{{OPT_FEATURE_4}}': 'scheduling',
  '{{OPT_FEATURE_5}}': 'invoicing',
  '{{OPT_FEATURE_6}}': 'analytics',
  '{{INTEGRATION_1}}': 'parts-suppliers',
  '{{INTEGRATION_2}}': 'insurance-companies',
  '{{INTEGRATION_3}}': 'payment-gateways',

  // Routing
  '{{HOMEPAGE_TYPE}}': 'org-selector',
  '{{DEFAULT_ORG}}': 'bodyshop',
  '{{ORG_TYPE_1_PATH}}': '/',
  '{{ORG_TYPE_2_PATH}}': '/service',
  '{{ORG_TYPE_3_PATH}}': '/dealer',
  '{{ORG_TYPE_EXT_1_PATH}}': '/tuning',
  '{{ORG_TYPE_EXT_2_PATH}}': '/autofolie',

  // Branding
  '{{PRIMARY_COLOR}}': '#2563eb',
  '{{SECONDARY_COLOR}}': '#64748b',
  '{{ACCENT_COLOR}}': '#059669',
  '{{LOGO_TEXT}}': '🏭 Lakovňa',
  '{{LOGO_ICON}}': '🏭',
  '{{THEME}}': 'light',

  // Technical
  '{{DB_NAME}}': 'lakovna',
  '{{DB_SCHEMA}}': 'automotive_workshop',
  '{{API_PREFIX}}': '/api/lakovna',
  '{{API_VERSION}}': 'v1',
  '{{WS_NAMESPACE}}': '/lakovna',
  '{{WS_ROOM_1}}': 'workshop',
  '{{WS_ROOM_2}}': 'customer-tracking',

  // Deployment
  '{{DEV_DOMAIN}}': 'localhost:3000',
  '{{DEV_DB}}': 'lakovna_dev',
  '{{STAGING_DOMAIN}}': 'staging.lakovna.com',
  '{{STAGING_DB}}': 'lakovna_staging',
  '{{PROD_DOMAIN}}': 'lakovna.com',
  '{{PROD_DB}}': 'lakovna_prod',
};

export const SENDELIVER_VALUES = {
  // Project identity
  '{{PROJECT_NAME}}': 'sendeliver',
  '{{PROJECT_DISPLAY_NAME}}': 'Sendeliver',
  '{{PROJECT_DESCRIPTION}}': 'Logistics Ecosystem Platform',
  '{{PROJECT_DOMAIN}}': 'sendeliver.eu',
  '{{PROJECT_VERSION}}': 'v2.0.0',

  // Platform context
  '{{PLATFORM_TYPE}}': 'logistics',
  '{{BUSINESS_MODEL}}': 'logistics-ecosystem',
  '{{PROJECT_CATEGORY}}': 'logistics',

  // Organization types
  '{{ORG_TYPE_1}}': 'hauler',
  '{{ORG_TYPE_2}}': 'sender',
  '{{ORG_TYPE_3}}': 'broker',
  '{{ORG_TYPE_EXT_1}}': 'warehouse',
  '{{ORG_TYPE_EXT_2}}': 'customs',

  // Org type labels
  '{{ORG_TYPE_1_LABEL}}': 'Carrier',
  '{{ORG_TYPE_2_LABEL}}': 'Client',
  '{{ORG_TYPE_3_LABEL}}': 'Forwarder',
  '{{ORG_TYPE_EXT_1_LABEL}}': 'Warehouse',
  '{{ORG_TYPE_EXT_2_LABEL}}': 'Customs Agency',

  // Org type descriptions
  '{{ORG_TYPE_1_DESC}}': 'Transport companies and fleet operators',
  '{{ORG_TYPE_2_DESC}}': 'Companies sending goods and cargo',
  '{{ORG_TYPE_3_DESC}}': 'Freight forwarders and brokers',
  '{{ORG_TYPE_EXT_1_DESC}}': 'Storage and distribution centers',
  '{{ORG_TYPE_EXT_2_DESC}}': 'Customs clearance services',

  // Platform dots mapping
  '{{ORG_TYPE_1_CATEGORY}}': 'A',  // mechanical (trucks)
  '{{ORG_TYPE_2_CATEGORY}}': 'B',  // full-service (clients)
  '{{ORG_TYPE_3_CATEGORY}}': 'AB', // broker (hybrid)
  '{{ORG_TYPE_EXT_1_CATEGORY}}': 'B',
  '{{ORG_TYPE_EXT_2_CATEGORY}}': 'AB',

  // Subcategories
  '{{ORG_TYPE_1_SUBCAT_1}}': 'truck-fleet',
  '{{ORG_TYPE_1_SUBCAT_2}}': 'van-delivery',
  '{{ORG_TYPE_1_SUBCAT_3}}': 'specialized-transport',
  '{{ORG_TYPE_2_SUBCAT_1}}': 'manufacturer',
  '{{ORG_TYPE_2_SUBCAT_2}}': 'distributor',
  '{{ORG_TYPE_2_SUBCAT_3}}': 'e-commerce',
  '{{ORG_TYPE_3_SUBCAT_1}}': 'freight-forwarder',
  '{{ORG_TYPE_3_SUBCAT_2}}': 'logistics-broker',
  '{{ORG_TYPE_3_SUBCAT_3}}': 'transport-exchange',
  '{{ORG_TYPE_EXT_1_SUBCAT_1}}': 'distribution-center',
  '{{ORG_TYPE_EXT_1_SUBCAT_2}}': 'cross-docking',
  '{{ORG_TYPE_EXT_2_SUBCAT_1}}': 'import-export',
  '{{ORG_TYPE_EXT_2_SUBCAT_2}}': 'customs-clearance',

  // Access categories
  '{{ORG_TYPE_1_ACCESS_CAT}}': 'B',
  '{{ORG_TYPE_2_ACCESS_CAT}}': 'A',
  '{{ORG_TYPE_3_ACCESS_CAT_1}}': 'A',
  '{{ORG_TYPE_3_ACCESS_CAT_2}}': 'B',
  '{{ORG_TYPE_EXT_1_ACCESS_CAT}}': 'A',
  '{{ORG_TYPE_EXT_2_ACCESS_CAT}}': '',

  // Row 2 dots (shipment status)
  '{{ROW2_SEMANTICS}}': 'status',
  '{{ROW2_DOT_1}}': 'pending',
  '{{ROW2_DOT_2}}': 'in-transit',
  '{{ROW2_DOT_3}}': 'delivered',
  '{{ROW2_DOT_1_LABEL}}': 'Pending',
  '{{ROW2_DOT_1_COLOR}}': '#6b7280',
  '{{ROW2_DOT_1_ICON}}': '📦',
  '{{ROW2_DOT_1_DESC}}': 'Shipment awaiting pickup',
  '{{ROW2_DOT_2_LABEL}}': 'In Transit',
  '{{ROW2_DOT_2_COLOR}}': '#3b82f6',
  '{{ROW2_DOT_2_ICON}}': '🚚',
  '{{ROW2_DOT_2_DESC}}': 'Shipment on the way',
  '{{ROW2_DOT_3_LABEL}}': 'Delivered',
  '{{ROW2_DOT_3_COLOR}}': '#10b981',
  '{{ROW2_DOT_3_ICON}}': '✅',
  '{{ROW2_DOT_3_DESC}}': 'Shipment delivered',

  // Features
  '{{