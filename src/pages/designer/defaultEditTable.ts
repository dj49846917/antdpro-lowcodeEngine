// 表单初始化配置
const DefaultFormSetting = {
    "condition": true,
    "hidden": false,
    "isLocked": false,
    "conditionGroup": "",
    "componentName": "ProForm",
    "id": "node_oclcsoyvee6i",
    "title": "高级表单",
    "props": {
        "operationConfig": {
            "visibleButtonCount": 4,
            "align": "center"
        },
        "columns": 2,
        "history": {
            "type": "JSExpression",
            "value": "this.history"
        },
        "ref": "pro-form-entrylcsoz8pa",
        "$this": {
            "type": "JSExpression",
            "value": "this"
        },
        "operations": [],
        "emptyContent": "添加表单项",
        "labelAlign": "top",
        "placeholderStyle": {
            "border": 0,
            "color": "#0088FF",
            "background": "#d8d8d836",
            "height": "38px",
            "gridArea": "span 4 / span 4"
        },
        "disabled": false,
        "constants": {
            "type": "JSExpression",
            "value": "this.constants"
        },
        "placeholder": "请在右侧面板添加表单项+",
        "labelCol": {
            "fixedSpan": 4
        },
        "primaryKey": "businessId"
    }
}

const DefaultComponentsMap = [{
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "ChildForm",
    "main": "src/index.tsx",
    "componentName": "ChildForm",
}, {
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "AnchorForm",
    "main": "src/index.tsx",
    "componentName": "AnchorForm",
}, {
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "ProCard",
    "main": "src/index.js",
    "componentName": "ProCard",
}, {
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "FlowProcess",
    "main": "src/index.tsx",
    "componentName": "FlowProcess",

}, {
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "LceTimeline",
    "main": "src/index.tsx",
    "componentName": "LceTimeline",

}, {
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "LceAction",
    "main": "src/index.tsx",
    "componentName": "LceAction",

}, {
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "LceActionBar",
    "main": "src/index.tsx",
    "componentName": "LceActionBar",

}, {
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "LceProcessForm",
    "main": "src/index.tsx",
    "componentName": "LceProcessForm",

}, {
    "devMode": "lowCode",
    "componentName": "Page"
}, {
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "FormInput",
    "main": "src/index.tsx",
    "componentName": "FormInput",

}, {
    "package": "dtt-comps",
    "destructuring": true,
    "subName": "",
    "exportName": "FormEditTable",
    "main": "src/index.tsx",
    "componentName": "FormEditTable",

}]
// 电梯表单默认信息
const DefaultAnchorFormSetting = {
    "children": [] as any[],
    "condition": true,
    "hidden": false,
    "isLocked": false,
    "conditionGroup": "",
    "componentName": "AnchorForm",
    "id": "node_oclcssg7q94h",
    "title": "",
    "props": {
        "database": {
            "deep": 0,
            "label": "共享",
            "value": "019571344923029504"
        },
        "$this": {
            "type": "JSExpression",
            "value": "this"
        },
        "operations": [],
        "operationConfig": {
            "visibleButtonCount": 4,
            "align": "center"
        },
        "sourceType": "dataTable",
        "showAnchor": false,
        "tableModel": {
            "deep": 0,
            "label": "ssc_purchase_statement",
            "value": "ssc_purchase_statement"
        },
        "disabled": false,
        "history": {
            "type": "JSExpression",
            "value": "this.history"
        },
        "constants": {
            "type": "JSExpression",
            "value": "this.constants"
        },
        "anchorProps": {
            "hasAffix": false,
            "direction": "hoz"
        },
        "primaryKey": "businessId"
    }
}
// 电梯子表单
const DefaultChildAnchorFormSetting = {
    "condition": true,
    "hidden": false,
    "isLocked": false,
    "conditionGroup": "",
    "componentName": "ChildForm",
    "id": "node_oclcssg7q95o",
    "title": "",
    "props": {
        "mode": "independent",
        "cardProps": {
            "hasDivider": true,
            "hidden": false,
            "bodyPadding": "",
            "htmlId": "id-cuzboa",
            "align": "left",
            "loading": false
        },
        "labelAlign": "top",
        "columns": 2,
        "anchorItemProps": {
            "htmlId": "id-cuzboa",
            "label": "Tab1"
        },
        "htmlId": "id-cuzboa",
        "disabled": false,
        "primaryKey": "businessId",
    },
    "children": [] as any[]
}

// 可编辑表格
const DefaultEditTableSetting = {
    "condition": true,
    "hidden": false,
    "isLocked": false,
    "conditionGroup": "",
    "componentName": "FormEditTable",
    "id": "node_oclct1f97pj",
    "title": "",
    "props": {
        "enableFormat": true,
        "actionBarButtons": {
            "visibleButtonCount": 4,
            "dataSource": [{
                "actionType": "create",
                "children": "新增",
                "log": false,
                "id": "entrylct1fbzt",
                "type": "primary"
            }]
        },
        "hasHeader": true,
        "borderColor": "#ddd",
        "hasTableBorder": true,
        "log": false,
        "columns": [{
            "dataIndex": "applicantName",
            "width": 200,
            "title": "字段1",
            "formatType": "text",
            "formItemProps": {
                "disabled": false,
                "required": false
            },
            "compProps": {
                "size": "medium",
                "placeholder": "请输入"
            }
        }, {
            "dataIndex": "bankAccountName",
            "width": 200,
            "title": "字段2",
            "formatType": "text",
            "formItemProps": {
                "disabled": false,
                "required": false
            },
            "compProps": {
                "size": "medium",
                "placeholder": "请输入"
            }
        }, {
            "dataIndex": "bankAccountNum",
            "width": 200,
            "title": "字段3",
            "formatType": "text",
            "formItemProps": {
                "disabled": false,
                "required": false
            },
            "compProps": {
                "size": "medium",
                "placeholder": "请输入"
            }
        }],
        "actionColumnProps": {
            "width": 200,
            "title": "操作"
        },
        "actionColumnButtons": {
            "visibleButtonCount": 4,
            "dataSource": [{
                "actionType": "del",
                "reload": "true",
                "children": "删除",
                "log": false,
                "id": "entrylct1fbxf",
                "type": "primary"
            }]
        },
        "tableModel": {
            "deep": 0,
            "label": "ssc_payable",
            "value": "ssc_payable"
        },
        "formItemProps": {
            "columnSpan": 1,
            "fullWidth": true,
            "size": "medium",
            "hidden": false,
            "asterisk": true,
            "name": "APPLICANT",
            "disabled": false,
            "label": "111",
            "device": "desktop",
            "required": false,
            "primaryKey": "id-k36xeh"
        },
        "editing": false,
        "headerTitleColor": "#2f3835",
        "database": {
            "deep": 0,
            "label": "共享",
            "value": "019571344923029504"
        },
        "isZebra": false,
        "fixedHeader": false,
        "size": "medium",
        "headerBg": "#e4f0ef",
        "sourceType": "dataTable",
        "indexColumn": false,
        "placeholder": "请输入",
        "hasBorder": true,
        "settingButtons": false,
        "primaryKey": "businessId"
    }
}
export { DefaultEditTableSetting, DefaultFormSetting, DefaultComponentsMap, DefaultAnchorFormSetting, DefaultChildAnchorFormSetting }
