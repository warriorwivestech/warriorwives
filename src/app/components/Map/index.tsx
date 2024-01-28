"use client";

import React, { useRef, useEffect, useState } from "react";
import { Card, Flex, SimpleGrid } from "@chakra-ui/react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import axios from "axios";

import { Box, Button, Checkbox, Heading, Spinner } from "@chakra-ui/react";
import GroupCard from "../GroupCards";
const sampleGroupData = [
  {
    id: "1",
    title: "Beach Clean-Up",
    description:
      "Join us for a community beach clean-up and make a difference!",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "Join Event",
  },
  {
    id: "2",
    title: "Local Art Exhibition",
    description:
      "Explore stunning artworks by local artists in our vibrant art exhibition.",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "View Details",
  },
  {
    id: "3",
    title: "Charity Fun Run",
    description:
      "Participate in our 5k fun run to raise funds for a noble cause.",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "Register Now",
  },
  {
    id: "4",
    title: "Outdoor Yoga Session",
    description:
      "Experience tranquility and mindfulness with our outdoor yoga classes.",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "Join Session",
  },
  {
    id: "5",
    title: "Tech Networking Event",
    description:
      "Connect with fellow tech enthusiasts and industry leaders at our networking event.",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "Sign Up",
  },
  {
    id: "6",
    title: "Cooking Workshop",
    description:
      "Learn new culinary skills in our interactive cooking workshop.",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "Enroll Today",
  },
  {
    id: "7",
    title: "Book Club Meetup",
    description:
      "Join our monthly book club meeting to discuss this month's chosen book.",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "Attend Meetup",
  },
  {
    id: "8",
    title: "Live Jazz Night",
    description: "Enjoy an evening of live jazz music at our local café.",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "Reserve Seats",
  },
  {
    id: "9",
    title: "Community Gardening",
    description: "Get your hands dirty and help beautify our community garden.",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "Volunteer",
  },
  {
    id: "10",
    title: "Film Screening Under the Stars",
    description:
      "Join us for an open-air screening of classic and contemporary films.",
    imageUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    buttonText: "Buy Tickets",
  },
];

const SAMPLE_LOCATION = [-98, 39];

const COUNTY_GEOJSON_URL =
  "https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson";
const STATE_GEOJSON_URL =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

function generateColorFromString(stateName: string) {
  let hash = 0;
  for (let i = 0; i < stateName.length; i++) {
    hash = stateName.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = hash * 31 + stateName.length;
  hash = hash * 17 + stateName.charCodeAt(stateName.length - 1);
  hash = hash & 0x7fffffff;
  return "#" + (hash | 0x44000000).toString(16).slice(1, 7);
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY!;

  const [byCounty, setByCounty] = useState(false);
  const [stateGeoJsonData, setStateGeoJsonData] = useState(null);
  const [countyGeoJsonData, setCountyGeoJsonData] = useState(null);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");

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
          "fill-color": generateColorFromString(feature.properties.name),
          "fill-opacity": 0.5,
        },
      });

      map.current!.on("click", `state-fill-${index}`, function (e) {
        setSelectedState(e.features![0].properties.name);
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
            // TODO: uncomment once done
            // const { latitude, longitude } = position.coords;

            // sample data
            const [longitude, latitude] = SAMPLE_LOCATION;

            const marker = new maptilersdk.Marker()
              .setLngLat([longitude, latitude])
              .addTo(map.current!);
            const popup = new maptilersdk.Popup()
              .setLngLat([longitude, latitude])
              .setHTML("You are here!")
              .addTo(map.current!);
            marker.setPopup(popup);

            map.current!.setCenter([longitude, latitude]);
            map.current!.setZoom(5);
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
  }, [byCounty]);

  const [selectedString, setSelectedString] = useState("");

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

    setSelectedString(
      `Groups in ${
        selectedCounty ? `${selectedCounty}, ` : ""
      } ${selectedState}`
    );
  }, [selectedState, selectedCounty]);

  return (
    <Flex className='flex-col gap-2'>
      <Flex className='items-end justify-between'>
        <p className='text-heading5'>Search by Location</p>
        <Checkbox
          onChange={(e) => setByCounty(e.target.checked)}
          disabled={loading}
        >
          Search by county
        </Checkbox>
      </Flex>
      {loading && (
        <Flex className='w-full h-[60vh] min-h-[500px] justify-center items-center'>
          <Spinner />
        </Flex>
      )}
      <Flex
        className={`${loading ? "hidden" : ""} flex-col ${
          selectedString ? "gap-8" : "gap-2"
        }`}
      >
        <Box className='relative w-full h-[60vh] min-h-[500px]'>
          <Card ref={mapContainer} className='absolute w-full h-full' />
        </Box>
        {selectedString ? (
          <Flex className='flex-col gap-4'>
            <p className='text-base font-semibold'>{selectedString}</p>
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
              {sampleGroupData.map((group, index) => {
                return <GroupCard key={index} {...group} />;
              })}
            </SimpleGrid>
          </Flex>
        ) : (
          <p className='text-sm font-normal text-gray-500'>
            Click on a state/county to get started.
          </p>
        )}
      </Flex>
    </Flex>
  );
};

export default Map;
