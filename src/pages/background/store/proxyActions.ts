import { setDarkMode, setLanguage } from './slices/settingsSlice'

export const getProxyActions = (actions: any[]) => {
  let proxyActions: { [key: string]: any } = {};

  actions?.forEach(action => {
    let actionName = action.type;
    if (typeof actionName === 'string') {
      const [slice, name] = actionName.split('/');
      if (!proxyActions[slice]) {
        proxyActions[slice] = {};
      }
      proxyActions[slice][name] = (payload: any) => {
        return {
          type: actionName,
          ...payload
        };
      };
    }
  });

  return proxyActions;
}

export const proxyActions = getProxyActions([setLanguage, setDarkMode])
