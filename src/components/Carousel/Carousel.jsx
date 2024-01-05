'use client'

import Slider from 'react-slick'

export const Carousel = ({ className, props, content }) => (
  <Slider className={className} {...props}>
    {content}
  </Slider>
)
