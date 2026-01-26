/**
 * Session Type Definition
 * Represents an event session
 */

export interface Session {
  /** Unique session identifier */
  id: number;
  
  /** Session name */
  name: string;
  
  /** Session code identifier */
  session_code: string;
  
  /** Session start time in ISO format */
  start_time: string;
  
  /** Session end time in ISO format */
  end_time: string;
  
  /** Associated event ID */
  event: number;
  
  /** Session description */
  description: string;
  
  /** Points associated with the session */
  point: number;
}

/**
 * Response type for sessions API endpoint
 * Represents paginated sessions data
 */
export interface SessionsResponse {
  results: Session[];
  count: number;
  next?: string | null;
  previous?: string | null;
}
