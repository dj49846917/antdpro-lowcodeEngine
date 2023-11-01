export default function PageSchema({
  props,
  children,
  id
}: any) {
  return {
    componentName: "Page",
    title: "页面",
    props: { ...props },
    id,
    children
  }
}
