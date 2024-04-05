import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useSelector } from 'react-redux'
import { RootState } from '../pages/background/store/reducers'

import { ReactNode } from '../constants/types';
import { useEffect } from 'react';

type LanguageContext = {
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
};

const LanguageContext = React.createContext<{
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
}>({ locale: 'en', setLocale: () => null });

export const useLanguageContext = (): LanguageContext => useContext(LanguageContext);

export const LanguageContextProvider: React.FC<ReactNode> = ({ children }) => {
  const interfaceLang = useSelector<RootState, string>((state) => state.settings.interfaceLang)
  const [locale, setLocale] = useState(interfaceLang)

  useEffect(() => {
    setLocale(interfaceLang)
  }, [interfaceLang])

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>
  );
};
