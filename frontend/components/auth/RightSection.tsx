"use client"
import React from 'react';
import { Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards,Autoplay,Pagination,Navigation } from 'swiper/modules';
import Image from 'next/image';

export default function RightSection({
  image1,
  image2,
}: {
    image1?: string;
    image2?: string;

}) {
  return (
    <>
      <Swiper
        effect={'cards'}
     
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: false,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation,EffectCards]}
        className="h-full relative w-[90%]"
      >
        <SwiperSlide className='rounded-[20px]'>
          <Image fill src={`${image1?image1:"/images/auth/auth_1.jpeg"}`} alt="slide1" className="h-full w-[90%]" />
        </SwiperSlide>
        <SwiperSlide className='rounded-[20px]'>
          <Image fill src={`${image2?image2:"/images/auth/auth_2.jpeg"}`} alt="slide2" className="h-full w-[90%]" />
        </SwiperSlide>
      
       
      </Swiper>
  
    </>
  );
}
