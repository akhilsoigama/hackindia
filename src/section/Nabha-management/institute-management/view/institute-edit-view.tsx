import { IInstitute } from '../../../../types/Institute';
import InstituteNewEditForm from '../Institute-new-edit-from'

type InstituteEditViewProps = {
    currentData?: IInstitute | null;
};
export default function InstituteEditView({ currentData}: InstituteEditViewProps ) {
    return <InstituteNewEditForm currentData={currentData}/>
}

