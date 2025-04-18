import Image from 'next/image';
import latestpropertytype from '../../../public/assets/images/latestpropertytype.svg'

const Blogs = () => {
  return (

    <>
    <section className="py-16 bg-gray-50 flex justify-center items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-gray-900">Insights and Updates</h2>
        </div>
        <div className='items-end justify-end flex mb-12'>
        <button className=' text-white bg-black px-2 py-2 rounded-lg'>Read More</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Blog Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={latestpropertytype}
                alt='blog'
                className="object-cover p-3 rounded-2xl h-[220px] transform group-hover:scale-110 transition-transform duration-500"
              />
              {/* Property Type and Location - Positioned absolutely on top of image */}
              <div className="absolute top-4 right-0 px-4 flex justify-between">

                <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                  News
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Luxury Properties</span>
                <span className="text-sm text-gray-500 ml-2">April 14, 2024</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Waterfront Luxury Villas: The Ultimate Investment
              </h3>
              <p className="text-gray-600 mb-4">
                Explore the exclusive world of waterfront properties and why they continue to be one of the most secure real estate investments in 2024.
              </p>

            </div>
          </div>

          {/* Blog Card 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative overflow-hidden rounded-lg">

              <Image
                src={latestpropertytype}
                alt='blog'
                className="object-cover p-3 rounded-2xl h-[220px] transform group-hover:scale-110 transition-transform duration-500"
              />
              {/* Property Type and Location - Positioned absolutely on top of image */}
              <div className="absolute top-4 right-0 px-4 flex justify-between">

                <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                  News
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Luxury Properties</span>
                <span className="text-sm text-gray-500 ml-2">April 14, 2024</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Waterfront Luxury Villas: The Ultimate Investment
              </h3>
              <p className="text-gray-600 mb-4">
                Explore the exclusive world of waterfront properties and why they continue to be one of the most secure real estate investments in 2024.
              </p>

            </div>
          </div>

          {/* Blog Card 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative overflow-hidden rounded-lg">

              <Image
                src={latestpropertytype}
                alt='blog'
                className="object-cover p-3 rounded-2xl h-[220px] transform group-hover:scale-110 transition-transform duration-500"
              />
              {/* Property Type and Location - Positioned absolutely on top of image */}
              <div className="absolute top-4 right-0 px-4 flex justify-between">

                <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                  Article
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Luxury Properties</span>
                <span className="text-sm text-gray-500 ml-2">April 14, 2024</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Waterfront Luxury Villas: The Ultimate Investment
              </h3>
              <p className="text-gray-600 mb-4">
                Explore the exclusive world of waterfront properties and why they continue to be one of the most secure real estate investments in 2024.
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>

    <div className=" bg-white justify-center items-center max-w-7xl max-auto">
    <div className="text-center flex space-x-2">
          <h2 className="text-3xl font-bold text-gray-900 ">FAQ</h2>
          <h2 className="text-3xl font-bold text-gray-500">Frequently Asked Questions</h2>
        </div>
  <details className="group [&_summary::-webkit-details-marker]:hidden" open>
    <summary
      className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-gray-50 p-4 text-gray-900"
    >
      <h2 className="text-lg font-medium">Lorem ipsum dolor sit amet consectetur adipisicing?</h2>

      <svg
        className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <p className="px-4 pt-4 text-gray-900">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa in,
      recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis explicabo
      consequuntur distinctio corporis earum similique!
    </p>
  </details>

  <details className="group [&_summary::-webkit-details-marker]:hidden">
    <summary
      className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-gray-50 p-4 text-gray-900"
    >
      <h2 className="text-lg font-medium">Lorem ipsum dolor sit amet consectetur adipisicing?</h2>

      <svg
        className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <p className="px-4 pt-4 text-gray-900">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa in,
      recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis explicabo
      consequuntur distinctio corporis earum similique!
    </p>
  </details>

  <details className="group [&_summary::-webkit-details-marker]:hidden">
    <summary
      className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-gray-50 p-4 text-gray-900"
    >
      <h2 className="text-lg font-medium">Lorem ipsum dolor sit amet consectetur adipisicing?</h2>

      <svg
        className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <p className="px-4 pt-4 text-gray-900">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa in,
      recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis explicabo
      consequuntur distinctio corporis earum similique!
    </p>
  </details>
</div>
    </>
  );
};

export default Blogs; 