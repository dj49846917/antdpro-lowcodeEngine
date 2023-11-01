import { mockId, nextId } from "../../utils";
import type { CreatorProps } from "../types";
import Creator, { createSlotProp } from "./common";
import { omit } from "lodash";
import { injectProFormSchemaOfPageId } from "./schema-creator";
import { JSSlotValueSchame } from "../common";
import { AssetsType } from "@/services/schemaApi";

interface PageListSchemaProps {
    props: {
        columns?: { dataIndex: string, title: string, [key: string]: any };
    };
    children?: any;
    id: string;
}

function PageListCellSchema(cellName: string, props: any = {}) {
    return {
        "componentName": cellName || "BaseCell",
        "id": mockId(),
        "props": {
            ...props,
        },
        "hidden": false,
        "title": "",
        "isLocked": false,
        "condition": true,
        "conditionGroup": ""
    }
}

export default function PageList({
    props,
    children,
    id
}: PageListSchemaProps) {
    return {
        id,
        "componentName": "PageList",
        "props": {
            "dataSource": [],
            ...props
        },
        children
    }
}


PageList.create = async (props: CreatorProps) => {
    const {
        rootSchema,
        docId,
        seqId,
        dataTable,
        childPageId,
        fields,
        components,
    } = props;
    const oldPageList = rootSchema?.children?.[0] || {};
    const listButtons = [];
    if (childPageId?.value) {
        listButtons.push({
            "children": "新增",
            "type": "normal",
            "actionType": "create",
            "page": {
                "deep": 0,
                "value": childPageId?.value,
                "label": childPageId?.label,
                "modalStyle": {
                    "full": true
                }
            },
            "disabled": false
        })
    }
    rootSchema.children = [
        PageList({
            props: {
                "primaryKey": "businessId",
                ...oldPageList.props,
                ...dataTable,
                columns: fields?.map(field => {
                    return Creator.createColumn(omit(field, ['required']), nextId(docId, seqId), { components });
                }),
                "listButtons": listButtons,
                "columnsComponent": JSSlotValueSchame(
                    [PageListCellSchema("CustomCard")],
                    {
                        title: "列表项插槽",
                        name: "CustomCard",
                        id: nextId(docId, seqId)
                    }),
            },
            id: nextId(docId, seqId)
        })
    ];

    if (childPageId?.value) {
        return await injectProFormSchemaOfPageId(childPageId!.value, props);;
    }
    return true;
}

export function BaseCellSlotProp({ id }: any) {
    return createSlotProp({ id, componentName: "BaseCell", title: "列表项插槽", name: "BaseCell" });
}

export function BaseFilterSlotProp({ id }: any) {
    return createSlotProp({ id, componentName: "BaseFilter", title: "筛选插槽", name: "BaseFilter" });
}