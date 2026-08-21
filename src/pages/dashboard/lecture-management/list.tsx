import { useEffect } from "react";
import { MaterialListView } from "../../../section/Student-management/Materials-management/view";

export default function MaterialListPage() {
  useEffect(() => {
    document.title = "RuralSpark: All Materials List";
  }, []);

  return <MaterialListView />;
}