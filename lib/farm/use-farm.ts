"use client";

import { useEffect, useState } from "react";
import {
  AVAILABLE_FARMS,
  DEFAULT_FARM,
  FARM_PROFILE_EVENT,
  readActiveFarm,
  writeActiveFarm,
  type FarmProfile
} from "./profile";

export function useFarm() {
  const [farm, setFarm] = useState<FarmProfile>(DEFAULT_FARM);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFarm(readActiveFarm());
    setReady(true);

    function sync() {
      setFarm(readActiveFarm());
    }

    window.addEventListener(FARM_PROFILE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FARM_PROFILE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function selectFarm(id: string) {
    const next = AVAILABLE_FARMS.find((item) => item.id === id);
    if (!next) return;
    const current = readActiveFarm();
    writeActiveFarm({
      ...next,
      name: current.id === next.id ? current.name : next.name,
      location: current.id === next.id ? current.location : next.location
    });
  }

  function updateFarm(patch: Partial<FarmProfile>) {
    writeActiveFarm({ ...readActiveFarm(), ...patch });
  }

  return { farm, ready, farms: AVAILABLE_FARMS, selectFarm, updateFarm };
}
