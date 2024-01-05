'use client'

import dayjs from 'dayjs'
import { debounce } from 'lodash-es'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { Edit } from './_components/Edit/Edit'
import { AutoComplete, Input, Table } from 'antd'
import { useCallback, useEffect, useState } from 'react'

import styles from './Users.module.scss'

export const Users = () => {
  const [users, setUsers] = useState(null)
  const dataSource = users
  const [currPage, setCurrPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [totalUsers, setTotalUsers] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const columns = [
    {
      title: 'Дата приєднання',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: "Ім'я",
      dataIndex: 'firstName',
      key: 'name',
    },
    {
      title: 'Прізвище',
      dataIndex: 'lastName',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'email',
    },
    {
      title: 'Роль',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin) => (isAdmin ? 'Адмін' : 'Користувач'),
    },
  ]

  const requestUsers = () => {
    request
      .authorized({
        url: '/users',
        params: {
          search: searchValue ? searchValue : null,
          page: currPage,
        },
      })
      .then((users) => (setUsers(users.data), setTotalUsers(users.total)))
      .catch(notifyError)
      .finally(() => setLoading(false))
  }

  const updateSearchValue = useCallback(
    debounce((value) => {
      setSearchValue(value)
    }, 1000),
    [],
  )

  useEffect(() => {
    requestUsers()
  }, [searchValue, currPage])

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.search}>
          <AutoComplete
            placeholder="Пошук користувачів"
            value={inputValue}
            onSearch={(value) => (
              setInputValue(value), updateSearchValue(value), setLoading(true)
            )}>
            <Input.Search />
          </AutoComplete>
        </div>
      </div>
      <div className={styles.orders}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={(record) => record.id}
          onRow={(record) => ({ onClick: () => (setIsModalOpen(true), setUserData(record)) })}
          loading={loading}
          pagination={{
            size: 'default',
            total: totalUsers,
            defaultPageSize: 20,
            showSizeChanger: false,
            onChange: (value) => (setCurrPage(value), setLoading(true)),
          }}
        />
      </div>
      <Edit
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userData={userData}
        setUserData={setUserData}
        requestUsers={requestUsers}
      />
    </div>
  )
}
