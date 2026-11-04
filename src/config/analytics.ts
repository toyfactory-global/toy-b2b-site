/**
 * ANALYTICS CONFIG - the only file you need to edit to switch tracking on.
 *
 * The site shipped with no analytics at all, so there is currently no way to
 * answer "how many people visited, and where did they leave". Both IDs below
 * are free and take about two minutes to create:
 *
 *   GA4_ID      -> analytics.google.com  -> Admin -> Data streams -> Web
 *                  Copy the "G-" measurement ID.
 *                  Leave the empty string and no tracking script is emitted.
 *
 *   CLARITY_ID  -> clarity.microsoft.com -> Add project -> Settings -> Setup
 *                  Copy the project ID (10 characters, no prefix).
 *                  Leave empty and the Clarity snippet is not emitted.
 *
 * Nothing renders while both values are empty, so an unfilled config cannot
 * slow the site down or send data anywhere.
 */
export const GA4_ID = '';
export const CLARITY_ID = '';

/**
 * Conversion events. These are the five the playbook asks for; four of them
 * are clicks the site can detect without any extra markup, so they are wired
 * globally in Layout.astro rather than per button.
 *
 *   form_submit    RFQ form posted (product pages + homepage)
 *   whatsapp_click every wa.me / api.whatsapp.com link
 *   email_click    every mailto: link
 *   phone_click    every tel: link
 *   catalog_view   /products viewed (proxy for "downloaded the catalogue")
 */
export const EVENTS = ['form_submit', 'whatsapp_click', 'email_click', 'phone_click', 'catalog_view'] as const;


