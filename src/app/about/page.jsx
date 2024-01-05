import styles from './page.module.scss'

export const metadata = {
  title: 'Про нас | Mannol',
  description:
    "Компанія 'Оптимум-Ойл' - офіційний дистриб'ютор брендів MANNOL та SCT. Дізнайтеся про високоякісні моторні оливи та автохімію MANNOL, який належить концерну Sudheimer Car Technik – Vertriebs GmbH. Завдяки унікальній технології StahlSynt, моторні оливи MANNOL відзначаються високою стійкістю в умовах експлуатації. Перегляньте наш асортимент для всіх типів транспорту. Mannol - ваш вибір для надійності та ефективності в автообслуговуванні.",
}

export default function AboutUsPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <img className={styles.image} src="/assets/images/about/about_1.webp" alt="Mannol" />
        <div className={styles.text}>
          Особливість моторних олив Mannol нового покоління – застосовування власної технології
          StahlSynt, що базується на хімічному легування поверхневого шару металевих пар тертя.
          Оливна плівка залишається на металі в найскладніших умовах. Крім моторних олив, під
          брендом Mannol виробляють трансмісійні оливи та рідини. Олива для МКПП класифікується за
          API GL1-GL5, де GL5 – показник найвищої якості. Рідина для АКПП відповідає специфікаціям
          Mercon від Ford і Dexron від GM, це дає можливість підібрати рідину ATF для будь-якого
          автомобіля.
        </div>
        <img className={styles.image} src="/assets/images/about/about_2.webp" alt="Автомобіль" />
      </div>

      <div className={styles.right}>
        <div className={styles.text}>
          Компанія "Оптимум-Ойл" офіційний дистриб'ютор торгової марки MANNOL та SCT. Бренд Mannol
          належить німецькому концерну Sudheimer Car Technik – Vertriebs GmbH. Концерн був
          заснований 1993 року, марка Mannol зареєстрована 1996 року. Під цим брендом на ринку
          представлені високоякісні моторні оливи й автохімія. В асортименті бренду Mannol є всі
          необхідні мастильні матеріали для будь-яких типів двигунів. Покупці знайдуть і оливи для
          старих автомобілів, і найсучасніші розробки для нових моторів, що працюють за високими
          екологічними стандартами.
        </div>
        <img className={styles.image} src="/assets/images/about/about_3.webp" alt="Автомобіль" />

        <div className={styles.text}>
          Лінійку високоякісної автохімії доповнюють гальмівні рідини, антифризи, засоби для чищення
          та інші продукти. Асортимент Mannol не обмежується лише продукцією для легкових
          автомобілів. Компанія виробляє мастильні матеріали й автохімію для вантажівок,
          спецтехніки, мотоциклів і скутерів, оливи для стаціонарних і навіть корабельних двигунів.
          Таке розмаїття продукції було б неможливе без власної науково-технічної бази, ретельного
          відбору постачальників і контролю якості сировини. Бренд Mannol завоював світове визнання
          саме завдяки постійному вдосконаленню рівня всієї продукції. Mannol – це справді німецька
          якість!
        </div>
      </div>
    </div>
  )
}