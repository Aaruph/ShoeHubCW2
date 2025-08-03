import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll"; // Importing Link from react-scroll
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      // navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper relative z-[10]"
    >
      {/* Slide 1 */}
      <SwiperSlide>
        <div className="flex flex-col md:flex-row items-center justify-between px-20 py-20 bg-gradient-to-r from-orange-50 to-orange-100">
          {/* Text Section */}
          <div className="md:w-1/2 text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Step Into Style with Premium Footwear
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover our collection of trendy and comfortable shoes for every occasion.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-orange-500 text-white py-3 px-8 text-lg rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Shop Now
            </button>
          </div>
          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center ml-16">
            <img
              src="/src/assets/images/restaurant.jpg"
              alt="Trendy Shoes"
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 2 */}
      <SwiperSlide>
        <div className="flex flex-col md:flex-row items-center justify-between px-20 py-20 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="md:w-1/2 text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Comfort Meets Fashion
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Experience the perfect blend of style and comfort with our premium shoe collection.
            </p>
            <Link
              to="order-section"
              smooth={true}
              duration={500}
            >
              <button className="bg-orange-500 text-white py-3 px-8 text-lg rounded-lg hover:bg-orange-600 transition duration-300">
                Explore Collection
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/src/assets/images/restaurant.jpg"
              alt="Comfortable Shoes"
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 3 */}
      <SwiperSlide>
        <div className="flex flex-col md:flex-row items-center justify-between px-20 py-20 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="md:w-1/2 text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Fast & Secure Delivery
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Get your favorite shoes delivered quickly and safely to your doorstep.
            </p>
            <button
              className="bg-orange-500 text-white py-3 px-8 text-lg rounded-lg hover:bg-orange-600 transition duration-300"
              onClick={() => navigate("/contact-us")}
            >
              Contact Us
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/src/assets/images/restaurant.jpg"
              alt="Fast Delivery"
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Hero;
