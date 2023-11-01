import type { CommonParamType } from '@/types/common';
import type { IPublicTypeProjectSchema } from '@alilc/lowcode-types';
import {
  material,
  project
} from '@alilc/lowcode-engine';
import {
  filterPackages,
  injectAssets
} from '@alilc/lowcode-plugin-inject'
import {
  message,
  Modal
} from 'antd';
import { IPublicEnumTransformStage } from '@alilc/lowcode-types';
import schemaApi from "@/services/schemaApi";
import localSchema from '../../../public/schema.json'
import { TerminalType } from '@/types/common';
import { Constant } from '@/constant';
import {
  getAppId,
  getQueries,
  getUrlParms
} from '@/utils/utils';
import { schemaParser } from "@/pages/designer/print/SchemaParser";
import businessId from "@/pages/appinfo/rule/BusinessId";

interface localesType {
  label: string,
  value: string | {
    label: string,
    value: string
  }
}

// 组装国际化数据
export function parseSchameLocales(val?: localesType[]) {
  if (val) {
    if (Array.isArray(val) && val.length > 0) {
      const obj = {}
      val.forEach(item => {
        if (Object.prototype.toString.call(item) === "[object Object]") {
          // @ts-ignore
          obj[item.value.value] = item.label
        } else {
          // @ts-ignore
          obj[item.value] = item.label
        }
      })
      return obj
    }
    return { [localStorage.getItem(Constant.LANG_STORAGE) as string]: val }
  }
  return ""
}

/**
 * 加载最新组件库版本
 */
export const loadLatestMaterials = (isBeta?: boolean) => {

  const config = {
    title: '加载最新版本组件库',
    content: '如果需要使用最新版本组件库，点击确定。保存页面后，新功能生效。更新后需要回归测试页面相关功能。',
    onOk: async () => {
      const assets = await schemaApi.getAssets(isBeta) || {};
      const injectedAssets = await injectAssets(assets);
      await material.setAssets(injectedAssets);
      material?.onChangeAssets(() => {
        message.success('加载成功');
      });
      // material.loadIncrementalAssets(assets.packages)
    }
  };
  Modal.confirm(config)
}
/**
 * 加载mobile最新组件库版本
 */
export const loadMobileLatestMaterials = () => {
  const config = {
    title: '加载最新版本组件库',
    content: '如果需要使用最新版本组件库，点击确定。保存页面后，新功能生效。更新后需要回归测试页面相关功能。',
    onOk: async () => {
      const assets = await schemaApi.getMobileAssets() || {};
      const injectedAssets = await injectAssets(assets);
      await material.setAssets(injectedAssets);
      material?.onChangeAssets(() => {
        message.success('加载成功');
      });
      // material.loadIncrementalAssets(assets.packages)
    }
  };
  Modal.confirm(config)
}

