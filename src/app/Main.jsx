'use client'

import clsx from 'clsx'
import Link from 'next/link'
import Slider from 'react-slick'
import { useRef, useState } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

import styles from './Main.module.scss'

export const Main = ({ products }) => {
  const sliderRef = useRef()
  const productsSliderRef = useRef()
  const bannerRef = useRef()
  const videoRef = useRef()
  const firstImageRef = useRef()
  const secondImageRef = useRef()
  const [presentedProducts, setPresentedProducts] = useState(products)
  const [slideIndex, setSlideIndex] = useState(0)
  const [productsSlideIndex, setProductsSlideIndex] = useState(0)
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    fade: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    beforeChange: (oldIndex, newIndex) => setSlideIndex(newIndex),
  }

  const productsSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 10000,
    slidesToShow: 4,
    slidesToScroll: 1,
    pauseOnHover: false,
    beforeChange: (oldIndex, newIndex) => setProductsSlideIndex(newIndex),
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const bannerAnimation = useIntersectionObserver(bannerRef, {
    rootMargin: '-100px',
    freezeOnceVisible: true,
  })

  const firstImageAnimation = useIntersectionObserver(firstImageRef, {
    rootMargin: '-100px',
    freezeOnceVisible: true,
  })

  const secondImageAnimation = useIntersectionObserver(secondImageRef, {
    rootMargin: '-100px',
    freezeOnceVisible: true,
  })

  return (
    <main>
      <div className={styles.wrapper}>
        <div className={styles.slider}>
          <Slider ref={sliderRef} {...settings}>
            <img src="/assets/images/main/slider/slider_1.webp" alt="Слайдер" />
            <img src="/assets/images/main/slider/slider_2.webp" alt="Слайдер" />
            <img src="/assets/images/main/slider/slider_3.webp" alt="Слайдер" />
            <img src="/assets/images/main/slider/slider_4.webp" alt="Слайдер" />
            <img src="/assets/images/main/slider/slider_5.webp" alt="Слайдер" />
            <img src="/assets/images/main/slider/slider_6.webp" alt="Слайдер" />
          </Slider>
          <div className={styles.navWrapper}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={clsx(styles.navItem, slideIndex === i && styles.active)}
                onClick={() => sliderRef.current.slickGoTo(i)}
              ></div>
            ))}
          </div>
        </div>
        <div className={styles.container}>
          <h3>Наша продукція</h3>
          <div className={styles.productsSlider}>
            <KeyboardArrowLeftIcon
              className={styles.arrowLeft}
              onClick={() => productsSliderRef.current.slickGoTo(productsSlideIndex - 1)}
            />
            <Slider ref={productsSliderRef} {...productsSettings}>
              {presentedProducts.map((product, i) => (
                <div key={i} className={styles.item}>
                  <Link
                    className={styles.link}
                    href={`/products/${product.urlKey}?option=${product.optionKey}`}
                  >
                    <div className={styles.imageWrapper}>
                      <img
                        className={styles.image}
                        src={`/static/images/products/${product.image}`}
                        alt={`${product.title}`}
                      />
                    </div>
                    <div className={styles.title}>{product.title}</div>
                  </Link>
                </div>
              ))}
            </Slider>
            <KeyboardArrowRightIcon
              className={styles.arrowRight}
              onClick={() => productsSliderRef.current.slickGoTo(productsSlideIndex + 1)}
            />
          </div>
        </div>
        <div className={styles.container}>
          <h3>Презентація</h3>
          <video
            ref={videoRef}
            width="100%"
            display="inline-block"
            muted
            loop
            controls
            poster="/assets/images/main/thumbnail.webp"
            onClick={() => videoRef.current.play()}
          >
            <source src="/assets/images/main/video.mp4" type="video/mp4" />
            "Your browser does not support the video tag."
          </video>
        </div>
        <div
          ref={bannerRef}
          className={clsx(styles.scrollElement, bannerAnimation?.isIntersecting && styles.active)}
        >
          <Link href="https://sct-ester.com/ru" target="_blank">
            <img className={styles.ester} src="/assets/images/main/ester.webp" alt="Банер Ester" />
          </Link>
        </div>
        <div className={styles.container}>
          <h3>Ярмарки та заходи</h3>
          <div className={styles.news}>
            <img
              ref={firstImageRef}
              className={clsx(
                styles.scrollElement,
                firstImageAnimation?.isIntersecting && styles.active
              )}
              src="/assets/images/main/news/news_1.webp"
              alt="Новини"
            />
            <img
              ref={secondImageRef}
              className={clsx(
                styles.scrollElement,
                secondImageAnimation?.isIntersecting && styles.active
              )}
              src="/assets/images/main/news/news_2.webp"
              alt="Новини"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
