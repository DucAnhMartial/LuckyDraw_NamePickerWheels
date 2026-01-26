/**
 * Lucky Draw History/Log Type Definition
 * Represents a lucky draw entry with prize information
 */

export interface LuckyDrawLog {
  /** Unique log entry ID */
  id: number;
  
  /** Ticket ID associated with this draw */
  ticket: number;
  
  /** Prize ID won */
  prize: number;
  
  /** Description of the prize or draw */
  description: string;
  
  /** Creation timestamp in ISO format */
  created_at: string;
  
  /** Last update timestamp in ISO format */
  updated_at: string;
}

/**
 * API response for lucky draw history list
 */
export type LuckyDrawHistoryResponse = LuckyDrawLog[]