export const loadIncrementalAssets = () => {
  material?.onChangeAssets(() => {
    message.success('[MCBreadcrumb] 物料加载成功');
  });

  // material.loadIncrementalAssets({
  //   packages: [
  //     {
  //       title: 'MCBreadcrumb',
  //       package: 'mc-breadcrumb',
  //       version: '1.0.0',
  //       urls: [
  //         'https://unpkg.alibaba-inc.com/mc-breadcrumb@1.0.0/dist/MCBreadcrumb.js',
  //         'https://unpkg.alibaba-inc.com/mc-breadcrumb@1.0.0/dist/MCBreadcrumb.css',
  //       ],
  //       library: 'MCBreadcrumb',
  //     },
  //   ],
  //   components: [
  //     {
  //       componentName: 'MCBreadcrumb',
  //       title: 'MCBreadcrumb',
  //       docUrl: '',
  //       screenshot: '',
  //       npm: {
  //         package: 'mc-breadcrumb',
  //         version: '1.0.0',
  //         exportName: 'MCBreadcrumb',
  //         main: 'lib/index.js',
  //         destructuring: false,
  //         subName: '',
  //       },
  //       props: [
  //         {
  //           name: 'prefix',
  //           propType: 'string',
  //           description: '样式类名的品牌前缀',
  //           defaultValue: 'next-',
  //         },
  //         {
  //           name: 'title',
  //           propType: 'string',
  //           description: '标题',
  //           defaultValue: 'next-',
  //         },
  //         {
  //           name: 'rtl',
  //           propType: 'bool',
  //         },
  //         {
  //           name: 'children',
  //           propType: {
  //             type: 'instanceOf',
  //             value: 'node',
  //           },
  //           description: '面包屑子节点，需传入 Breadcrumb.Item',
  //         },
  //         {
  //           name: 'maxNode',
  //           propType: {
  //             type: 'oneOfType',
  //             value: [
  //               'number',
  //               {
  //                 type: 'oneOf',
  //                 value: ['auto'],
  //               },
  //             ],
  //           },
  //           description:
  //             '面包屑最多显示个数，超出部分会被隐藏, 设置为 auto 会自动根据父元素的宽度适配。',
  //           defaultValue: 100,
  //         },
  //         {
  //           name: 'separator',
  //           propType: {
  //             type: 'instanceOf',
  //             value: 'node',
  //           },
  //           description: '分隔符，可以是文本或 Icon',
  //         },
  //         {
  //           name: 'component',
  //           propType: {
  //             type: 'oneOfType',
  //             value: ['string', 'func'],
  //           },
  //           description: '设置标签类型',
  //           defaultValue: 'nav',
  //         },
  //         {
  //           name: 'className',
  //           propType: 'any',
  //         },
  //         {
  //           name: 'style',
  //           propType: 'object',
  //         },
  //       ],
  //       configure: {
  //         component: {
  //           isContainer: true,
  //           isModel: true,
  //           rootSelector: 'div.MCBreadcrumb',
  //         },
  //       },
  //     },
  //   ],
  //
  //   componentList: [
  //     {
  //       title: '常用',
  //       icon: '',
  //       children: [
  //         {
  //           componentName: 'MCBreadcrumb',
  //           title: 'MC面包屑',
  //           icon: '',
  //           package: 'mc-breadcrumb',
  //           library: 'MCBreadcrumb',
  //           snippets: [
  //             {
  //               title: 'MC面包屑',
  //               screenshot:
  //                 'https://alifd.oss-cn-hangzhou.aliyuncs.com/fusion-cool/icons/icon-light/ic_light_breadcrumb.png',
  //               schema: {
  //                 componentName: 'MCBreadcrumb',
  //                 props: {
  //                   title: '物料中心',
  //                   prefix: 'next-',
  //                   maxNode: 100,
  //                 },
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // });
};
export const preview = (scenarioName: string = 'index', device?: string, printId?: string) => {
  if (scenarioName === 'print') {
    return savePrintSchema(scenarioName, printId)
  }
  return saveSchema(scenarioName).then((res) => {
    if (res.success) {
      setTimeout(() => {
        const search = location.search ? `${location.search}&scenarioName=${scenarioName}` : `?scenarioName=${scenarioName}`;
        if (device) {
          window.open(`/mobile-preview.html${search}`);
          return
        }
        window.open(`/preview.html${search}`);
      }, 100);
    }
  });
};

export const resetSchema = async (scenarioName: string = 'pc') => {
  try {
    await new Promise<void>((resolve, reject) => {
      Modal.confirm({
        content: '确定要重置吗？您所有的修改都将消失！',
        onOk: () => {
          resolve();
        },
        onCancel: () => {
          reject()
        },
      })
    })
  } catch (err) {
    return
  }
  let tree = [
    {
      componentName: 'Page',
      fileName: 'sample'
    }
  ];
  if (scenarioName === "print") {
    const res = await schemaParser(true);
    tree = res?.schema?.componentsTree?.[0]
  }
  // 除了「综合场景」，其他场景没有默认 schema.json，这里构造空页面
  if (scenarioName !== 'index') {
    window.localStorage.setItem(
      getLSName(scenarioName),
      JSON.stringify({
        componentsTree: tree,
        componentsMap: material.componentsMap,
        version: '1.0.0',
        i18n: {},
      })
    );
    project.getCurrentDocument()?.importSchema(tree as any);
    project.simulatorHost?.rerender();
    message.success('成功重置页面');
    return;
  }

  let schema;
  try {
    schema = localSchema
  } catch (err) {
    schema = {
      componentName: 'Page',
      fileName: 'sample',
    }
  }

  window.localStorage.setItem(
    getLSName('index'),
    JSON.stringify({
      componentsTree: [schema],
      componentsMap: material.componentsMap,
      version: '1.0.0',
      i18n: {},
    })
  );

  project.getCurrentDocument()?.importSchema(schema as any);
  project.simulatorHost?.rerender();
  message.success('成功重置页面');
}

