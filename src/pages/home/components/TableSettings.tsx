import React, {useState} from 'react'
import {Button, Divider, Drawer, Dropdown, Menu, Typography} from 'antd'
import {DownOutlined} from '@ant-design/icons'
import {ITableSettings} from '../index'
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_FIELD,
  DEFAULT_SORT_ORDER,
} from '../../../helpers/constants'

const TableSettings = ({
  tableSettings,
  onClose,
  visible,
}: {
  tableSettings: ITableSettings
  onClose: (settings: ITableSettings) => void // eslint-disable-line no-unused-vars
  visible: boolean
}): React.ReactElement => {
  const [settings, setSettings] = useState<ITableSettings>(tableSettings)

  return (
    <Drawer
      title="Settings"
      placement="left"
      onClose={() => onClose(settings)}
      visible={visible}
    >
      <Typography.Title level={4}>Sorting</Typography.Title>

      <Divider />

      <div>
        <strong>Field:</strong>

        <div style={{marginTop: 10}}>
          <Dropdown
            overlay={
              <Menu
                selectedKeys={[settings.sort.field]}
                onClick={({key}) => {
                  const updatedSettings = {...settings}

                  updatedSettings.sort.field = key
                  setSettings(updatedSettings)
                }}
              >
                <Menu.Item key="title">Title</Menu.Item>
                <Menu.Item key="added">Date Added</Menu.Item>
                <Menu.Item key="original_date">
                  Original Recording Date
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button block>
              {settings.sort.field === 'title'
                ? 'Title'
                : settings.sort.field === 'added'
                ? 'Date Added'
                : 'Original Recording Date'}{' '}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div style={{marginTop: 20}}>
        <strong>Order:</strong>

        <div style={{marginTop: 10}}>
          <Dropdown
            overlay={
              <Menu
                selectedKeys={[settings.sort.order]}
                onClick={({key}) => {
                  const updatedSettings = {...settings}

                  updatedSettings.sort.order = key
                  setSettings(updatedSettings)
                }}
              >
                <Menu.Item key="ascend">Ascending</Menu.Item>
                <Menu.Item key="descend">Descending</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button block>
              {settings.sort.order === 'ascend' ? 'Ascending' : 'Descending'}{' '}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div style={{marginTop: 50}}>
        <Button
          block
          type="primary"
          size="large"
          onClick={() => onClose(settings)}
        >
          Save
        </Button>
      </div>

      <div style={{marginTop: 50}}>
        <Button
          block
          type="link"
          onClick={() => {
            const initialTableSettings: ITableSettings = {
              sort: {
                field: DEFAULT_SORT_FIELD,
                order: DEFAULT_SORT_ORDER,
              },
              pagination: {
                current: 1,
                pageSize: DEFAULT_PAGE_SIZE,
              },
              search: '',
            }

            setSettings(initialTableSettings)
            onClose(initialTableSettings)
          }}
        >
          Reset
        </Button>
      </div>
    </Drawer>
  )
}

export default TableSettings
