import React from 'react'
import {Exact, GetSongsCountQuery, GetSongsQuery, Song} from '@gql'
import {Button, notification, Table} from 'antd'
import dayjs from 'dayjs'
import copy from 'copy-text-to-clipboard'
import {
  CheckCircleOutlined,
  SendOutlined,
  YoutubeOutlined,
} from '@ant-design/icons'
import {LazyQueryResult} from '@apollo/client'
import {ITableSettings} from '../index'
import {YOUTUBE_EXTRA} from '../../../helpers/constants'

const {REACT_APP_YOUTUBE_URL} = process.env

const TableData = ({
  data,
  loading,
  countData,
  loadSongs,
  tableSettings,
}: {
  data: GetSongsQuery
  loading: boolean
  countData: LazyQueryResult<GetSongsCountQuery, Exact<{where?: any}>> // eslint-disable-line @typescript-eslint/no-explicit-any
  loadSongs: (settings?: ITableSettings) => void // eslint-disable-line no-unused-vars
  tableSettings: ITableSettings
}): React.ReactElement => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: true,
      defaultSortOrder: 'ascend' as const,
      render: (title, {code}: Song) => (
        <a
          href={`${REACT_APP_YOUTUBE_URL}/${code}${YOUTUBE_EXTRA}`}
          target="_blank"
        >
          {title}
        </a>
      ),
    },
    {
      title: 'Date Added',
      dataIndex: 'added',
      sorter: true,
      render: (date) =>
        date ? dayjs(date).format('MMMM DD, YYYY') : <em>None</em>,
    },
    {
      title: 'Original Date',
      dataIndex: 'original_date',
      sorter: true,
      render: (date) =>
        date ? dayjs(date).format('MMMM DD, YYYY') : <em>None</em>,
    },
    {
      title: 'Share',
      render: ({code}: Song) => {
        const link = `${REACT_APP_YOUTUBE_URL}/${code}${YOUTUBE_EXTRA}`

        return (
          <>
            <Button
              type="primary"
              shape="circle"
              onClick={() => {
                copy(link)
                notification.open({
                  duration: 3,
                  message: 'Link Copied',
                  icon: <CheckCircleOutlined style={{color: '#34D399'}} />,
                  description:
                    'You can now send this link to someone else by pasting it.',
                })
              }}
            >
              <SendOutlined />
            </Button>

            <Button
              href={link}
              target="_blank"
              style={{
                background: '#ff0000',
                color: '#fff',
                borderColor: '#ff0000',
                marginLeft: 15,
              }}
              shape="circle"
            >
              <YoutubeOutlined />
            </Button>
          </>
        )
      },
    },
  ]

  const handleTableChange = (pagination, _, sorter) =>
    loadSongs({
      ...tableSettings,
      sort: {...tableSettings.sort, ...sorter},
      pagination: {...tableSettings.pagination, ...pagination},
    })

  return (
    <Table
      bordered
      loading={loading || countData.loading || !data || !data.songs}
      columns={columns}
      rowKey={({id}: Song) => id}
      dataSource={data?.songs}
      sortDirections={['ascend', 'descend', 'ascend']}
      pagination={{
        ...tableSettings.pagination,
        total: countData.data?.songsCount || 0,
      }}
      onChange={handleTableChange}
    />
  )
}

export default TableData
