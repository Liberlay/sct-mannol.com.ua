export const CATEGORIES = {
  'car-oil': {
    label: 'Моторні масла для легкових автомобілів',
    image: 'car-oil.webp',
    defaultType: 'Тип мастила',
    types: {
      synthetic: 'Синтетичне',
      'semi-synthetic': 'Напівсинтетичне',
      mineral: 'Мінеральне',
    },
    hasSpecification: true,
  },
  'truck-oil': {
    label: 'Моторні масла для грузового та автобусного парку',
    image: 'truck-oil.webp',
    defaultType: 'Тип мастила',
    types: { 'uhpd-series': 'Серія UHPD', 'shpd-series': 'Серія SHPD' },
    hasSpecification: true,
  },
  'moto-oil': {
    label: 'Масла для мототехніки',
    image: 'moto-oil.webp',
    defaultType: 'Тип мастила',
    types: {
      'motorcycle-oil': 'Мотоциклетні мастила',
      'outboard-oil': 'Мастила для підвісних моторів',
      'snowmobile-oil': 'Мастила для снігоходів',
      'garden-oil': 'Мастила для садового інвентарю',
    },
    hasSpecification: true,
  },
  'industrial-oil': {
    label: 'Індустріальні масла',
    image: 'industrial-oil.webp',
    defaultType: 'Тип мастила',
    types: {
      'compressor-oil': 'Компресорні мастила',
      'heavy-loads-oil': 'Мастила для важких навантажень',
      'hydraulic-oil': 'Гідравлічні мастила',
      'industrial-gear-oils': 'Індустріальні трансмісійні мастила',
    },
    hasSpecification: true,
  },
  'technical-fluids': {
    label: 'Автомобільні технічні рідини',
    image: 'technical-fluids.webp',
    defaultType: 'Тип рідини',
    types: {
      'brake-fluids': 'Гальмівні рідини',
      'hydraulic-fluids': 'Гідравлічні рідини',
      'fuel-system-additives': 'Присадки до паливної системи',
      'ac-system-fluids': 'Рідини для систем кондиціонування',
    },
    hasSpecification: true,
  },
  antifreeze: {
    label: 'Антифріз',
    image: 'antifreeze.webp',
    defaultType: 'Тип рідини',
    types: { 'antifreeze-and-coolants': 'Антифриз та охолоджуючі рідини' },
    hasSpecification: true,
  },
  'transmission-oils-and-fluids': {
    label: 'Трансмісійні масла та рідини',
    image: 'transmission-oils-and-fluids.webp',
    defaultType: 'Тип мастила або рідини',
    types: {
      'atf-premium-quality-line': 'Лінійка преміум якості ATF',
      'automatic-transmission-fluids': 'Трансмісійні рідини для АКПП',
      'gear-oils': 'Трансмісійні мастила',
    },
    hasSpecification: true,
  },
  additives: {
    label: 'Присадки',
    image: 'additives.webp',
    defaultType: 'Тип присадки',
    types: {
      'ester-additives': 'Добавки ESTER',
      'oil-additives': 'Присадки до мастил',
      'fuel-additives': 'Паливні присадки',
      'coolant-system-additives': 'Присадки до системи охолодження',
    },
    hasSpecification: false,
  },
  'care-products': {
    label: 'Засоби для догляду за автомобілем',
    image: 'care-products.webp',
    defaultType: 'Тип продукту',
    types: {
      'interior-care-products': "Засоби для догляду за інтер'єром",
      'exterior-care-products': "Засоби для догляду за екстер'єром",
      'glass-cleaners-and-care-products': 'Засоби для миття скла та догляду за ним',
      'parts-cleaners-and-rust-removers': 'Засоби для очищення деталей та видалення іржі',
      'emergency-products': 'Товари для надзвичайних ситуацій',
      'interior-and-exterior-restoration-sets': "Набори для реставрації інтер'єру та екстер'єру",
      'hygiene-products': 'Засоби гігієни',
      'glues-and-adhesives': 'Клеї та клейкі речовини',
      'gaskets-and-sealants': 'Прокладки та герметики',
      threadlockers: 'Блокатори різьби',
      'microfiber-and-sponge': 'Мікрофібра та губка',
    },
    hasSpecification: false,
  },
  'light-bulbs': {
    label: 'Лампочки',
    image: 'light-bulbs.webp',
  },
  filters: {
    label: 'Фільтри',
    image: 'filters.webp',
  },
  'windshield-wipers': {
    label: 'Щітки склоомивача',
    image: 'windshield-wipers.webp',
  },
}

export const PAYMENT = {
  cash: 'Готівкою',
  card: 'Карткою',
}

export const PROVIDER = {
  novaposhta: 'Нова пошта',
}

export const METHOD = {
  post: 'У відділеня',
  courier: "Кур'єром",
}

export const STATUS = {
  processing: 'В обробці',
  accepted: 'Прийнятий',
  shipped: 'Доставляється',
  completed: 'Виконаний',
  canceled: 'Скасований',
}
