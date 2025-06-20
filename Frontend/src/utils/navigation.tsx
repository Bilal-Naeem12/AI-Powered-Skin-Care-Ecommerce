// src/utils/navigation.ts
import { NavigateFunction } from "react-router-dom";

let navigate: NavigateFunction | null = null;

export const setNavigator = (navFn: NavigateFunction) => {
  navigate = navFn;
};

export const goTo = (path: string) => {
  if (navigate) {
    navigate(path);
  } else {
    console.warn("Navigate function not set");
  }
};
