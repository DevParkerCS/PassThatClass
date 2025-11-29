import { useMemo } from "react";

export function useShallowMemo<T extends {}>(memoObj: T) {
  const depArray = useMemo(
    () =>
      Object.entries(memoObj)
        .sort(([aKey], [bKey]) =>
          aKey.toLowerCase().localeCompare(bKey.toLowerCase())
        )
        .map(([, value]) => value),
    [memoObj]
  );

  return useMemo(() => memoObj, depArray);
}
