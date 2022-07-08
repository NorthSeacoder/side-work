export const columns = [
    {
      title: '资料标题',
      dataIndex: 'title',
    },
    {
      title: '科目',
      dataIndex: 'subject',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '标签',
      dataIndex: 'tag',
      width: 80
    },
    {
      title: '资料地址',
      dataIndex: 'address'
    },
    {
      title: '课程进度',
      dataIndex: 'process'
    },
    {
      title: '课程状态',
      dataIndex: 'status'
    },
    {
      title: '课程评价',
      dataIndex: 'judge'
    },
  ]
  export interface Params {
    title?: string;
    subject?: string;
    type?: string;
    tag?: string;
    address?: string;
    process?: string;
    status?: string;
    judge?: string;
}