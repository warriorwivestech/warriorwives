import locationData from "../../../json/location.json";

export const getStates = () => {
  // Extract unique states for the state dropdown
  const uniqueStates = Array.from(
    new Set(locationData.map((location) => location.State))
  );

  const parsedStates = uniqueStates.map((state) => {
    return { value: state, label: state };
  });

  // Me and my homies hate alaska && hawaii
  const filteredStates = parsedStates?.filter((state) => {
    return state?.value !== "Alaska" && state?.value !== "Hawai?i";
  });

  return filteredStates;
};

export const getCounties = (state: string) => {
  // Filter counties based on selected state
  const filteredCounties = locationData.filter(
    (location) => location.State === state
  );

  const parsedCounties = filteredCounties.map((county) => {
    return {
      // remove 'County' from the end of the county name
      label: county.County.includes("County")
        ? county.County.slice(0, -7)
        : county.County,
      value: county.County.includes("County")
        ? county.County.slice(0, -7)
        : county.County,
    };
  });

  return parsedCounties;
};

export const getCounty = (state: string) => {
  // Filter counties based on selected state
  const filteredCounties = locationData.filter(
    (location) => location.State === state
  );

  const parsedCounties = filteredCounties.map((county) => {
    return {
      label: county.County.slice(0, -7),
      value: county.County.slice(0, -7),
    };
  });

  return parsedCounties;
};

export const getBranchesOfService = () => {
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

export const getInterest = () => {
  return [
    { value: "Cooking", label: "Cooking" },
    { value: "Gardening", label: "Gardening" },
    { value: "Reading", label: "Reading" },
    { value: "Painting", label: "Painting" },
    { value: "Photography", label: "Photography" },
    { value: "Hiking", label: "Hiking" },
    { value: "Playing an Instrument", label: "Playing an Instrument" },
    { value: "Yoga", label: "Yoga" },
    { value: "Knitting", label: "Knitting" },
    { value: "Woodworking", label: "Woodworking" },
  ];
};
