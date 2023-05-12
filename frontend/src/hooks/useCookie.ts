import { useCallback } from "react";

export const useCookie = () => {
  const separateCookies = useCallback((name: string) => {
    console.log("separateCookiesが走っています。");
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log("value:", value);
    console.log("part:", parts);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  }, []);

  return { separateCookies };
};
