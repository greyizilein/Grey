/* ==========================================================
   GREY — settings
   Prices, payment details and books live here, so the quote
   builder, invoices and bookshop all change from one place.
   Lines marked CONFIRM are placeholders for Grey to check.
   ========================================================== */
window.GREY = {
  currency: "₦",

  // WhatsApp number used by "Send to Grey" and "I've paid" buttons (digits only, with country code).
  whatsapp: "2347072181160",

  // Online payments. Invoices open this Paystack page with the amount and invoice number filled in.
  paystackPayLink: "https://paystack.shop/pay/inkroom",   // CONFIRM: same link the Pricing page uses

  // Bank transfer details, shown only on an invoice. Leave as null to show Paystack only.
  bank: null,   // e.g. { name: "Bank name", accountNumber: "0123456789", accountName: "GREY LLC" }

  quoteValidDays: 14,        // CONFIRM: how long an invoice stays valid

  /* ── Agricultural investment (figures from the Investments page) ── */
  investments: {
    commodities: {
      maize:    { label: "Maize",    unitPrice: 30000 },
      rice:     { label: "Rice",     unitPrice: 45000 },
      millet:   { label: "Millet",   unitPrice: 32000 },
      sorghum:  { label: "Sorghum",  unitPrice: 35000 },
      soybeans: { label: "Soybeans", unitPrice: 50000 },
    },
    durations: [
      { months: 3,  roi: 12 },
      { months: 6,  roi: 20 },
      { months: 9,  roi: 25 },
      { months: 12, roi: 30 },
    ],
  },

  /* ── Business consultation (figures from the Investments page) ── */
  consultation: [
    { id: "custom",   label: "Custom plan",   price: 30000,  fee: 5000, note: "One focused session, strategy memo, 48-hour follow-up" },
    { id: "standard", label: "Standard plan", price: 100000, fee: 0,    note: "Three months of structured sessions" },
    { id: "premium",  label: "Premium plan",  price: 200000, fee: 0,    note: "Ongoing support, unlimited sessions (3 months)" },
  ],

  /* ── Everyday services ── */
  // CONFIRM: every price below is a placeholder. The site lists these as "Custom", so invoices
  // for everyday services are marked ESTIMATE until Grey confirms the scope.
  services: [
    { id: "meals",    label: "Meals & catering",      unit: "per order",   price: 15000 },  // CONFIRM
    { id: "cleaning", label: "Professional cleaning", unit: "per visit",   price: 20000 },  // CONFIRM
    { id: "homecare", label: "Home care",             unit: "per visit",   price: 15000 },  // CONFIRM
    { id: "errands",  label: "Errands & shopping",    unit: "per errand",  price: 5000 },   // CONFIRM
    { id: "delivery", label: "Delivery & logistics",  unit: "per trip",    price: 7500 },   // CONFIRM
  ],
  subscriptionDiscount: 10,  // CONFIRM: % off everyday services booked as a monthly subscription

  // Books, covers, blurbs and synopses: see catalogue.js.
};
