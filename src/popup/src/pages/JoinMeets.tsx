/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';


export const JoinMeets: React.FC = () => {

  const wrapperStyle: SxStyleProp = {
    variant: 'bodyWrapper',
    textAlign: 'center',
    color: 'text.primary',
  };

  return (
    <div sx={wrapperStyle}>
      Please join meets and re-open the popup.
    </div>
  );
};