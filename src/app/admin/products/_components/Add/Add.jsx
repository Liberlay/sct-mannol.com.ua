import { Modal } from 'antd'
import { useImmer } from 'use-immer'
import { toast } from 'react-toastify'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { ModalBase } from '../ModalBase/ModalBase'

export const Add = ({ isModalOpen, setIsModalOpen, requestProducts }) => {
  const [product, updateProduct] = useImmer({
    vendorCode: '',
    category: '',
    type: '',
    specification: '',
    title: '',
    description: '',
    options: [],
  })
  const handleOk = () => {
    request
      .authorized({
        url: '/products',
        method: 'post',
        data: product,
      })
      .then(() => {
        requestProducts()
        setIsModalOpen(false)
        toast('Товар додано')
        updateProduct({
          vendorCode: '',
          category: '',
          type: '',
          specification: '',
          title: '',
          description: '',
          options: [],
        })
      })
      .catch(notifyError)
  }
  const handleCancel = () => (
    setIsModalOpen(false),
    updateProduct({
      vendorCode: '',
      category: '',
      type: '',
      specification: '',
      title: '',
      description: '',
      options: [],
    })
  )

  const afterClose = () =>
    updateProduct({
      vendorCode: '',
      category: '',
      type: '',
      specification: '',
      title: '',
      description: '',
      options: [],
    })

  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      okText="Додати"
      onCancel={handleCancel}
      cancelText="Скасувати"
      afterClose={afterClose}
      width={670}
      centered={true}
      closeIcon={false}
    >
      <ModalBase product={product} updateProduct={updateProduct} type={'add'} />
    </Modal>
  )
}
