export const getActionsMapping = (actions: any[]) => {
  let mappings: { [key: string]: any } = {}

  actions?.forEach(action => {
    let actionName = action.type
    if (typeof actionName == 'string') mappings[actionName.toString()] = action
  })

  return mappings
}
