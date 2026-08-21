import { IInstituteEvent } from "../../../../types/instituteEvent"
import InstituteEventNewEditForm from "../institute-event-new-edit-from"

type InstituteEventEditViewForm = {
    currentData?: IInstituteEvent | null
}

const  InstituteEventEditView = ({ currentData }: InstituteEventEditViewForm ) => {
    return <InstituteEventNewEditForm currentData={currentData} />
}

export default InstituteEventEditView