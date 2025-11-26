import axios from "axios";
import { ClassesById, ClassMeta, ContentById, ContentMeta } from "./types";

export const fetchClasses = async (
  setClassesById: React.Dispatch<React.SetStateAction<ClassesById>>,
  setClasses: React.Dispatch<React.SetStateAction<ClassMeta[]>>
) => {
  try {
    const res = await axios.get("http://localhost:8000/classes");
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
  setContentById: React.Dispatch<React.SetStateAction<ContentById>>
) => {
  try {
    const res = await axios.get(`http://localhost:8000/content/${classId}`);
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