const getLSName = (scenarioName: string, ns: string = 'projectSchema') => `${scenarioName}:${ns}`;

export const getProjectSchemaFromLocalStorage = (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  return JSON.parse(window.localStorage.getItem(getLSName(scenarioName)) || '{}');
}

const setProjectSchemaToLocalStorage = (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  window.localStorage.setItem(
    getLSName(scenarioName),
    JSON.stringify(project.exportSchema(IPublicEnumTransformStage.Save))
  );
}

const setPackgesToLocalStorage = async (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  const packages = await filterPackages(material.getAssets().packages);
  window.localStorage.setItem(
    getLSName(scenarioName, 'packages'),
    JSON.stringify(packages),
  );
  return packages;
}

export const getPackagesFromLocalStorage = (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  return JSON.parse(window.localStorage.getItem(getLSName(scenarioName, 'packages')) || '{}');
}

export const getPageSchema = async (scenarioName: string = 'index') => {
  // const pageSchema = getProjectSchemaFromLocalStorage(scenarioName).componentsTree?.[0]

  const pageSchema = await schemaApi.getSchema().then((res) => {
    // setProjectSchemaToLocalStorage(scenarioName);
    return res?.schema?.componentsTree?.[0]
  })
  if (pageSchema) {
    return pageSchema;
  }

  return Promise.resolve(localSchema)
  // return await request('/schema.json');
};

export const getAssets = async (terminalType?: TerminalType) => {
  return terminalType === TerminalType.App ? schemaApi.getMobileAssets() : schemaApi.getAssets();
}

const getSchemaAction = (id: string, type: 'disable' | 'hidden') => {
  const userInfo = JSON.parse(localStorage.getItem(Constant.USER_STORAGE) as string)
  const pageId = getUrlParms('pageId')
  return userInfo?.pageResourceMap?.[pageId]?.[id]?.[type] || false
}

const parseSchema = (newSchema: IPublicTypeProjectSchema, children: any, obj: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  children && children.length > 0 && children.forEach((item: CommonParamType) => {
    const row: CommonParamType = {
      label: item.props.tempName,
      value: item.id,
      child: []
    }
    const btnRow = JSON.parse(JSON.stringify(row))
    // 表单
    if (item.componentName === 'ProForm') {
      item.children?.forEach((it: CommonParamType) => {
        if (it.props.formItemProps.startAuth) {
          row.child.push({
            label: it.props.formItemProps.label,
            value: it.props.formItemProps.name
          })
          it.props.disabled = getSchemaAction(it.props.formItemProps.name, 'disable')
          it.props.formItemProps.hidden = getSchemaAction(it.props.formItemProps.name, 'hidden')
        }
      })
      // 按钮
      if (item.props.operations && Array.isArray(item.props.operations) && item.props.operations.length > 0) {
        item.props.operations.forEach((str: any) => {
          if (str.startAuth) {
            btnRow.child.push({
              label: str.content,
              value: str.id
            })
            str.disabled = getSchemaAction(str.id, 'disable')
            str.hidden = getSchemaAction(str.id, 'hidden')
          }
        })
      }
      if (row.child.length > 0) {
        obj.FormField.push(row)
      }
      if (btnRow.child.length > 0) {
        obj.Button.push(btnRow)
      }
    } else if (item.componentName === 'LceTableList') {
      if (item.props.columns && item.props.columns.length > 0) {
        item.props.columns.forEach((ss: CommonParamType) => {
          if (ss.startAuth) {
            row.child.push({
              label: ss.title,
              value: ss.dataIndex
            })
            ss.hidden = getSchemaAction(ss.dataIndex, 'hidden')
          }
        })
      }
      if (item.props.actionColumnButtons && item.props.actionColumnButtons.dataSource && item.props.actionColumnButtons.dataSource.length > 0) {
        item.props.actionColumnButtons.dataSource.forEach((bb: CommonParamType) => {
          if (bb.startAuth) {
            btnRow.child.push({
              label: bb.children,
              value: bb.id
            })
            bb.hidden = getSchemaAction(bb.id, 'hidden')
            bb.disabled = getSchemaAction(bb.id, 'disable')
          }
        })
      }
      if (item.props.actionBarButtons && item.props.actionBarButtons.dataSource && item.props.actionBarButtons.dataSource.length > 0) {
        item.props.actionBarButtons.dataSource.forEach((bb: CommonParamType) => {
          if (bb.startAuth) {
            btnRow.child.push({
              label: bb.children,
              value: bb.id
            })
            bb.hidden = getSchemaAction(bb.id, 'hidden')
            bb.disabled = getSchemaAction(bb.id, 'disable')
          }
        })
      }
      if (row.child.length > 0) {
        obj.TableField.push(row)
      }
      if (btnRow.child.length > 0) {
        obj.Button.push(btnRow)
      }
    } else {
      parseSchema(newSchema, item.children, obj)
    }
  })
}

