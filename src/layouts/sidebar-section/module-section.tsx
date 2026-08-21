import NavigationLink from './nevigation-link';
import useTranslateWithAtom from '../../action/translate';
import { useEffect, useState } from 'react';
import SidebarSection from './sidebar-section';
import { FilteredModule, FilteredSidebarLink } from '../../types/sidebar';

// Translated component
const Translated = ({ text }: { text: string }) => {
  const { translateText, currentLanguage } = useTranslateWithAtom();
  const [translated, setTranslated] = useState<string>(text);

  useEffect(() => {
    let mounted = true;
    const doTranslate = async () => {
      if (!text) return;
      const result = await translateText(text);
      if (mounted && result) setTranslated(result);
    };
    doTranslate();
    return () => {
      mounted = false;
    };
  }, [text, currentLanguage, translateText]);

  return <>{translated}</>;
};

interface ModuleSectionProps {
  module: FilteredModule;
  moduleIndex: number;
  isSidebarExpanded: boolean;
  expandedLink: string | null;
  expandedSubLink: string | null;
  toggleLink: (to: string) => void;
  toggleSubLink: (to: string) => void;
  handleLinkClick: () => void;
  currentPath: string;
}

const ModuleSection = ({
  module,
  moduleIndex,
  isSidebarExpanded,
  expandedLink,
  expandedSubLink,
  toggleLink,
  toggleSubLink,
  handleLinkClick,
  currentPath
}: ModuleSectionProps) => {
  return (
    <SidebarSection
      title={<Translated text={module.moduleName} />}
      isSidebarExpanded={isSidebarExpanded}
    >
      {module.links.map((link: FilteredSidebarLink, linkIndex: number) => (
        <NavigationLink
          key={link.label}
          link={link}
          moduleIndex={moduleIndex}
          linkIndex={linkIndex}
          isSidebarExpanded={isSidebarExpanded}
          expandedLink={expandedLink}
          expandedSubLink={expandedSubLink}
          toggleLink={toggleLink}
          toggleSubLink={toggleSubLink}
          handleLinkClick={handleLinkClick}
          currentPath={currentPath}
        />
      ))}
    </SidebarSection>
  );
};

export default ModuleSection;