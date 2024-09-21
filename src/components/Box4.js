import React from 'react';
import './css/Box4.css'; // Import the global CSS file

export const Box4 = () => {
  return (
    <div className='box'>
      <div className='group'>
        <p className='our-MVP-minimum'>
          <span className='text-wrapper'>
            Our MVP (minimum viable product) is{' '}
          </span>
          <span className='span'>
            live now for free!!!
            <br />
          </span>
          <span className='text-wrapper'>
            You can view fresh &amp; historical earnings transcripts for xxx
            companies
          </span>
        </p>
        <div className='frame'>
          <div className='group-wrapper'>
            <div className='overlap-group-wrapper'>
              <div className='overlap-group'>
                <p className='div'>AI Chat on Company Results</p>
                <div className='label-wrapper'>
                  <div className='label'>
                    <p className='p'>
                      with sources linked to <br />
                      original documents
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='overlap-wrapper'>
            <div className='overlap-group'>
              <div className='div'>AI Summaries</div>
              <div className='label-wrapper'>
                <div className='label'>
                  <p className='p'>
                    updated guidance; positives; negatives; Q&amp;A
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='div-wrapper'>
            <div className='overlap-group'>
              <div className='div'>AI Analysis</div>
              <div className='label-wrapper'>
                <div className='label'>
                  <p className='p'>
                    smart search for related key words; sentiment highlights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // const features = [
  //   {
  //     title: 'AI Chat on Company Results',
  //     description: 'with sources linked to original documents',
  //   },
  //   {
  //     title: 'AI Summaries',
  //     description: 'updated guidance; positives; negatives; Q&A',
  //   },
  //   {
  //     title: 'AI Analysis',
  //     description: 'smart search for related key words; sentiment highlights',
  //   },
  // ];

  // const ProductFeature = ({ title, description }) => (
  //   <div className='flex flex-col px-4 my-4 rounded-lg shadow-lg bg-white'>
  //     <h3 className='text-lg font-bold text-violet-600 text-center'>{title}</h3>
  //     <p className='mt-2 text-base font-semibold text-stone-500 text-center'>
  //       {description}
  //     </p>
  //   </div>
  // );

  // const Box4 = () => {
  //   return (
  //     <main className='flex flex-col items-center text-center max-w-[834px] mx-auto box4-container'>
  //       <h2 className='self-center text-2xl text-black mb-6'>
  //         Our MVP (minimum viable product) is{' '}
  //         <span className='font-bold text-violet-600'>live now for free!!!</span>
  //         <br />
  //         You can view fresh & historical earnings transcripts for xxx companies
  //       </h2>
  //       <section className='flex flex-wrap justify-center gap-5 items-center mt-7'>
  //         {features.map((feature, index) => (
  //           <ProductFeature
  //             key={index}
  //             title={feature.title}
  //             description={feature.description}
  //           />
  //         ))}
  //       </section>
  //     </main>
  //   );
  // };
};
export default Box4;
