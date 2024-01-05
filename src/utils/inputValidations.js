export const inputValidations = {
  name: /^\D{2,20}(\-\D{2,20})?$/g,
  email: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  phone: /^(\+?\d{12})|\d{10}$/g,
  login: /(^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$)|(^\d{10}$)/g,
  password: /^\w{8,32}$/g,
}