// 组装权限的schame
const getAuthSchema = (schema: IPublicTypeProjectSchema) => {
  const newSchema = JSON.parse(JSON.stringify(schema));
  const obj: CommonParamType = {
    FormField: [],
    Button: [],
    TableField: []
  }
  parseSchema(newSchema, newSchema.componentsTree[0].children, obj)
  return {
    obj,
    newSchema
  }
}

const renderEditTableFields = (item: any) => {
  // 兼容老版本代码
  if (item?.props?.tableProps?.columns) {
    return item?.props?.tableProps?.columns?.map(it => {
      return {
        id: it.dataIndex,
        // name: it.title,
        name: parseSchameLocales(it.languages || it.title),
        type: it.formatType
      }
    })
  }
  // 新版本代码
  return item?.children?.[0]?.props.columns?.map(it => {
    return {
      id: it.dataIndex,
      // name: it.title,
      name: parseSchameLocales(it.languages || it.title),
      type: it.formatType
    }
  })
}

const getDataStructure = (data: any, anchorForm: any) => {
  data.datasourceId = (anchorForm?.props?.database as any)?.value
  data.tableName = (anchorForm?.props?.tableModel as any)?.value
  data.fields = anchorForm.children?.flatMap((chidForm: any) => {
    return chidForm.children?.reduce((fields: any, formItem: any) => {
      if (formItem.componentName === "FormEditTable") {
        if (formItem.props?.formItemProps?.name) {
          const arr = formItem.props?.columns.map((item: any) => {
            return {
              id: item.dataIndex,
              name: parseSchameLocales(item.languages || item.title),
              // name: item.title,
              type: item.formatType
            }
          })
          fields.push({
            id: formItem.props?.formItemProps?.name,
            // name: formItem.props?.formItemProps?.label || chidForm?.props?.anchorItemProps?.label,
            name: parseSchameLocales(
              formItem.props?.formItemProps?.languages || formItem.props?.formItemProps?.label || chidForm?.props?.anchorItemProps?.label),
            type: formItem.componentName,
            ["fields"]: arr
          })
        }
      } else if (formItem.componentName === "FormTabTableContainer") {
        formItem.children.forEach(item => {
          const obj = {
            id: item?.props?.tableProps?.tableModel?.value || item?.children?.[0]?.props.formItemProps?.name || item?.props?.tabKey,
            // name: item?.props?.title,
            name: parseSchameLocales(item?.props?.title),
            type: item?.componentName,
            fields: renderEditTableFields(item)
          }
          fields.push(obj)
        })
      } else {
        if (formItem.props?.formItemProps?.name) {
          fields.push({
            id: formItem.props?.formItemProps?.name,
            // name: formItem.props?.formItemProps?.label || chidForm?.props?.anchorItemProps?.label,
            name: parseSchameLocales(
              formItem.props?.formItemProps?.languages || formItem.props?.formItemProps.label || chidForm?.props?.anchorItemProps?.label),
            type: formItem.componentName
          })
        }
      }

      // if (formItem.props?.formItemProps?.name) {

      // }
      return fields
    }, [])
  })
  return data
}

// eslint-disable-next-line @typescript-eslint/no-shadow
export async function savePrintSchema(scenarioName: string = 'pc', businessId?: string) {
  setProjectSchemaToLocalStorage(scenarioName);
  const packages = await setPackgesToLocalStorage(scenarioName) || [];
  const schema = project.exportSchema(IPublicEnumTransformStage.Save);
  return schemaApi.savePrintTemplate({
    pageId: getQueries("pageId"),
    appId: getAppId(),
    businessId,
    schemaJson: JSON.stringify(schema, null, 2),
    packageJson: JSON.stringify(packages, null, 2)
  }).then(res => {
    if (res?.success) {
      message.success('保存成功')
    }
    return res
  })
}

