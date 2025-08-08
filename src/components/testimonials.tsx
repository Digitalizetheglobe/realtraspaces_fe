'use client';

import Image from 'next/image';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Mehwish',
      image: '/images/testimonial1.jpg', // replace with actual image path
      text: 'Compliment interested discretion estimating on stimulated apartments oh.',
    },
    {
      name: 'Elizabeth Jeff',
      image: '/images/testimonial2.jpg',
      text: 'Dear so sing when in find road of call. As distrusts behaviour abilities defective is.',
      highlight: true,
    },
    {
      name: 'Emily Thomas',
      image: '/images/testimonial3.jpg',
      text: 'Never at water me might. On formed merits hunted unable merely by mr whence or.',
    },
  ];

  return (
    <section className="bg-[#F5F6F7] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Text Section */}
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-4">
            What Our Customers Says
          </h2>
          <p className="text-gray-500 mb-6">
            Relation so in confined smallest children unpacked delicate. Why sir end believe
            uncivil respect. Always get adieus nature day course for common.
          </p>
          <button className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#A24EFF] to-[#FF6B6B] shadow-md hover:opacity-90 transition">
            View More
          </button>
        </div>

        {/* Right Testimonials */}
        <div className="flex flex-col gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition ${
                item.highlight ? 'border-l-4 border-[#A24EFF]' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#1C1C1C]">{item.name}</h4>
                <p className="text-gray-500 text-sm mt-1">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}