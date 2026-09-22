"use client";

import { useQuery } from "@tanstack/react-query";

export type WeatherSnapshot = {
  temperature: number;
  wind: number;
  humidity: number;
  code: number;
  label: string;
};

const WEATHER_LABELS: Record<number, string> = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  80: "Showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorm"
};

export function weatherLabel(code: number) {
  return WEATHER_LABELS[code] ?? "Local conditions";
}

export function useWeather(lat: number, lon: number) {
  return useQuery<WeatherSnapshot>({
    queryKey: ["open-meteo", lat, lon],
    queryFn: async () => {
      const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lon),
        current: "temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m"
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Weather is unavailable.");
      }
      const json = await response.json();
      const code = Number(json?.current?.weather_code ?? 0);
      return {
        temperature: Number(json?.current?.temperature_2m ?? 0),
        wind: Number(json?.current?.wind_speed_10m ?? 0),
        humidity: Number(json?.current?.relative_humidity_2m ?? 0),
        code,
        label: weatherLabel(code)
      };
    },
    staleTime: 30 * 60 * 1000,
    retry: 1
  });
}
