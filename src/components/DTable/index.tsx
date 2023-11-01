import { PaginationProps, Table, TableProps } from "antd";
import LcIcon from "../LcIcon";
import './index.less';
interface Props extends TableProps<any> {
}

function DTable(props: Props) {
  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <LcIcon type="icon-jiantouzuo" name="arrow" />;
    }
    if (type === 'next') {
      return <LcIcon type="icon-jiantouyou" name="arrow" />;
    }
    return originalElement;
  };

  return (
    <div className="d-table">
      <Table
        {...props}
        pagination={{
          ...props.pagination,
          itemRender,
          showSizeChanger: false
        }}

      />
    </div>
  )
}

export default DTable