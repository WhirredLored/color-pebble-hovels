// =============================================================================
// Service Catalog Queries
// =============================================================================
// The list of services offered, one factual line each. Kept to work the
// business has actually done and can show photographs of.
// =============================================================================

export interface Service {
  name: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    name: "Exterior painting",
    description:
      "Priming and finish coats on siding, trim, porches and outbuildings.",
  },
  {
    name: "Surface preparation",
    description:
      "Scraping, sanding, or stripping failed paint back to bare wood before anything goes on.",
  },
  {
    name: "Siding",
    description:
      "Removing damaged siding and installing new, including furring a wall out where it is needed.",
  },
  {
    name: "Wood and rot repair",
    description:
      "Replacing rotted sills, casing, fascia and framing found behind the trim and siding.",
  },
  {
    name: "Trim and millwork",
    description:
      "Cutting and fitting sills, casings and water table on site to match the existing profiles.",
  },
  {
    name: "Weather barrier",
    description:
      "House wrap, taped sheathing seams and flashing before trim and siding go back on.",
  },
];

export function getAllServices(): Service[] {
  return SERVICES;
}

/** The services shown on the home page, ahead of the link to the full list. */
export function getFeaturedServices(): Service[] {
  return SERVICES.slice(0, 4);
}
