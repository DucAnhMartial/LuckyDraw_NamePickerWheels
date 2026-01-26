/**
 * Attendee/Attendance Type Definition
 * Represents a person attending an event with ticket and check-in information
 */

export interface Attendee {
  /** Attendee's email address */
  attendee_email: string;
  
  /** Attendee's phone number */
  attendee_phone: string;
  
  /** Name of the event they're attending */
  event_name: string;
  
  /** Display name for the attendee */
  display_name: string;
  
  /** Lucky draw ID for raffle purposes */
  lucky_id: number;
  
  /** Unique attendee record ID */
  id: number;
  
  /** Ticket ID associated with this attendance */
  ticket: number;
  
  /** Event session ID */
  session: number;
  
  /** Registration timestamp in ISO format */
  reg_time: string;
  
  /** Whether the attendee has checked in */
  checkin_status: boolean;
  
  /** Check-in timestamp in ISO format */
  checkin_time: string | null;
  
  /** Queue line number for check-in */
  checkin_line: number;
  
  /** Number of times checked in */
  number_of_checkin: number;
  
  /** QR code unique identifier */
  qrcode_id: string;
  
  /** QR code image path */
  qrcode: string;
  
  /** Activities data (reserved for future use) */
  activities: string | null;
  
  /** VIP status information */
  vip: unknown | null;
  
  /** Whether this attendee has already won a prize */
  has_prize: boolean;
  
  /** Prize information if won */
  prize: unknown | null;

  // Optional fields that may not always be present
  
  /** Whether the attendee has checked out */
  checkout_status?: boolean;
  
  /** Queue line number for check-out */
  checkout_line?: number;
  
  /** Check-out timestamp in ISO format */
  checkout_time?: string | null;
  
  /** Number of times checked out */
  number_of_checkout?: number;
  
  /** Whether registration confirmation email was sent */
  email_register_sent?: boolean;
  
  /** Whether check-in confirmation email was sent */
  email_checkin_sent?: boolean;
  
  /** Whether post-event email was sent */
  email_post_event_sent?: boolean;
  
  /** Whether registration ZNS notification was sent */
  zns_register_sent?: boolean;
  
  /** Whether check-in ZNS notification was sent */
  zns_checkin_sent?: boolean;
  
  /** Whether post-event ZNS notification was sent */
  zns_post_event_sent?: boolean;
  
  /** Whether registration SMS was sent */
  sms_register_sent?: boolean;
  
  /** Whether check-in SMS was sent */
  sms_checkin_sent?: boolean;
  
  /** Whether post-event SMS was sent */
  sms_post_event_sent?: boolean;
}

/**
 * Response type for attendees API endpoint
 * Represents paginated attendees data
 */
export interface AttendeesResponse {
  results: Attendee[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

/**
 * Filtered attendees for lucky draw
 * Only includes attendees who:
 * - Haven't won a prize yet (has_prize !== true)
 * - Have checked in (checkin_status === true)
 */
export type EligibleAttendee = Attendee;
