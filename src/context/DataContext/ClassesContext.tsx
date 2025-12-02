// ClassesContext.tsx

import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  ClassesById,
  ClassMeta,
  ClassesState,
  DataProviderProps,
} from "./types";
import { fetchClasses } from "./utils";
import { useAuthContext } from "../AuthContext/AuthContext";
import { useShallowMemo } from "../../hooks/useShallowMemo";

export const ClassesContext = createContext<ClassesState | null>(null);

export const useClassesContext = (): ClassesState => {
  const ctx = useContext(ClassesContext);
  if (!ctx) {
    throw new Error("useClassesContext must be within ClassesProvider");
  }
  return ctx;
};

export const ClassesProvider = ({ children }: DataProviderProps) => {
  const [classes, setClasses] = useState<ClassMeta[]>([]);
  const [classesById, setClassesById] = useState<ClassesById>({});
  const [classesLoading, setClassesLoading] = useState(false);
  const [classesError, setClassesError] = useState("");
  const classesFetched = useRef(false);
  const auth = useAuthContext();

  useEffect(() => {
    if (!auth.loading && auth.session && !classesFetched.current) {
      classesFetched.current = true;
      callClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.loading, auth.session?.user?.id]);

  const callClasses = async () => {
    if (!auth.session?.access_token) {
      setClassesError("Not authenticated");
      return;
    }

    setClassesError("");
    setClassesLoading(true);

    try {
      await fetchClasses(setClassesById, setClasses, auth.session.access_token);
    } catch (err: any) {
      console.error("Error in fetchClasses", err);

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        await auth.handleLogout();
        return;
      }

      setClassesError("Error getting classes");
    } finally {
      setClassesLoading(false);
    }
  };

  const AddClass = async (name: string) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/classes`,
        { name },
        {
          headers: {
            Authorization: auth.session?.access_token
              ? `Bearer ${auth.session.access_token}`
              : "",
          },
        }
      );
      const classData: ClassMeta = res.data;

      setClasses((prev) => [...prev, classData]);
      setClassesById((prev) => ({ ...prev, [classData.id]: classData }));
    } catch (e) {
      throw new Error("Error Adding New Class");
    }
  };

  const value = useShallowMemo<ClassesState>({
    classes,
    classesById,
    callClasses,
    AddClass,
    classesLoading,
    classesError,
  });

  return (
    <ClassesContext.Provider value={value}>{children}</ClassesContext.Provider>
  );
};
