import { useEffect } from "react";
import InstituteEventListView from "../../../section/Institute-management/institure-serveys/view/institute-event-list-view";

export default function InstituteEventListPage() {
    useEffect(() => {
        document.title = "RuralSpark: Institute Event List ";
    }, []);

    return <InstituteEventListView />;
}