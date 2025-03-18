"use client";
import {
  handleDeleteCollAction
} from "@/utils/actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Image, Popconfirm, Table, Tag } from "antd"; 
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserCreate from "./coll.create";
import UserUpdate from "./coll.update";
import path from "path";

const CollTable = (props: any) => {
  const { products } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);

  const getImageURL = (imageName: string) => {
    const baseName = path.parse(imageName).name;
    const url = `http://localhost:3002/api/images/${baseName}`;
    return url;
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, record: any, index: any) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Ảnh",
      dataIndex: "images",
      render: (images: any) => (
        <Image src={getImageURL(images)} height={40} alt="Collection Image" />
      ),
    },
    {
      title: "Actions",
      render: (text: any, record: any, index: any) => {
        return (
          <>
            <EditTwoTone
              id = "update_coll"
              twoToneColor="#f57800"
              style={{ cursor: "pointer", margin: "0 20px" }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                setDataUpdate(record);
              }}
            />
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa"}
              description={"Bạn có chắc chắn muốn xóa này ?"}
              onConfirm={async () =>
                await handleDeleteCollAction(record?._id)
              }
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    if (pagination && pagination.current) {
      const params = new URLSearchParams(searchParams);
      params.set("current", pagination.current);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span>Manager Product Type</span>
        <Button id="create-collection" onClick={() => setIsCreateModalOpen(true)}>Create Collection</Button>
      </div>
      <Table
        bordered
        dataSource={products}
        columns={columns}
        rowKey={"_id"}
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) => (
            <div>
              {range[0]}-{range[1]} trên {total} rows
            </div>
          ),
        }}
        onChange={onChange}
      />

      <UserCreate
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <UserUpdate
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default CollTable;