export const saveSchema = async (scenarioName: string = 'pc') => {
  setProjectSchemaToLocalStorage(scenarioName);
  const packages = await setPackgesToLocalStorage(scenarioName) || [];
  const schema = project.exportSchema(IPublicEnumTransformStage.Save)

  const data = {
    datasourceId: '',
    tableName: '',
    fields: [],
  }

  const formPage = (schema?.componentsTree[0]?.children as any)
    ?.find((component: any) => component.componentName === 'LceProcessForm');
  if (formPage) {
    data.datasourceId = (formPage?.props?.database as any)?.value;
    formPage.children?.forEach((card: any) => {
      card.children?.forEach((form: any) => {
        if (form.componentName === 'ProForm') {
          data.tableName = (form?.props?.tableModel as any)?.value;
          data.fields = form.children?.reduce((fields: any, item: any) => {
            if (item.componentName === "FormEditTable") {
              if (item.props?.formItemProps?.name) {
                const arr = item.props?.columns.map(item => {
                  return {
                    id: item.dataIndex,
                    // name: item.title,
                    name: parseSchameLocales(item.languages || item.title),
                    type: item.formatType
                  }
                })
                fields.push({
                  id: item.props?.formItemProps?.name,
                  // name: item.props?.formItemProps?.label,
                  name: parseSchameLocales(item.props?.formItemProps?.languages || item.props?.formItemProps?.label),
                  type: item.componentName,
                  ["fields"]: arr
                })
              }
              return fields
            } else {
              if (item.props?.formItemProps?.name) {
                fields.push({
                  id: item.props?.formItemProps?.name,
                  name: parseSchameLocales(item.props?.formItemProps?.languages || item.props?.formItemProps?.label),
                  // name: item.props?.formItemProps?.label,
                  type: item.componentName
                })
              }
              return fields
            }
          }, [])
        } else if (form.componentName === 'AnchorForm') {
          getDataStructure(data, form)
        }
      })
    })
    try {
      data.fields.reduce((map: any, field: any) => {
        if (map[field.id]) {
          console.warn("字段的表单标识重复", map[field.id])
          throw new Error(
            `【${JSON.stringify(map[field.id].name)}】字段与【${JSON.stringify(field.name)}】字段的表单标识重复`)
        }
        map[field.id] = field
        return map
      }, {})
    } catch (e: any) {
      return message.error(e.message)
    }
  }
  const {
    obj,
    newSchema
  } = getAuthSchema(schema)
  return schemaApi.saveSchema({
    packages,
    schema: newSchema,
    pageStructure: {
      ProcessForm: data,
      AuthComponent: obj
    }
  }).then(res => {
    if (res.success) {
      message.success('保存成功')
    }
    return res
  })
};

// function request(
//   dataAPI: string,
//   method = 'GET',
//   data?: object | string,
//   headers?: object,
//   otherProps?: any,
// ): Promise<any> {
//   return new Promise((resolve, reject): void => {
//     if (otherProps && otherProps.timeout) {
//       setTimeout((): void => {
//         reject(new Error('timeout'));
//       }, otherProps.timeout);
//     }
//     fetch(dataAPI, {
//       method,
//       credentials: 'include',
//       headers,
//       body: data,
//       ...otherProps,
//     })
//       .then((response: Response): any => {
//         switch (response.status) {
//           case 200:
//           case 201:
//           case 202:
//             return response.json();
//           case 204:
//             if (method === 'DELETE') {
//               return {
//                 success: true,
//               };
//             } else {
//               return {
//                 __success: false,
//                 code: response.status,
//               };
//             }
//           case 400:
//           case 401:
//           case 403:
//           case 404:
//           case 406:
//           case 410:
//           case 422:
//           case 500:
//             return response
//               .json()
//               .then((res: object): any => {
//                 return {
//                   __success: false,
//                   code: response.status,
//                   data: res,
//                 };
//               })
//               .catch((): object => {
//                 return {
//                   __success: false,
//                   code: response.status,
//                 };
//               });
//           default:
//             return null;
//         }
//       })
//       .then((json: any): void => {
//         if (json && json.__success !== false) {
//           resolve(json);
//         } else {
//           delete json.__success;
//           reject(json);
//         }
//       })
//       .catch((err: Error): void => {
//         reject(err);
//       });
//   });
// }
