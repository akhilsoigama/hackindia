// src/components/materials/materials-new-edit-form.tsx
import { ILecture } from "../../../../types/material";
import MaterialNewEditForm from "../materials-new-edit-form";

type MaterialNewEditviewProps = {
    currentData?: ILecture | undefined;
};

export default function MaterialNewEditview({ currentData }: MaterialNewEditviewProps) {
    return <MaterialNewEditForm currentData={currentData}/>
}
