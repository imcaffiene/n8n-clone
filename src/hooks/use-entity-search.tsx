"use client";

import { PAGINATION } from "@/config/constant";
import { useEffect, useState } from "react";

interface UseEntitySearchProps<
  T extends {
    search: string;
    page: number;
  }
> {
  params: T;
  setParams: (params: T) => void;
  debounceTime?: number;
}

export function useEntitySearch<
  T extends {
    search: string;
    page: number;
  }
>({ params, setParams, debounceTime = 500 }: UseEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") { //User cleared everything in search
      setParams({
        ...params,
        search: "", //Clear search
        page: PAGINATION.DEFAULT_PAGE //Reset to first page
      });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch, // Update URL with new search
          page: PAGINATION.DEFAULT_PAGE //Reset to first page
        });
      }
    }, debounceTime);

    return () => clearTimeout(timer);  //Cancel timer if user types again
  }, [localSearch, params, setParams, debounceTime]);

  useEffect(() => {
    setLocalSearch(params.search); //Instantly Sync local state with URL
  }, [params.search]);

  return {
    searchValue: localSearch, //Current search value
    onSearchChange: setLocalSearch //Update local search value
  };
}
