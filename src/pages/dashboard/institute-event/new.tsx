import { useEffect } from "react";
import { InstituteEventCreateView } from "../../../section/Institute-management/institure-serveys/view";

export default function CreateInstituteEventPage() {
    useEffect(() => {
        document.title = "RuralSPark: Create New Institute Event ";
    }, []);

    return <InstituteEventCreateView />;
}