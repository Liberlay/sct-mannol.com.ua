import clsx from 'clsx'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { CATEGORIES } from 'utils/constants'
import { Skeleton, Select, Input, Divider, Button, Upload, InputNumber } from 'antd'

import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'

import styles from './ModalBase.module.scss'

export const ModalBase = ({ product, updateProduct, type }) => {
  const primaryImage = product.options.find((element) => element.isPrimary === true)?.image

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        {!primaryImage ? (
          <Skeleton.Image className={styles.skeleton} />
        ) : (
          <div
            className={styles.primary}
            style={{
              backgroundImage: primaryImage
                ? `url(/static/images/products/${primaryImage})`
                : undefined,
            }}
          ></div>
        )}

        <div className={styles.right}>
          <Input
            placeholder="Артикул"
            value={product.vendorCode}
            onChange={(event) => updateProduct({ ...product, vendorCode: event.target.value })}
            disabled={type === 'edit'}
          />
          <Select
            defaultValue="default"
            value={product.category ? product.category : 'default'}
            options={[
              { value: 'default', label: 'Категорія товару', disabled: true },
              ...Object.entries(CATEGORIES).map(([value, { label }]) => ({ value, label })),
            ]}
            onChange={(value) =>
              updateProduct((product) => {
                product.category = value
              })
            }
          />
          <Select
            key={!!CATEGORIES[product.category]?.types}
            value={product.type}
            options={[
              {
                value: '',
                label: CATEGORIES[product.category]?.defaultType,
                disabled: true,
              },
              ...Object.entries(CATEGORIES[product.category]?.types ?? []).map(
                ([value, label]) => ({
                  value,
                  label,
                })
              ),
            ]}
            onChange={(value) =>
              updateProduct((product) => {
                product.type = value
              })
            }
            disabled={!CATEGORIES[product.category]?.types}
          />
        </div>
      </div>
      <div className={styles.bottom}>
        <Input
          placeholder="Cпецифікація товару"
          value={product.specification}
          onChange={(event) => updateProduct({ ...product, specification: event.target.value })}
          disabled={!CATEGORIES[product.category]?.hasSpecification}
        />
        <Input
          size="large"
          placeholder="Назва товару"
          value={product.title}
          onChange={(event) => updateProduct({ ...product, title: event.target.value })}
        />
        <Input.TextArea
          autoSize
          placeholder="Опис товару"
          value={product.description}
          onChange={(event) => updateProduct({ ...product, description: event.target.value })}
        />
        <Divider className={styles.divider}>Варіанти</Divider>
        <div className={styles.addOption}>
          <Button
            icon={<PlusOutlined />}
            onClick={() =>
              updateProduct((product) => {
                product.options.push({
                  image: '',
                  label: '',
                  price: null,
                  available: null,
                  key: uuidv4(),
                })
              })
            }
          >
            Додати варіант
          </Button>
          <div className={styles.defaultOption}>
            <Select
              key={product.options}
              value={product.options.findIndex((element) => element.isPrimary === true)}
              options={[
                { value: -1, label: 'Оберіть варіант за замовчуванням', disabled: true },
                ...product.options.map((option, i) => ({
                  value: i,
                  label: option.label || 'Варіант не вказан',
                })),
              ]}
              onSelect={(i) =>
                updateProduct((product) => {
                  for (const element of product.options) delete element.isPrimary
                  product.options[i].isPrimary = true
                })
              }
            />
          </div>
        </div>
        {product.options.map((option, i) => (
          <Option key={option.key} updateProduct={updateProduct} option={option} i={i} />
        ))}
      </div>
    </div>
  )
}

const Option = ({ updateProduct, option, i }) => {
  const [fileList, setFileList] = useState(
    option.image ? [{ thumbUrl: `/static/images/products/${option.image}` }] : []
  )
  const [loading, setLoading] = useState(false)
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  return (
    <div className={styles.option}>
      <div className={clsx(styles.upload, fileList.length >= 1 && styles.hidden)}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          customRequest={({ file, onProgress, onSuccess }) => {
            const formData = new FormData()
            formData.append('file', file)
            request
              .authorized({
                url: '/product_images',
                method: 'post',
                data: formData,
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (event) => onProgress({ percent: event.progress * 100 }),
              })
              .then((data) =>
                updateProduct((product) => {
                  product.options[i].image = data.url
                })
              )
              .then(onSuccess)
              .catch(notifyError)
          }}
        >
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
        </Upload>
      </div>
      <Input
        className={styles.optionInput}
        placeholder="Назва варіанта"
        value={option.label}
        onChange={(event) =>
          updateProduct((product) => {
            product.options[i].label = event.target.value
          })
        }
      />
      <InputNumber
        className={styles.optionInput}
        placeholder="Ціна"
        addonAfter="₴"
        value={option.price}
        onChange={(value) =>
          updateProduct((product) => {
            product.options[i].price = value
          })
        }
        controls={false}
      />
      <InputNumber
        className={styles.optionInput}
        placeholder="Кількість"
        value={option.available}
        onChange={(value) =>
          updateProduct((product) => {
            product.options[i].available = value
          })
        }
        min={0}
      />
      <DeleteOutlined
        className={styles.deleteOption}
        onClick={() => {
          option.image &&
            request.authorized({
              url: `/product_images/${option.image}`,
              method: 'delete',
            })
          updateProduct((product) => {
            product.options.splice(i, 1)
          })
        }}
      />
    </div>
  )
}
