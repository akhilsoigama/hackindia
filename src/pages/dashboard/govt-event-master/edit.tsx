import { useEffect, useState } from "react";
import { useParams } from "../../../hooks/useParams";
import { GovtEventEditView } from "../../../section/nabha-management/servey-master/view";
import { useGetGovtEvent } from "../../../action/govtEvent";
import { IGovtEvent } from "../../../types/govtEvent";
import { Translated } from "../../../components/common/translator/translator";

export default function Page() {
    const { id } = useParams();
    const govtEventId = Number(id);

    const { govtEvent, govtEventError, govtEventLoading } = useGetGovtEvent(govtEventId);
    const [data, setData] = useState<IGovtEvent | null>(null);

    useEffect(() => {
        document.title = "Dashboard: Edit Government Event | Institute Management System";
    }, []);

    useEffect(() => {
        setData(govtEvent || null);
    }, [govtEvent, govtEventLoading, govtEventError]);

    if (govtEventLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="ml-2"><Translated text="Loading Government Event data..."/></span>
            </div>
        );
    }

    if (govtEventError) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">
                    <Translated text={`Error loading Government Event: ${govtEventError.message}`}/>
                </div>
            </div>
        );
    }

    if (!govtEvent && !govtEventLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">
                    <Translated text="Government Event not found"/>
                </div>
            </div>
        );
    }

    return <GovtEventEditView currentData={data} />;
}