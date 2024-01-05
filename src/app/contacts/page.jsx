import styles from './page.module.scss'

export const metadata = {
  title: 'Контакти | Mannol',
  description:
    "Знайдіть всю необхідну інформацію для зв'язку з нами на одній сторінці. Телефонні номери, електронні адреси та фізичні адреси - все, що вам потрібно для ефективного та зручного спілкування з нашою компанією. Звертайтеся до нас легко та швидко.",
}

export default function ContactsPage() {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.image}
        style={{ backgroundImage: 'url(/assets/images/contacts/odesa.webp)' }}></div>
      <div className={styles.info}>
        <h3>Зв'яжіться з нами</h3>
        <h2>ТОВ Оптимум-Ойл</h2>
        <p className={styles.address}>
          БЦ Наполеон
          <br />
          вул. Успенська 39/1
          <br />
          65000 Одеса
          <br />
          Україна
        </p>
        <div className={styles.contacts}>
          <a class="mail" href="mailto:mannoldefendersct@gmail.com" target="_blank">
            mannoldefendersct@gmail.com
          </a>
          <a class="tel" href="tel:+380678464646">
            +38 067 846 46 46
          </a>
          <a class="tel" href="tel:+380638464646 ">
            +38 063 846 46 46
          </a>
        </div>
        <iframe
          className={styles.googleMap}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2747.6788406662354!2d30.744376915859345!3d46.474869073456745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c631762d3ef283%3A0x5ce3c25cc45eca4f!2sNapoleon!5e0!3m2!1sen!2sua!4v1677689909421!5m2!1sen!2sua"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  )
}
