import { Input, InputNumber, Radio, Select, Switch } from "antd";
import EditableTable from "@/components/LcEditableTable";
import EditableLcTable from "@/components/LcEditableTable";
import LcFormItemGroup from "@/components/LcFormItemGroup";
import LcFormItemEditor from "@/components/LcFormItemEditor";

export enum CompTypeEnum {
  TextInput = 'TextInput',
  PasswordInput = 'PasswordInput',
  NumberInput = 'NumberInput',
  Selector = 'Selector',
  RadioGroup = 'RadioGroup',
  RadioSelector = 'RadioSelector',
  EditTable = 'EditTable',
  EditProTable = 'EditProTable',
  FormItemGroup = 'FormItemGroup',
  TextArea = 'TextArea',
  Switcher = 'Switcher',
  Editor = 'Editor',
}

export const CompsMap = {
  [CompTypeEnum.TextInput]: Input,
  [CompTypeEnum.PasswordInput]: Input.Password,
  [CompTypeEnum.NumberInput]: InputNumber,
  [CompTypeEnum.Selector]: Select,
  [CompTypeEnum.RadioSelector]: Radio,
  [CompTypeEnum.RadioGroup]: Radio.Group,
  [CompTypeEnum.EditTable]: EditableTable,
  [CompTypeEnum.EditProTable]: EditableLcTable,
  [CompTypeEnum.FormItemGroup]: LcFormItemGroup,
  [CompTypeEnum.TextArea]: Input.TextArea,
  [CompTypeEnum.Switcher]: Switch,
  [CompTypeEnum.Editor]: LcFormItemEditor,
}
