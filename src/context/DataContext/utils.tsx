import axios from "axios";
import { ClassesById, ClassMeta, ContentById, ContentMeta } from "./types";
import { useAuthContext } from "../AuthContext/AuthContext";

export const fetchClasses = async (
  setClassesById: React.Dispatch<React.SetStateAction<ClassesById>>,
  setClasses: React.Dispatch<React.SetStateAction<ClassMeta[]>>,
  access_token: string | undefined
) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_API}/classes`,
      {
        headers: {
          Authorization: access_token ? `Bearer ${access_token}` : "",
        },
      }
    );
    const data: ClassMeta[] = res.data;
    setClasses(res.data);

    setClassesById(
      data.reduce<ClassesById>((acc, cls) => {
        acc[cls.id] = cls;
        return acc;
      }, {})
    );
  } catch (e) {
    console.log("error adding class");
  }
};

export const fetchContent = async (
  classId: string,
  setContentById: React.Dispatch<React.SetStateAction<ContentById>>,
  access_token: string | undefined
) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_API}/content/${classId}`,
      {
        headers: {
          Authorization: access_token ? `Bearer ${access_token}` : "",
        },
      }
    );
    const data = res.data.map((item: ContentMeta) => ({
      ...item,
      last_used_at: item.last_used_at,
    }));

    setContentById((prev) => ({
      ...prev,
      [classId]: data,
    }));
  } catch (e) {
    console.log("Error fetching content");
  }
};
