import React from "react";
import { Table, Space } from "antd";
import type { TableProps } from "antd";
import CommonInput from "./input";
import ButtonCustom from "./button";

interface CommonTableProps<T> extends TableProps<T> {
  rowKeyField: keyof T;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClick?: () => void;
}

function CommonTable<T extends object>({
  columns,
  dataSource = [],
  pagination,
  rowKeyField,
  showSearch = true,
  searchValue = "",
  onSearchChange,
  onSearchClick,
  loading = false,
  ...rest
}: CommonTableProps<T>) {
  return (
    <div className="common-table">
      {showSearch && (
        <Space style={{ marginBottom: 20, display: 'flex', justifyContent: 'end' }}>
          <div style={{ width: '500px' }}>
            <CommonInput
              placeholder="Nhập từ khóa..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              variant="purple"
            />
          </div>

          <ButtonCustom
            text="Tìm kiếm"
            onClick={onSearchClick}
            className="btnSearch"
          />
        </Space>
      )}

      <Table<T>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey={(record) => String(record[rowKeyField])}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          ...pagination,
        }}
        {...rest}
      />
    </div>
  );
}

export default CommonTable;