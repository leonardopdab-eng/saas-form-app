export const TIMELINE_OPTIONS = [
  { label: "Immediately", value: "immediately" },
  { label: "Within 30 days", value: "within_30_days" },
  { label: "Within 60–90 days", value: "within_60_90_days" },
  { label: "This quarter", value: "this_quarter" },
  { label: "This year", value: "this_year" },
  { label: "Still evaluating", value: "still_evaluating" }
] as const;

export const BUDGET_OPTIONS = [
  { label: "Under $1,000", value: "under_1000" },
  { label: "$1,000 – $5,000", value: "1000_5000" },
  { label: "$5,000 – $15,000", value: "5000_15000" },
  { label: "$15,000 – $50,000", value: "15000_50000" },
  { label: "$50,000+", value: "50000_plus" },
  { label: "Not defined yet", value: "not_defined_yet" }
] as const;
