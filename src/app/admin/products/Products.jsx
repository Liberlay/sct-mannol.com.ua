'use client'

import { debounce } from 'lodash-es'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { Add } from './_components/Add/Add'
import { CATEGORIES } from 'utils/constants'
import { Edit } from './_components/Edit/Edit'
import { useState, useCallback, useEffect } from 'react'
import { Button, AutoComplete, Select, Input, Table } from 'antd'

import { PlusOutlined } from '@ant-design/icons'

import styles from './Products.module.scss'

export const Products = () => {
  const [currPage, setCurrPage] = useState(1)
  const [products, setProducts] = useState([])
  const dataSource = products
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [productUrlKey, setProductUrlKey] = useState('')
  const [totalProducts, setTotalProducts] = useState(null)
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [searchedCategory, setSearchedCategory] = useState(null)
  const columns = [
    {
      title: 'Артикул',
      dataIndex: 'vendorCode',
      key: 'vendorCode',
    },
    {
      title: '',
      dataIndex: 'options',
      key: 'image',
      render: (options) => (
        <img
          className={styles.productImage}
          src={`/static/images/products/${options.find((element) => element.isPrimary).image}`}
          alt={`${options.find((element) => element.isPrimary).label}`}
        />
      ),
    },
    {
      title: 'Назва',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Категорія',
      dataIndex: 'category',
      key: 'category',
      render: (category) => CATEGORIES[category]?.label,
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type, product) => CATEGORIES[product.category]?.types[type],
    },
    {
      title: 'Залишки',
      dataIndex: 'available',
      key: 'available',
      render: (_, product) =>
        `${product.options.reduce((sum, option) => sum + option.available, 0)} шт`,
    },
  ]

  const requestProducts = () => {
    request
      .authorized({
        url: '/products',
        params: {
          search: searchValue ? searchValue : null,
          category: searchedCategory ? searchedCategory : null,
          page: currPage,
        },
      })
      .then((products) => (setProducts(products.data), setTotalProducts(products.total)))
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
    requestProducts()
  }, [searchedCategory, searchValue, currPage])

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Button
          className={styles.button}
          icon={<PlusOutlined />}
          onClick={() => setIsModalAddOpen(true)}>
          Додати товар
        </Button>
        <div className={styles.search}>
          <Select
            className={styles.category}
            placeholder="Вибір категорії"
            value={searchedCategory}
            options={Object.entries(CATEGORIES).map(([value, { label }]) => ({ value, label }))}
            onChange={(value) => (setSearchedCategory(value), setLoading(true))}
          />
          <AutoComplete
            placeholder="Пошук товару"
            value={inputValue}
            onSearch={(value) => (
              setInputValue(value), updateSearchValue(value), setLoading(true)
            )}>
            <Input.Search />
          </AutoComplete>
        </div>
      </div>
      <Table
        size="middle"
        rowKey={(record) => record.vendorCode}
        columns={columns}
        dataSource={dataSource}
        onRow={(record) => ({
          onClick: () => (setIsModalEditOpen(true), setProductUrlKey(record.urlKey)),
        })}
        loading={loading}
        pagination={{
          size: 'default',
          total: totalProducts,
          defaultPageSize: 20,
          showSizeChanger: false,
          onChange: (value) => (setCurrPage(value), setLoading(true)),
        }}
      />
      <Add
        isModalOpen={isModalAddOpen}
        setIsModalOpen={setIsModalAddOpen}
        requestProducts={requestProducts}
      />
      <Edit
        isModalOpen={isModalEditOpen}
        setIsModalOpen={setIsModalEditOpen}
        urlKey={productUrlKey}
        requestProducts={requestProducts}
      />
    </div>
  )
}
