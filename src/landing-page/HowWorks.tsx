import { jsPDF } from 'jspdf';
import React, { useEffect, useRef } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import '../assets/css/work.css';
import avatarH1 from '../assets/images/h-1.png';
import avatarH2 from '../assets/images/h-2.png';
import avatarH3 from '../assets/images/h-3.png';
import avatarH4 from '../assets/images/h-4.png';
interface FeatureItem {
  digit: string;
  name: string;
  image: string;
}

const Features: React.FC = () => {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const items: FeatureItem[] = [
    { digit: "1", name: "Choose your property", image: avatarH1 },
    { digit: "2", name: "Buy Blocks", image: avatarH2 },
    { digit: "3", name: " Earn net rental income per Block", image: avatarH3 },
    { digit: "4", name: "Sell your Blocks to earn any capital returns", image: avatarH4 },
  ];

  useEffect(() => {
    // Check if the URL has a hash and the target element exists
    if (window.location.hash && howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  const handleDownload = (documentName: string) => {
    const pdfDoc = new jsPDF();
    // Replace 'Your PDF Content' with the actual content of your PDF
    const pdfContent = 'Your PDF Content';

    // Add text to the PDF document
    pdfDoc.text(pdfContent, 10, 10);

    const blob = pdfDoc.output('blob');

    // Create an Object URL from the Blob
    const url = URL.createObjectURL(blob);

    // Open the Blob URL in a new tab
    window.open(url, '_blank');

    // Release the Object URL after use
    URL.revokeObjectURL(url);
  };
  return (
    <section id='howitworks' ref={howItWorksRef}>
      <div className='max-w-6xl px-5 mx-auto text-center mt-8 md:mt-0'>
        <h2 className='mb-2 text-center lg:max-w-xl lg:mx-auto'>
          How It Works?
        </h2>
        <p className='p-large'>A Block represents a fraction of a property</p>
        <div className=' hidden md:flex flex-col md:mt-8 mt-2 md:flex-row md:space-x-6'>
          {items.map((HW) => (
            <div key={HW.digit} className='flex flex-col items-center p-6 space-y-6 rounded-lg md:w-1/2 lg:w-1/4'>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primaryBtn">
                <span className="text-white">{HW.digit}</span>
              </div>
              <img src={HW.image} className='w-16 -mt-14' alt='' />
              <p className='text-sm text-darkGrayishBlue'>
                {HW.name}
              </p>
            </div>
          ))}
        </div>
        <div className='md:hidden'>
          <div className="timeline">
            <div className="outer">
              {items.map((HW, index) => (
                <div key={HW.digit} className="card">
                  <div className="info" data-number={HW.digit}>
                    <img src={HW.image} className='w-16' alt='' />
                    <p className='text-xl text-darkGrayishBlue'>
                      {HW.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='pb-8'>
        {/* <Link
                to='#'
                className='btn-solid-lg'>
                <span className='hidden md:flex'>Learn How it Works</span>
                <span className='md:hidden'>How it Works</span>
              </Link> */}
          <p className='text-sm text-darkGrayishBlue pt-4'>
            Consider whether investing in Blocks is right for you by reading the <a className='font-semibold ml-1 text-indigo-600 hover:text-gray-500 cursor-pointer' onClick={() => handleDownload("privacy_policy")} >PDS</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;