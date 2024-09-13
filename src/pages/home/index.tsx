import {SearchOutlined, SettingOutlined, UpOutlined} from '@ant-design/icons'
import {SongFragementFragment, useGetSongsCountLazyQuery, useGetSongsLazyQuery} from '@gql'
import {BackTop, Button, Input, Layout, Typography} from 'antd'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'
import React, {useEffect, useState} from 'react'

import {DEFAULT_PAGE_SIZE, DEFAULT_SORT_FIELD, DEFAULT_SORT_ORDER} from '../../helpers/constants'
import CardData from './components/CardData'
import TableData from './components/TableData'
import TableSettings from './components/TableSettings'

const {Content} = Layout

export interface ITableSettings {
  sort: {
    field: string
    order: string
  }
  pagination: {
    current: number
    pageSize: number
  }
  search: string
}

const HomePage = (): React.ReactElement => {
  const [songs, setSongs] = useState<SongFragementFragment[]>([])
  const [loadingMore, setLoadingMore] = useState(false)

  const screens = useBreakpoint()
  const [getCount, countData] = useGetSongsCountLazyQuery()
  const [getSongs, {data, loading}] = useGetSongsLazyQuery()

  useEffect(() => {
    if (data && data.songs) {
      if (screens.md) {
        setSongs(data.songs)
      } else {
        setSongs(loadingMore ? [...songs, ...data.songs] : data.songs)
      }
    }
  }, [data])

  const [settingsVisible, setSettingsVisible] = useState(false)
  const [tableSettings, setTableSettings] = useState<ITableSettings>({
    sort: {
      field: DEFAULT_SORT_FIELD,
      order: DEFAULT_SORT_ORDER,
    },
    pagination: {
      current: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    },
    search: '',
  })

  const loadSongs = async (settings?: ITableSettings, searching = false, loadMore = false) => {
    setLoadingMore(loadMore)

    if (!settings) {
      settings = tableSettings
    } else {
      setTableSettings(settings)
    }

    getCount({
      variables: {
        where:
          settings.search.length > 0
            ? {
                title_contains: settings.search,
              }
            : null,
      },
    })
    getSongs({
      variables: {
        sort: `${settings.sort.field}:${settings.sort.order === 'ascend' ? 'asc' : 'desc'}`,
        limit: settings.pagination.pageSize,
        start: searching ? 0 : (settings.pagination.current - 1) * settings.pagination.pageSize,
        where:
          settings.search.length > 0
            ? {
                title_contains: settings.search,
              }
            : null,
      },
    })
  }

  useEffect(() => {
    loadSongs()
  }, [])

  return (
    <Layout style={{background: screens.md ? '#fff' : '#F9FAFB'}}>
      <Content style={{padding: '50px 50px 100px'}}>
        <Typography.Title level={2} style={{marginBottom: 0}}>
          Songs I Love to Sing
        </Typography.Title>

        <div style={{marginBottom: 20}}>
          <em>
            Songs written &amp; performed by
            {screens.md ? ' ' : <br />}
            Dr. Brad Weniger
          </em>
        </div>

        <Input
          style={{marginBottom: 20}}
          size="large"
          placeholder="Search..."
          value={tableSettings.search}
          onChange={(e) => setTableSettings({...tableSettings, search: e.target.value})}
          onPressEnter={() => loadSongs(null, true)}
          suffix={
            <Button onClick={() => loadSongs({...tableSettings, search: ''}, true)} type="link">
              Reset
            </Button>
          }
          prefix={<SearchOutlined />}
        />

        {screens.md ? (
          <TableData
            data={data}
            loading={loading}
            countData={countData}
            loadSongs={loadSongs}
            tableSettings={tableSettings}
          />
        ) : (
          <CardData
            data={songs}
            loading={loading}
            count={countData.data?.songsCount || 0}
            loadSongs={loadSongs}
            tableSettings={tableSettings}
          />
        )}

        <BackTop>
          <div
            style={{
              height: 40,
              width: 40,
              lineHeight: '40px',
              borderRadius: 9999,
              backgroundColor: '#1088e9',
              color: '#fff',
              textAlign: 'center',
              fontSize: 14,
            }}
          >
            <UpOutlined style={{fontSize: 'large'}} />
          </div>
        </BackTop>
      </Content>

      {!screens.md && (
        <div
          style={{
            margin: 0,
            padding: 0,
            position: 'fixed',
            bottom: 50,
            left: -10,
            zIndex: 10,
          }}
        >
          <Button
            style={{
              padding: '15px 10px 15px 15px',
              width: 'auto',
              height: 'auto',
            }}
            type="primary"
            onClick={() => setSettingsVisible(true)}
            icon={<SettingOutlined style={{fontSize: 'x-large'}} />}
          />
        </div>
      )}

      <TableSettings
        tableSettings={tableSettings}
        visible={settingsVisible}
        onClose={async (settings: ITableSettings) => {
          await loadSongs(settings)
          setSettingsVisible(false)
        }}
      />
    </Layout>
  )
}

export default HomePage
