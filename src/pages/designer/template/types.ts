
import type {
    IPublicTypePackage,
    IPublicTypeRootSchema
} from "@alilc/lowcode-types";

export interface FieldProps {
    columnName?: string,
    defaultValue?: any,
    uniques?: boolean,
    comments?: string,
    columnLabel?: string,
    /** **/
    datasourceId?: string,
    tableName?: string,
    /** **/
    formComponentName: string,
    required?: boolean,
    disabled?: boolean,
    hidden?: boolean,
    /***====下拉属性=====***/
    /**
     * 下拉存储格式 {value: "1", label: "小明"}
     */
    labelInValue?: boolean;
    /**
     * 下拉选择模式
     */
    mode?: "multiple" | "tag",
    labelKey?: null,
    valueKey?: null,
    /***====下拉属性=====***/
    /**
     * 数字精度
     */
    precisions?: number,
    /**
     * 精度
     */
    maxLength?: number,
    /**
     * 日期格式
     */
    format?: string;
    /**
     * 可编辑表格列字段
     */
    fields?: FieldProps[];
    /**
     * 可编辑表格列
     */
    columns?: any[];
}

export interface SchemaCreatorProps {
    rootSchema: IPublicTypeRootSchema;
    childRootSchema: IPublicTypeRootSchema;
    /** pc关联的app流程表单 */
    appPageId?: string;
    pageName?: string;
    /** 0: 流程表单， 1： 普通页面， 2： 模型列表 */
    pageType?: any;
    /**
     * 数据源
     */
    datasourceId: {
        label: string;
        value: string;
    };
    /**
     * 数据表
     */
    tableName: {
        label: string;
        value: string;
    };
    /**
     * 列表页面的新增页面
     */
    childPageId?: {
        label: string;
        value: string;
    };
    fields: FieldProps[];
    childTableList?: FieldProps[];
    packages: IPublicTypePackage[];
}

export interface CreatorProps extends Omit<SchemaCreatorProps, "datasourceId" | "tableName"> {
    docId: string,
    seqId: any,
    dataTable: {
        database: {
            label: string;
            value: string;
        },
        tableModel: {
            label: string;
            value: string;
        },
    },
    components: any,
}
