export default function CardSchema({ props, children, id }: any) {
  return {
    "componentName": "ProCard",
    id,
    "props": {
      "hasDivider": false,
      "loading": false,
      "bodyPadding": "",
      "isFillContainer": true,
      ...props
    },
    children
  }
}
