// 📦 VALID USER ROLES IN SYSTEM
const VALID_ROLES = [
  "admin",
  "user",
];

// 🔔 VALID NOTIFICATION TYPES
const NOTIFICATION_KINDS = [
  "ORDER_STATUS",        // user: order update
  "ORDER_PLACED",        // user: confirmation
  "ANALYSIS_RESULT",     // user: skin report ready
  "PROMO",               // user: marketing promo
  "FEEDBACK_REPLY",      // user: ticket response

  "NEW_USER",            // admin: new user signed up
  "NEW_ORDER",           // admin: order placed
  "STOCK_LOW",           // admin: inventory alert
  "REPORT_RECEIVED",     // admin: complaint filed
  "ANALYSIS_ALERT",       // admin: failed/flagged analysis
   // ⚙️ Account/Role Related
  "ACCOUNT_SUSPENDED",    // Admin suspended a user account
  "ACCOUNT_RESTORED",     // Admin restored a previously suspended account
  "ROLE_CHANGED",          // Admin changed user role
  "MANAGEMENT_ORDER_PLACED"
  ,"MANAGEMENT_REFUND_REQUEST",
  "CONTACT_MESSAGE"
];

module.exports = {
  VALID_ROLES,
  NOTIFICATION_KINDS
};
