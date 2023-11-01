
export const defaultPCComponentProps = {
  package: "dtt-comps",
  destructuring: true,
  subName: "",
  exportName: "",
  componentName: "",
  main: "src/index.js",
}

export const defaultAPPComponentProps = {
  package: "dtt-comps-app",
  destructuring: true,
  subName: "",
  exportName: "",
  componentName: "",
  main: "src/index.js",
}


export const JSSlotValueSchame = (value: any[], config: {
  title?: string,
  name?: string,
  params?: any,
  id?: string,
}) => {
  return {
    "type": "JSSlot",
    "params": config.params,
    "value": value,
    "title": config.title || "插槽",
    "name": config.name,
    "id": config.id
  }
}