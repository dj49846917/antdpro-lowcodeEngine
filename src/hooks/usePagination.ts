import { PaginationProps } from "antd";
import { useIntl } from "@@/plugin-locale/localeExports";

export const usePagination = (props: PaginationProps) => {
  const intl = useIntl();
  return {
    showTotal: (totalRows: number) => `${intl.formatMessage({ id: 'table.pagination.total' })} ${totalRows}`,
    ...props
  }
}
