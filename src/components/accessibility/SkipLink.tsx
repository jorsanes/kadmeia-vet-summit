
import React from 'react';
import { useTranslation } from 'react-i18next';

const SkipLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:no-underline"
    >
      {t('accessibility.skipToContent', 'Saltar al contenido principal')}
    </a>
  );
};

export default SkipLink;
