import React from 'react'
import {SongFragementFragment} from '@gql'
import {Button, Card, Divider, notification, Spin, Typography} from 'antd'
import dayjs from 'dayjs'
import {
  CheckCircleOutlined,
  SendOutlined,
  YoutubeOutlined,
} from '@ant-design/icons'
import copy from 'copy-text-to-clipboard'
import {ITableSettings} from '../index'
import {YOUTUBE_EXTRA} from '../../../helpers/constants'

const {REACT_APP_YOUTUBE_URL} = process.env

const CardData = ({
  data,
  loading,
  count,
  loadSongs,
  tableSettings,
}: {
  data: SongFragementFragment[]
  loading: boolean
  count: number
  loadSongs: (settings?: ITableSettings) => void // eslint-disable-line no-unused-vars
  tableSettings: ITableSettings
}): React.ReactElement => {
  const moreSongs =
    count > tableSettings.pagination.pageSize * tableSettings.pagination.current

  return loading ? (
    <div style={{marginTop: 20, textAlign: 'center'}}>
      <Spin size="large" />
    </div>
  ) : (
    <>
      {data.map((song) => {
        const link = `${REACT_APP_YOUTUBE_URL}/${song.code}${YOUTUBE_EXTRA}`

        return (
          <Card style={{marginBottom: 15}}>
            <Typography.Title level={5}>{song.title}</Typography.Title>

            <Divider />

            <p>
              <strong>Date Added:</strong>{' '}
              {song.added ? (
                dayjs(song.added).format('MMMM DD, YYYY')
              ) : (
                <em>None</em>
              )}
            </p>

            <p>
              <strong>Original Recording Date:</strong>{' '}
              {song.original_date ? (
                dayjs(song.original_date).format('MMMM DD, YYYY')
              ) : (
                <em>None</em>
              )}
            </p>

            <Button
              type="primary"
              block
              size="large"
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
              <SendOutlined /> Copy Link
            </Button>

            <Button
              href={link}
              target="_blank"
              style={{
                background: '#ff0000',
                color: '#fff',
                borderColor: '#ff0000',
                marginTop: 10,
              }}
              block
              size="large"
            >
              <YoutubeOutlined /> Watch Now
            </Button>
          </Card>
        )
      })}

      {moreSongs && (
        <Button
          size="large"
          style={{marginTop: 20}}
          type="link"
          block
          onClick={() =>
            loadSongs({
              ...tableSettings,
              pagination: {
                ...tableSettings.pagination,
                current: tableSettings.pagination.current + 1,
              },
            })
          }
        >
          Load more
        </Button>
      )}
    </>
  )
}

export default CardData
