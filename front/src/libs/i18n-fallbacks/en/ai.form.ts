// File: front/src/libs/i18n-fallbacks/en/ai.form.ts
// Purpose: Tiny built-in EN fallback bundle for ai.form namespace
// ================================

const en_ai_form: Record<string, string> = {
  // Form titles
  title_sender: 'Describe what you want to send',
  title_hauler: 'Describe the load you can carry',
  
  // Form descriptions
  description_sender: 'Type your request and we will extract the route and cargo details.',
  description_hauler: 'Type what routes you can serve and your capacity.',
  
  // Tab labels
  tab_example_1: 'Example 1',
  tab_example_2: 'Example 2',
  tab_example_3: 'Example 3',
  
  // Sender placeholders
  placeholder_example_1_sender: 'Example: 10 pallets from Bratislava to Berlin tomorrow morning.',
  placeholder_example_2_sender: 'Example: Pick up Kosice 12:00, deliver Vienna 18:00, 800 kg on 4 pallets.',
  placeholder_example_3_sender: 'Example: From Zilina to Prague next Tuesday, 1.2 t machinery.',
  
  // Hauler placeholders
  placeholder_example_1_hauler: 'Example: Free truck in Bratislava → Munich tomorrow, 13.6 LKW, 24 pallets.',
  placeholder_example_2_hauler: 'Example: Daily shuttle Kosice ↔ Budapest, 8 pallets, 1 t capacity.',
  placeholder_example_3_hauler: 'Example: Express van today afternoon, Trnava → Linz, 600 kg.',
  
  // Buttons
  button_ask_sender: 'Find Transport',
  button_ask_hauler: 'Post Capacity',
  button_processing: 'Processing…',
  
  // Modal
  modal_title: 'Extracted Data',
  modal_close: 'Close',
  extracted_data: 'AI Extracted Information',
  
  // Labels
  pickup_location: 'Pickup Location',
  delivery_location: 'Delivery Location',
  pickup_date: 'Pickup Date',
  delivery_date: 'Delivery Date',
  weight: 'Weight (kg)',
  pallets: 'Pallets',
  gps: 'GPS Coordinates',
};

export default en_ai_form;