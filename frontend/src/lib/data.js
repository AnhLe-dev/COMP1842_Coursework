export const categories = [
  "All", // Used specifically for filtering
  "Account",
  "Payment",
  "Technical",
  "Service",
  "General"
];

export const formCategories = categories.filter(cat => cat !== "All");

export const visibleResponseLimit = 5;