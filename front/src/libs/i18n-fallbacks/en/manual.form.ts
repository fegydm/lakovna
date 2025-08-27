// File: front/src/libs/i18n-fallbacks/en/manual.form.ts
// Purpose: Tiny built-in EN fallback bundle for manual.form namespace
// ================================

const en_manual_form: Record<string, string> = {
  // Form titles
  title_sender: 'Quick Search Form',
  title_hauler: 'Capacity Search Form',
  
  // Form descriptions
  description_sender: 'Enter basic details for instant matches',
  description_hauler: 'Specify your transport capacity',
  
  // Location fields
  label_country: 'Country',
  label_pickup_location: 'Pickup Location',
  label_delivery_location: 'Delivery Location',
  label_postal_code: 'Postal Code',
  label_city: 'City',
  
  // Date/time fields
  label_pickup_date: 'Pickup Date',
  label_pickup_time: 'Pickup Time',
  label_delivery_date: 'Delivery Date',
  label_delivery_time: 'Delivery Time',
  
  // Cargo fields
  label_weight: 'Weight',
  label_pallets: 'Pallets',
  label_cargo_type: 'Cargo Type',
  label_special_requirements: 'Special Requirements',
  
  // Vehicle fields (hauler)
  label_vehicle_type: 'Vehicle Type',
  label_capacity: 'Capacity',
  label_available_from: 'Available From',
  label_available_to: 'Available To',
  
  // Placeholders
  placeholder_weight: 'e.g., 1.5 t or 1500 kg',
  placeholder_pallets: 'Number of pallets',
  placeholder_postal_code: 'e.g., 01001',
  placeholder_city: 'e.g., Bratislava',
  placeholder_special_requirements: 'Temperature controlled, fragile, etc.',
  
  // Buttons
  button_search: 'Search',
  button_reset: 'Reset',
  button_clear: 'Clear',
  
  // Validation messages
  error_required_field: 'This field is required',
  error_invalid_weight: 'Please enter valid weight',
  error_invalid_date: 'Please enter valid date',
  error_invalid_postal_code: 'Invalid postal code format',
  
  // Success messages
  success_form_submitted: 'Form submitted successfully',
  success_data_loaded: 'Data loaded successfully',
};

export default en_manual_form;