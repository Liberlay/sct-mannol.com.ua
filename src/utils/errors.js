import { toast } from 'react-toastify'

export const errors = {
  0: 'Невідома помилка',
  1001: 'Невірний формат даних',
  1002: 'Введено невірну адресу ел. пошти, номер телефону або пароль',
  1005: 'Недостатньо прав',
  4001: 'Продукт не знайдено',
  4002: 'Невідома область',
  4003: 'Невідоме місто',
  4004: 'Невідоме замовлення',
  5001: 'Невірний пароль',
  5002: 'Дуплікатний артикуль',
  5003: "Дуплікатне ім'я",
  5004: 'Невірна інформація доставки',
  5005: 'Обраних продуктів нема в наявності',
  5006: 'Невірний статус замовлення',
  5007: 'ТТН не задано',
  5008: 'Користувач з таким email вже існує',
  5010: 'Користувача з таким email не існує',
  5011: 'Недійсний код відновлення',
}

export const notifyError = (err) => toast.error(errors[err.code] ?? errors[0])
