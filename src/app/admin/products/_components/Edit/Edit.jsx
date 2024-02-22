import { useImmer } from 'use-immer'
import { toast } from 'react-toastify'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { useUpdateEffect } from 'usehooks-ts'
import { ModalBase } from '../ModalBase/ModalBase'
import { Button, Modal, Popconfirm, Spin } from 'antd'

import { LoadingOutlined } from '@ant-design/icons'

import styles from './Edit.module.scss'

export const Edit = ({ isModalOpen, setIsModalOpen, urlKey, requestProducts }) => {
  const [product, updateProduct] = useImmer(null)
  const handleOk = () => {
    request
      .authorized({
        url: `/products/${urlKey}`,
        method: 'patch',
        data: product,
      })
      .then(() => {
        requestProducts()
        updateProduct(null)
        setIsModalOpen(false)
        toast('Товар успішно змінено')
      })
      .catch(notifyError)
  }
  const handleCancel = () => (setIsModalOpen(false), updateProduct(null))

  const afterClose = () => updateProduct(null)

  const handleConfirmDelete = () => {
    request
      .authorized({
        url: `/products/${urlKey}`,
        method: 'delete',
      })
      .then(() => {
        setIsModalOpen(false)
        updateProduct(null)
        requestProducts()
        toast('Товар видалено')
      })
      .catch(notifyError)
  }

  useUpdateEffect(() => {
    isModalOpen &&
      request
        .authorized({
          url: `/products/${urlKey}`,
          params: { raw: 1 },
        })
        .then((data) => updateProduct(data))
        .catch(notifyError)
  }, [isModalOpen])

  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      okText="Оновити"
      onCancel={handleCancel}
      cancelText="Скасувати"
      afterClose={afterClose}
      width={670}
      centered={true}
      closeIcon={false}
      style={{ paddingTop: '50px' }}
      footer={[
        <Popconfirm
          key="delete"
          title="Видалити товар"
          description="Ви впевнені що хочете видалити товар?"
          okText="Так"
          onConfirm={handleConfirmDelete}
          cancelText="Ні"
        >
          <Button danger>Видалити товар</Button>
        </Popconfirm>,
        <Button key="back" onClick={handleCancel}>
          Скасувати
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Оновити
        </Button>,
      ]}
    >
      {product ? (
        <ModalBase product={product} updateProduct={updateProduct} type={'edit'} />
      ) : (
        <div className={styles.spinner}>
          <Spin indicator={<LoadingOutlined />} size="large" />
        </div>
      )}
    </Modal>
  )
}
