// File: front/src/libs/i18n-fallbacks/en/result.table.ts

const en_result_table: Record<string, string> = {
  header_company: 'Company',
  header_contact: 'Contact',
  header_rating: 'Rating',
  header_distance: 'Distance',
  header_price: 'Price',
  header_transit_time: 'Transit Time',
  header_vehicle_type: 'Vehicle Type',
  header_availability: 'Availability',
  header_status: 'Status',
  header_actions: 'Actions',
  
  filter_all: 'All',
  filter_availability: 'Availability',
  filter_rating: 'Rating',
  filter_distance: 'Distance',
  filter_price: 'Price',
  filter_vehicle_type: 'Vehicle Type',
  filter_transit_time: 'Transit Time',
  
  filter_available_now: 'Available Now',
  filter_available_today: 'Available Today',
  filter_available_week: 'This Week',
  filter_rating_5: '5 Stars',
  filter_rating_4_plus: '4+ Stars',
  filter_rating_3_plus: '3+ Stars',
  filter_distance_20: 'Up to 20km',
  filter_distance_50: 'Up to 50km',
  filter_distance_100: 'Up to 100km',
  filter_distance_200: 'Up to 200km',
  
  vehicle_van: 'Van',
  vehicle_truck: 'Truck',
  vehicle_semi: 'Semi-trailer',
  vehicle_rigid: 'Rigid Truck',
  
  status_available: 'Available',
  status_busy: 'Busy',
  status_offline: 'Offline',
  status_maintenance: 'Maintenance',
  
  action_contact: 'Contact',
  action_book: 'Book Now',
  action_view_details: 'View Details',
  action_request_quote: 'Request Quote',
  
  loading: 'Loading results...',
  no_results: 'No results found',
  error_loading: 'Error loading data',
  
  showing_results: 'Showing {count} of {total} results',
  load_more: 'Load More',
  page_of: 'Page {current} of {total}',
  
  sort_asc: 'Sort ascending',
  sort_desc: 'Sort descending',
  sort_none: 'No sorting',
  
  unit_km: 'km',
  unit_kg: 'kg',
  unit_t: 't',
  unit_hours: 'hours',
  unit_days: 'days',
  
  confirm_booking: 'Are you sure you want to book this transport?',
  booking_success: 'Transport booked successfully',
  booking_error: 'Error booking transport',
  
  sender_no_carriers: 'No carriers found for your request',
  sender_expand_search: 'Try expanding your search criteria',
  
  hauler_no_loads: 'No loads available in your area',
  hauler_check_later: 'Check back later for new opportunities',
};

export default en_result_table;
