"use client";

import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import axios, { AxiosResponse } from "axios";

import "./Map.css";
import { Box, Checkbox, Select } from "@chakra-ui/react";

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
        const stateName = e.features![0].properties.name;
        alert("Clicked on " + stateName);
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
      const countyName = e.features![0].properties.NAME;
      alert("Clicked on " + countyName);
    });
  };

  useEffect(() => {
    if (map.current) return;

    const setupMap = async () => {
      map.current = new maptilersdk.Map({
        container: mapContainer.current as string | HTMLElement,
        style: maptilersdk.MapStyle.STREETS,
        center: [-98, 39],
        zoom: 4,
      });

      await map.current.onLoadAsync();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            map.current!.setCenter([
              position.coords.longitude,
              position.coords.latitude,
            ]);
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
    };

    setupMap();
  }, [map.current]);

  const removeSourceAndLayers = () => {
    if (map.current!.getSource("county-boundaries"))
      map.current!.removeSource("county-boundaries");
    if (map.current!.getLayer("county-boundaries-fill"))
      map.current!.removeLayer("county-boundaries-fill");
    if (map.current!.getLayer("county-boundaries-line"))
      map.current!.removeLayer("county-boundaries-line");
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

  return (
    <>
      <Checkbox onChange={(e) => setByCounty(e.target.checked)}>
        By county
      </Checkbox>
      <Box className='relative w-full h-[60vh]'>
        <Box ref={mapContainer} className='absolute w-full h-full' />
      </Box>
    </>
  );
};

export default Map;
