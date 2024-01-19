import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import avatarF1 from '../assets/images/f-3.1.png';
import avatarF2 from '../assets/images/f-3.2.png';
import avatarF3 from '../assets/images/f-3.3.png';

interface FeatureItem {
  title: string;
  image: string;
  description: string;
  
}

const Feature3: React.FC = () => {

  const itemsFeatures: FeatureItem[] = [
    { title: "Simplicity", image: avatarF1, description: 'Select your property and within minutes you can own Blocks in an investment property.' },
    { title: "Finally - Access to Property Market", image: avatarF2, description: 'Feeling locked out of the property market? With Blocks from under $100, now there’s an affordable way to invest.' },
    { title: " Property team expertise", image: avatarF3, description: 'Properties are hand-picked by our property team. Learn More.' },
  ];

  const settingsFeatures = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true
  };

  return (
    <section id='Feature3' className='mt-4 pb-8'>
      <div className='container mx-auto text-center'>
        <h2 className='text-4xl pt-8 md:mb-16 md:pb-8 mb-2 pb-2 font-extrabold text-center'>
          Why Choose SPO Markets?
        </h2>
        <div className='hidden md:block md:flex flex-col md:mt-8 mt-2 md:flex-row md:space-x-6'>
          {itemsFeatures.map((HW, index) => (
            <div className='flex flex-col items-center p-6 space-y-6 md:w-1/3' key={index}>
              <img src={HW.image} className='w-16 ' alt='' />
              <h3 className='text-xl text-black font-bold h-16'>{HW.title}</h3>
              <p className='text-sm flex flex-grow text-darkGrayishBlue'>{HW.description}</p>
            </div>
          ))}
        </div>
        <div className='md:hidden items-center mx-3 my-1 '>
  <Slider {...settingsFeatures}>
    {itemsFeatures.map((HfW, index1) => (
      <div key={index1} >
        <div className="carousel-item flex border-2 border-{bg-primaryBtn} rounded-md overflow-hidden shadow-md my-2">
        <div className="w-1/3 flex items-center justify-center">
          <img src={HfW.image} className='w-32' alt='' />
        </div>
        <div className="w-3/4 p-2">
          <div className="text-black text-left break-words font-bold mr-2 ml-2 text-xl mb-2">{HfW.title}</div>
          <p className="text-darkGrayishBlue text-left">{HfW.description}</p>
        </div>
        </div>
        
      </div>
    ))}
  </Slider>
</div>
      </div>
    </section>
  );
};

export default Feature3;