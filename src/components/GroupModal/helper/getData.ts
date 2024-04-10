import locationData from "../../../json/location.json";

export const getStates = () => {
  // Extract unique states for the state dropdown
  let states: any = Array.from(
    new Set(locationData.map((location) => location.State))
  );

  states = states.map((state: any) => {
    return { value: state, label: state };
  });

  // Me and my homies hate alaska && hawaii
  states = states?.filter((state: any) => {
    return state?.value !== "Alaska" && state?.value !== "Hawai?i";
  });

  return states;
};

export const getCounty = (state: string) => {
  // Filter counties based on selected state
  let counties: any = locationData.filter(
    (location) => location.State === state
  );

  counties = counties.map((county: any) => {
    return {
      label: county?.County.slice(0, -7),
      value: county?.County.slice(0, -7),
    };
  });

  return counties;
};

export const getBranchOfService = () => {
  return [
    { value: "ANY", label: "Any" },
    { value: "ALL", label: "All Branch" },
    { value: "ARMY", label: "Army" },
    { value: "NAVY", label: "Navy" },
    { value: "AIR_FORCE", label: "Air Force" },
    { value: "COAST_GUARD", label: "Coast Guard" },
    { value: "MARINE_CORPS", label: "Marine Corps" },
    { value: "SPACE_FORCE", label: "Space Force" },
  ];
};
