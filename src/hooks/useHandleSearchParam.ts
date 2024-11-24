import { useSearchParams } from "react-router-dom";

type UseHandleSearchParamReturn = {
  hasParam: boolean;
  addParam: () => void;
  setParam: (newValue: string) => void;
  removeParam: () => void;
  currentValue: string | null;
};

export const useHandleSearchParam = (
  param: string,
  value: string | undefined = "true",
): UseHandleSearchParamReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  const hasParam = searchParams.has(param);
  const currentValue = searchParams.get(param);

  const addParam = () => {
    if (!hasParam) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(param, value);
      setSearchParams(newSearchParams);
    }
  };

  const setParam = (newValue: string) => {
    if (param) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(param, newValue);
      setSearchParams(newSearchParams);
    }
  };

  const removeParam = () => {
    if (hasParam) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete(param);
      setSearchParams(newSearchParams);
    }
  };

  return {
    hasParam,
    addParam,
    setParam,
    removeParam,
    currentValue,
  };
};
