import { useEffect } from 'react';
import GovtEventListView from '../../../section/nabha-management/servey-master/view/govt-event-list-view';

export default function GovtEventListPage() {
  useEffect(() => {
    document.title = "RuralSpark: All Govt Event List";
  }, []);

  return <GovtEventListView />;
}