import { IGovtEvent } from '../../../../types/govtEvent'
import GovtEventNewEditForm from '../govt-event-new-edit-form';

type GovernmentEventEditViewProps = {
  currentData: IGovtEvent | null
}

const GovtEventEditView = ({ currentData }: GovernmentEventEditViewProps) => {
  return <GovtEventNewEditForm currentData={currentData} />
}

export default GovtEventEditView

