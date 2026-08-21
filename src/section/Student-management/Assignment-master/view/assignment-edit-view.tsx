import { IAssignmentItem } from "../../../../types/assignment";
import AssignmentCreateNewEditForm from "../assignment-create-new-edit-form";

type AssignmentEditviewPorps = {
    currentData?: IAssignmentItem| null;
}

export default function AssignmentEditView({ currentData }: AssignmentEditviewPorps) {
    return <AssignmentCreateNewEditForm currentData={currentData}/>
}
