import { useEffect } from "react";
import { MaterialCreateView } from "../../../section/Student-management/Materials-management/view";

export default function MaterialsCreatePage() {
  useEffect(() => {
    document.title = "RuralSpark: Create New Material ";
  }, []);

  return <MaterialCreateView />;
}