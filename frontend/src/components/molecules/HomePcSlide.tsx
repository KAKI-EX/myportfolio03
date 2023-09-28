import { Box } from "@chakra-ui/react";
import React, { memo, VFC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";

export const HomePcSlide: VFC = memo(() => {
  return (
    <Box w="47%">
      <Swiper
        centeredSlides
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        // navigation
      >
        <SwiperSlide>
          <img
            src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/yoko_parts/okaimonomemo_PC1.jpg"
            alt="Slide 1"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/yoko_parts/okaimonomemo_PC2.jpg"
            alt="Slide 2"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/yoko_parts/okaimonomemo_PC3.jpg"
            alt="Slide 3"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
});
