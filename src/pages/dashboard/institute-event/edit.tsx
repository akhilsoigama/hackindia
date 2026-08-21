import { useState, useEffect } from "react";
import { useParams } from "../../../hooks/useParams";
import { IInstituteEvent } from "../../../types/instituteEvent";
import { useInstituteEvent } from "../../../action/instituteEvent";
import { InstituteEventEditView } from "../../../section/Institute-management/institure-serveys/view";
import { Translated } from "../../../components/common/translator/translator";

export default function InstituteServeys() {
    const { id } = useParams()
    const InstituteServeyTitle = String(id);

    const { instituteEvent, instituteEventError, instituteEventLoading } = useInstituteEvent(Number(InstituteServeyTitle));
    const [data, setData] = useState<IInstituteEvent | null>(null)

    useEffect(() => {
        document.title = "Edit Institute Event";
    }, []);

    useEffect(() => {
        setData(instituteEvent || null);
    }, [instituteEvent, instituteEventError, instituteEventLoading]);

    if (instituteEventLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="ml-2"><Translated text="Loading Institute Event data..."/></span>
            </div>
        );
    }

    if (instituteEventError) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">
                    <Translated text={`Error loading Institute Event: ${instituteEventError.message}`}/>
                </div>
            </div>
        );
    }

    if (!instituteEventLoading && !instituteEvent) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">
                    <Translated text="Institute Servey not found"/>
                </div>
            </div>
        );
    }

    return <InstituteEventEditView currentData={data} />
};