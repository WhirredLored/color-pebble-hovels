// =============================================================================
// Process Steps Queries
// =============================================================================
// The order a job runs in, as rendered on the Process page.
// =============================================================================

export interface ProcessStep {
  name: string;
  description: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    name: "Site visit",
    description:
      "We walk the house, look at the condition of the siding, trim and paint, and note what is likely to need repair.",
  },
  {
    name: "Written proposal",
    description:
      "You get the scope and the price in writing. Rot that is hidden behind trim is called out as an unknown until it is opened up.",
  },
  {
    name: "Tear-off and repair",
    description:
      "Siding or failed paint comes off. Rotted sills, casing, fascia and framing are replaced once we can see them.",
  },
  {
    name: "Weather barrier and trim",
    description:
      "House wrap and flashing go on, then sills, casing and water table, cut to fit the existing profiles.",
  },
  {
    name: "Prime and paint",
    description: "Bare wood is primed, then the finish coats go on.",
  },
  {
    name: "Walkthrough",
    description:
      "We walk the finished job with you and take care of anything that needs it before we leave.",
  },
];

export function getProcessSteps(): ProcessStep[] {
  return PROCESS_STEPS;
}
