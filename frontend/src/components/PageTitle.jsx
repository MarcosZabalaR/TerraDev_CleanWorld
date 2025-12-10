import React from 'react';
import { Helmet } from 'react-helmet-async';

const PageTitle = ({ title }) => {
  const appName = "CleanWorld";
  const fullTitle = `${title} | ${appName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
};

export default PageTitle;