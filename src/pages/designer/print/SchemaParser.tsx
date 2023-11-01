import _ from "lodash";
import schemaApi from "@/services/schemaApi";
import { getQueries } from "@/utils/utils";
import { FormItemType } from "@/pages/designer/constants";

const COMPS = {
  LceProcessForm: "LceProcessForm",
  AnchorForm: "AnchorForm",
  ProForm: "ProForm",
  LceTimeline: "LceTimeline",
}

const PRINT_COMPS_MAP = {
  ProForm: {
    componentName: "PrintProForm",
    title: "打印高级表单",
    props: {
      labelTextAlign: "right",
      labelAlign: "left",
      labelCol: {
        fixedSpan: 6
      },
    }
  },
  AnchorForm: {
    componentName: "PrintAnchorForm",
    title: "打印电梯表单"
  },
  ChildForm: {
    componentName: "PrintChildForm",
    title: "打印子表单"
  },
  FormTabTableItem: {
    componentName: "FormEditTable",
    title: "打印子表单"
  },
  LceTimeline: {
    componentName: "LceTimeline",
    title: "流程历史"
  },
}

//找到所有需要打印的组件
const PRINT_COMPONENTS = ["AnchorForm", "ProForm", "LceProcessForm"];
export const schemaParser = async (isRecover?: boolean) => {
  const templateRes = await schemaApi.getPrintTemplate({
    pageId: getQueries("pageId")
  });
  if (!isRecover && templateRes?.schemaJson) {
    try { return { schema: JSON.parse(templateRes.schemaJson), businessId: templateRes.businessId }} catch (e) {
      console.log("print template parse error>>>", {
        e,
        schemaJson: templateRes.schemaJson
      })
    }
  }
  const schemaRes = await schemaApi.getSchema(getQueries("pageId") as string);
  if (!schemaRes) {
    return null;
  }
  const schema = _.cloneDeep(schemaRes?.schema?.componentsTree?.[0]);
  let find: any;
  if (schema?.componentName !== "Page") {
    return null;
  }

  try {
    const findComp = (children: any, target: any) => {
      for (let i = 0; i < children.length; i++) {
        if (target.includes(children[i].componentName)) {
          find = children[i]
          break;
        }
        if (children[i].children?.length) {
          findComp(children[i].children, target)
        }
      }
    }
    findComp(schema.children, PRINT_COMPONENTS);
    if (!find) {
      return null;
    }
    let content;
    if (find.componentName === COMPS.LceProcessForm) {
      content = parseProcessForm(find);
    }
    if (!content) {
      return null;
    }

    const templateSchema = {
      methods: schema?.methods,
      componentName: 'Page',
      props: {
        hasPrint: true
      },
      children: [{
        "componentName": "PrintPageHeader",
        "id": "node_oclhbdioa92",
        "props": {
          "title": find.title || find.children[0].props.title,
          "position": {
            "marginTop": 20,
            "marginBottom": 20
          }
        },
        "docId": "doclhbdioa9",
        "title": "打印页头"
      }, ...content],
    };
    return { schema: { componentsTree: [templateSchema] }, businessId: templateRes?.businessId }
  } catch (e) {
    console.log("schema-parse-error>>>", e)
    return null
  }
}

function parseProcessForm(processForm: any) {
  const _children: any[] = [];
  processForm.children.forEach((card: any) => {
    let firstChild = Object.assign({}, card.children?.[0]);
    if (!firstChild) return;
    firstChild.props.title = card.props.title;
    if (PRINT_COMPS_MAP[firstChild.componentName]) {
      firstChild = {
        ...firstChild,
        ...PRINT_COMPS_MAP[firstChild.componentName]
      };
      paresAnchorForm(firstChild);
      _children.push(firstChild);
    }
  });
  return _children;
}

function paresAnchorForm(anchorFormProps: any) {
  if (anchorFormProps.componentName !== "PrintAnchorForm") {
    return;
  }
  const _children: any[] = [];
  anchorFormProps.children?.forEach((childForm: any) => {
    let child = Object.assign({}, childForm);
    if (PRINT_COMPS_MAP[child.componentName]) {
      child = {
        ...child,
        ...PRINT_COMPS_MAP[child.componentName]
      };
      const tables: any[] = [];
      child.children = child.children?.reduce((formItems: any, formItem: any) => {
        if (formItem.componentName === FormItemType.FormBusinessUpload) {
          //过滤掉文件上传
          return formItems;
        }
        if (formItem.componentName === 'FormTabTableContainer') {
          formItem.children.map((tab: any) => {
            tab.children?.forEach((table: any) => {
              tables.push({ ...table, props: {...table.props, title: tab.props.title} })
            })
          })
          return formItems;
        }
        formItems.push(formItem)
        return formItems;
      }, []);
      child.children = [...child.children, ...tables];
      _children.push(child);
    }
  });

  anchorFormProps.children = _children;
}
