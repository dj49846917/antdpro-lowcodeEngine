

import FormItemCreator from "@/pages/designer/template/app/form-items";
import { ActionType, CellType, FormItemType } from "../../constants";
import { mockId, nextId } from "../../utils";
import type { AssetsType } from "@/services/schemaApi";
import { BaseCellSlotProp } from "./page-list";
import { createSlotProp } from "./common";


interface SchemaComponent {
    componentName: string;
    id: string;
    props: any;
    children: SchemaComponent[];
    [key: string]: any
}


interface TransformConfig {
    docId: string;
    seqId: { seqId: number };
    [key: string]: any
}


//老页面转移动端
function processFormTransform(processForm: SchemaComponent, config: TransformConfig): SchemaComponent {
    processForm.componentName = "ProcessForm";
    const processButtons: any = [];
    processForm.children.forEach((card: any) => {
        if (card.componentName === "LceActionBar") {
            card.children.forEach((button: any) => {
                processButtons.push({
                    action: ActionType[button.props.actionType],
                    title: button.props.name,
                    ...button.props,
                    page: undefined
                })
            })
        }
    });
    processForm.children = transformComponents(processForm.children, config);
    processForm.props = {
        ...processForm.props,
        processButtons
    };
    return processForm!;
}

function createColFields(table: any, id: string) {
    return table.props.columns?.map((col: any) => {
        const formItemCreator = FormItemCreator[CellType[col.formatType]] || FormItemCreator.FormInput;
        const colSchema = formItemCreator({
            compProps: { ...col, ...col.compProps },
            formItemProps: {
                primaryKey: mockId(),
                ...col.formItemProps,
                name: col.dataIndex,
                label: col.title
            }
        });
        colSchema.schema.props.listItemProps = {
            ...col,
            ...col.compProps,
            compProps: undefined,
            formItemProps: undefined
        };
        colSchema.schema.props.compProps = undefined
        return {
            ...colSchema.schema,
            id
        };
    });
}

function parseListButton(table: any) {
    table.props.cellButtons = [...(table.props.actionColumnButtons?.dataSource || [])];
    table.props.listButtons = [...(table.props.actionBarButtons?.dataSource || [])];
    delete table.props.actionColumnButtons;
    delete table.props.listButtons;
}

function pageListTransform(pageList: SchemaComponent, config: TransformConfig): SchemaComponent {
    pageList.componentName = "PageList";
    let filterSlot;
    if (pageList.children?.length) {
        const filterComponent: SchemaComponent = pageList.children[0];
        console.log(5555, filterComponent);
        if (filterComponent.componentName === "Filter") {
            filterComponent.componentName = "BaseFilter";
            filterComponent.props = {
                "rowSelectionText": "批量选择",
                "filterModal": true,
                "filterIcon": "icon-sousuo",
            }
            filterComponent.children = formItemsTransform(filterComponent.children, config);
            filterSlot = createSlotProp(
                {
                    componentName: filterComponent.componentName,
                    children: filterComponent.children,
                    props: filterComponent.props,
                    id: filterComponent.id
                }
            )
        }
    }
    parseListButton(pageList);
    pageList.props = {
        ...pageList.props,
        filterComponent: filterSlot,
        columnsComponent: BaseCellSlotProp({ id: nextId(config.docId, config.seqId) })
    }
    pageList.children = [];
    console.log(3333, pageList);
    return pageList;
}

function formItemsTransform(formItems: SchemaComponent[], config: TransformConfig): SchemaComponent[] {
    const { docId, seqId } = config;
    const tables: any = [];
    const children: any[] = [];
    formItems.forEach((formItem: any) => {
        if (formItem.componentName === FormItemType.FormTabTableContainer) {
            formItem.children.forEach((tab: any) => {
                const table = tab.children[0];
                table.children = createColFields(table, nextId(docId, seqId));
                table.props.columnsComponent = BaseCellSlotProp({ id: nextId(docId, seqId) });
                parseListButton(table);
                tables.push(table)
            });
            return;
        }
        if (formItem.componentName === FormItemType.FormEditTable) {
            formItem.props.columnsComponent = BaseCellSlotProp({ id: nextId(docId, seqId) });
            formItem.children = createColFields(formItem, nextId(docId, seqId));
            parseListButton(formItem);
        }
        if (!FormItemCreator[formItem.componentName]) {
            if (formItem.componentName === FormItemType.FormNumberPicker) {
                formItem.componentName = FormItemType.FormNumberInput;
            } else {
                formItem.componentName = "FormInput";
            }
        }
        children.push(formItem);
    });
    if (tables.length > 0) {
        children.push(...tables);
    }
    return children;
}

function proFormGroupTransform(proForm: SchemaComponent, config: TransformConfig): SchemaComponent {
    proForm.componentName = "ProFormGroup";
    proForm.props.group = [];
    proForm.children.forEach((childForm: any) => {
        childForm.componentName = "ProFormGroupItem";
        childForm.props._id = childForm.props.anchorItemProps?.htmlId || mockId();
        childForm.props.groupItemHeader = childForm.props.anchorItemProps?.label;
        proForm.props.group.push(({
            "_id": childForm.props._id,
            "groupItemHeader": childForm.props.groupItemHeader
        }));
        childForm.children = formItemsTransform(childForm.children, config);
    })
    return proForm;
}

function proFormTransform(proForm: SchemaComponent, config: TransformConfig): SchemaComponent {
    proForm.componentName = "ProForm";
    proForm.children = formItemsTransform(proForm.children, config);
    return proForm;
}

const TransformComponent: Record<string, (component: SchemaComponent, config: TransformConfig) => SchemaComponent | SchemaComponent[]> = {
    /** 流程表单 */
    LceProcessForm: processFormTransform,
    /** 高级表格 */
    LceTableList: pageListTransform,
    /** 电梯表单 */
    AnchorForm: proFormGroupTransform,
    /** 高级表单 */
    ProForm: proFormTransform,
    /** 流程历史 */
    LceTimeline: (component) => ({ ...component, componentName: "ProcessHistory" }),
}

function transformComponent(component: SchemaComponent, config: TransformConfig): SchemaComponent | SchemaComponent[] | null {
    if (TransformComponent[component.componentName]) {
        return TransformComponent[component.componentName](component, config);
    } else if (component.children?.length) {
        return transformComponents(component.children, config);
    }
    return null;
}

function transformComponents(children: SchemaComponent[], config: TransformConfig): SchemaComponent[] {
    if (!children?.length) {
        return [];
    }
    return children.flatMap(c => transformComponent(c, config)).filter(c => !!c) as SchemaComponent[];
}


/** 通过pc端转换 */
export default function SchemaTransform(props: AssetsType): void {
    const { schema } = props;
    const { componentsTree } = schema;
    const page: any = componentsTree[0]
    if (!page) {
        return;
    }
    page.props = {
        ...page.props,
        "$this": {
            "type": "JSExpression",
            "value": "this"
        }
    }
    const docId = page.id;
    const seqId = { seqId: 0 };
    page.children = transformComponents(page.children, { docId, seqId });
}
