import { mockId } from "@/pages/designer/utils";


export function ProFormGroupItemSchema({ children, props, id }: any) {
  return {
    componentName: "ProFormGroupItem",
    title: "表单组项",
    id,
    props: {
      _id: mockId(),
      ...props,
    },
    children
  }
};


export default function ProFormGroupSchema({ children, props, id }: any) {
  return {
    componentName: "ProFormGroup",
    title: "表单组",
    id,
    props: {
      primaryKey: "businessId",
      "sourceType": "dataTable",
      ...props,
    },
    children
  }
};



