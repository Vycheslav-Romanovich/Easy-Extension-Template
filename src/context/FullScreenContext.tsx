import React, { useContext } from 'react';

type FullScreenContext = {
  isFullScreen: boolean;
};

export const FullScreenContext = React.createContext<{
    isFullScreen: boolean;
}>({ isFullScreen: false });

export const useFullScreenContex = (): FullScreenContext => useContext(FullScreenContext);
