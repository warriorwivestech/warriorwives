"use client";

import React, { useRef, useEffect, useState } from "react";
import { Card, Flex } from "@chakra-ui/react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import axios from "axios";

import { Box, Checkbox, Spinner } from "@chakra-ui/react";
import { FaMapMarkedAlt } from "react-icons/fa";
import GroupCard from "../GroupCards";
import MapLoading from "./loading";
import IconText from "../common/icontext";
import { GroupData } from "@/app/api/groups/[groupId]/types";
import { SWRProvider } from "@/providers/swrProvider";
import useSWR from "swr";
import { Toggle } from "../ui/toggle";

const COUNTY_GEOJSON_URL =
  "https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson";
const STATE_GEOJSON_URL =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

export function generateColorFromString(stateName: string, opacity: string) {
  let hash = 0;
  for (let i = 0; i < stateName.length; i++) {
    hash = stateName.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = hash * 31 + stateName.length;
  hash = hash * 17 + stateName.charCodeAt(stateName.length - 1);
  hash = hash & 0x7fffffff;
  return "#" + (hash | 0x44000000).toString(16).slice(1, 7) + opacity;
}

function getDynamicBounds(
  [centerLng, centerLat]: [number, number],
  radiusMiles: number
) {
  const milePerLng = 53.7567404459;
  const milePerLat = 69.172;

  const lngRadius = radiusMiles / milePerLng;
  const latRadius = radiusMiles / milePerLat;

  return [
    [centerLng - lngRadius, centerLat - latRadius], // southwest coordinates
    [centerLng + latRadius, centerLat + lngRadius], // northeast coordinates
  ];
}

const _Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY!;

  const [byCounty, setByCounty] = useState(false);
  const [stateGeoJsonData, setStateGeoJsonData] = useState(null);
  const [countyGeoJsonData, setCountyGeoJsonData] = useState(null);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");

  const [selectedNational, setSelectedNational] = useState(false);
  const [selectedInternational, setSelectedInternational] = useState(false);

  const [loading, setLoading] = useState(true);

  const addStateGeoJsonDataToMap = (geoJsonData: any) => {
    geoJsonData?.features.forEach((feature: any, index: number) => {
      map.current!.addLayer({
        id: `state-fill-${index}`,
        type: "fill",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [feature],
          },
        } as string & maptilersdk.GeoJSONSourceSpecification,
        paint: {
          "fill-color": generateColorFromString(feature.properties.name, "FF"),
          "fill-opacity": 0.5,
        },
      });

      map.current!.on("click", `state-fill-${index}`, function (e) {
        setSelectedState(e.features![0].properties.name);
        setSelectedNational(false);
        setSelectedInternational(false);
      });
    });
  };

  const addCountyGeoJsonDataToMap = (geoJsonData: any) => {
    removeSourceAndLayers();

    map.current!.addSource("county-boundaries", {
      type: "geojson",
      data: geoJsonData,
    });

    map.current!.addLayer({
      id: `county-boundaries-fill`,
      type: "fill",
      source: "county-boundaries",
      paint: {
        "fill-opacity": 0,
      },
    });

    map.current!.addLayer({
      id: `county-boundaries-line`,
      type: "line",
      source: "county-boundaries",
      paint: {
        "line-color": "#088",
        "line-width": 1,
      },
    });

    map.current!.on("click", `county-boundaries-fill`, function (e) {
      setSelectedCounty(e.features![0].properties.NAME);
      setSelectedNational(false);
      setSelectedInternational(false);
    });
  };

  useEffect(() => {
    if (map.current) return;

    setLoading(true);
    const setupMap = async () => {
      map.current = new maptilersdk.Map({
        container: mapContainer.current as string | HTMLElement,
        style: maptilersdk.MapStyle.STREETS,
        center: [-98, 39],
        zoom: 4,
      });

      map.current.setMaxBounds([
        [-130, 24],
        [-60, 50],
      ]);

      await map.current.onLoadAsync();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const { latitude, longitude } = position.coords;

            if (
              (longitude < 130 && longitude > -60) ||
              (latitude < 24 && latitude > 50)
            )
              return;

            const marker = new maptilersdk.Marker()
              .setLngLat([longitude, latitude])
              .addTo(map.current!);
            const popup = new maptilersdk.Popup()
              .setLngLat([longitude, latitude])
              .setHTML("You are here!")
              .addTo(map.current!);
            marker.setPopup(popup);

            map.current!.setCenter([longitude, latitude]);
            map.current!.setZoom(9);
            // map.current!.setMaxBounds(
            //   getDynamicBounds(
            //     [longitude, latitude],
            //     100
            //   ) as maptilersdk.LngLatBoundsLike
            // );
            setByCounty(true);
          },
          function (error) {
            console.error("cannot get user location: ", error.message);
          }
        );
      } else {
        console.error("geolocation not supported by client browser");
      }

      // for caching geojson data to prevent reload every time
      let data = stateGeoJsonData;
      if (!stateGeoJsonData) {
        try {
          const response = await axios.get(STATE_GEOJSON_URL);
          setStateGeoJsonData(response.data);
          addStateGeoJsonDataToMap(response.data);
        } catch (e) {
          console.error("error fetching geojson data: ", e);
          return;
        }
      }
      addStateGeoJsonDataToMap(data);
      setLoading(false);
    };
    setupMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map.current]);

  const removeSourceAndLayers = () => {
    if (map.current!.getLayer("county-boundaries-fill"))
      map.current!.removeLayer("county-boundaries-fill");
    if (map.current!.getLayer("county-boundaries-line"))
      map.current!.removeLayer("county-boundaries-line");
    if (map.current!.getSource("county-boundaries"))
      map.current!.removeSource("county-boundaries");
  };

  useEffect(() => {
    if (!byCounty) {
      removeSourceAndLayers();
      return;
    }

    const addCountyBorders = async () => {
      // similar to caching for state data
      let data = countyGeoJsonData;
      if (!countyGeoJsonData) {
        try {
          const response = await axios.get(COUNTY_GEOJSON_URL);
          setCountyGeoJsonData(response.data);
          data = response.data;
        } catch (e) {
          console.error("error fetching geojson data: ", e);
        }
      }
      addCountyGeoJsonDataToMap(data);
    };

    addCountyBorders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byCounty]);

  const selectedCountyQuery = selectedCounty ? `county=${selectedCounty}` : "";
  const selectedStateQuery = selectedState ? `state=${selectedState}` : "";
  const queryString = selectedCountyQuery
    ? `?${selectedCountyQuery}`
    : selectedStateQuery
      ? `?${selectedStateQuery}`
      : "";

  const fetchOptions: RequestInit = {
    next: { tags: ["groups", queryString], revalidate: 60 * 5 },
    // cache: "force-cache",
  };
  const {
    data: groups,
    error,
    isLoading: isLoadingGroups,
  } = useSWR<GroupData[], any>([`/groups${queryString}`, fetchOptions]);

  useEffect(() => {
    /* 
    if NO STATE SELECTED (havent chosen before)
    or NO COUNTY SELECTED and SEARCHING BY COUNTY (first time checking byCounty)
    or COUNTY SELECTED and NOT SEARCHING BY COUNTY (previously selected county, but just unchecked byCounty)
    */
    if (
      !selectedState ||
      (!selectedCounty && byCounty) ||
      (selectedCounty && !byCounty)
    ) {
      setSelectedCounty("");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedCounty]);

  const GroupsBySelectedLocation = () => {
    if (loading || !selectedState) return;
    if (isLoadingGroups) return <MapLoading />;
    if (error)
      return (
        <p className="text-sm font-normal text-gray-700 mt-4">
          Uh oh! Error loading troops
        </p>
      );
    if (!groups || groups.length === 0)
      return (
        <p className="text-sm font-normal text-gray-700 mt-4">
          No troops found in {selectedCounty && `${selectedCounty}, `}
          {selectedState}.
        </p>
      );

    function getGroupsText() {
      if (selectedNational) {
        return "National Troops";
      }
      if (selectedInternational) {
        return "International Troops";
      }
      return `Troops in ${selectedCounty && `${selectedCounty}, `}${selectedState}`;
    }

    return (
      <Flex className="flex-col gap-4 pt-4">
        <p className="text-base font-semibold">{getGroupsText()}</p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            return <GroupCard key={group.id} {...group} />;
          })}
        </div>
      </Flex>
    );
  };

  return (
    <Flex className="flex-col gap-2">
      <Flex className="items-end justify-between">
        <IconText icon={FaMapMarkedAlt} textClassName="text-heading5">
          Search troops by location
        </IconText>
        <Checkbox
          isChecked={byCounty}
          onChange={(e) => setByCounty(e.target.checked)}
          disabled={loading}
        >
          <p className="text-sm text-gray-700">Search by county</p>
        </Checkbox>
      </Flex>
      <Flex className={`flex-col gap-2`}>
        <Box className="relative w-full h-[60vh] min-h-[500px]">
          <Card ref={mapContainer} className="absolute w-full h-full">
            {loading && (
              <Flex className="h-full justify-center items-center">
                <Spinner />
              </Flex>
            )}
          </Card>
        </Box>
        <div className="flex flex-row gap-2 justify-between align-middle items-center">
          <p className="text-sm font-normal text-gray-500 text-center">
            Click on a state/county or National/International status to filter
            troops by location.
          </p>
          <div className="flex flex-row gap-2">
            <Toggle
              variant="outline"
              className="bg-white data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              pressed={selectedNational}
              onPressedChange={() => {
                setSelectedNational(true);
                setSelectedInternational(false);
                setSelectedState("National");
                setSelectedCounty("");
              }}
            >
              National
            </Toggle>
            <Toggle
              variant="outline"
              className="bg-white data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              pressed={selectedInternational}
              onPressedChange={() => {
                setSelectedNational(false);
                setSelectedInternational(true);
                setSelectedState("International");
                setSelectedCounty("");
              }}
            >
              International (OCONUS)
            </Toggle>
          </div>
        </div>
        <GroupsBySelectedLocation />
      </Flex>
    </Flex>
  );
};

export default function Map() {
  return (
    <SWRProvider>
      <_Map />
    </SWRProvider>
  );
}
