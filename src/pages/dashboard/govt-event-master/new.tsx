import { useEffect } from 'react';
import { GovtEventCreateView } from '../../../section/nabha-management/servey-master/view';

export default function CreateGovtEventPage() {
  useEffect(() => {
    document.title = "RuralSpark: Create New Government Event ";
  }, []);

  return <GovtEventCreateView />;
}