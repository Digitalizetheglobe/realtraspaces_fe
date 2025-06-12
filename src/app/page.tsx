import Image from "next/image";
import home from '../../public/assets/hero.jpg'
import Latestpropertytype from "./latestpropertytype/page";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <section className="relative w-full h-[420px]">
          <div className="absolute inset-0">
            <Image
              src={home}
              alt="Modern Home Interior"
              fill
              priority
              className="object-cover"
            />
          </div>
          
          {/* Top Navigation */}
          <div className="relative flex justify-between items-center p-6">
            <div className="text-white font-bold text-xl">Q</div>
            <div className="flex gap-8">
              <button className="text-white">LIST PROPERTY</button>
              <button className="text-white">SIGN IN</button>
            </div>
          </div>

          {/* Search Bar Container */}
          {/* <div className="relative flex flex-col items-center mt-16">
            <div className="mb-4">
              <select className="bg-transparent text-white border-0 focus:ring-0">
                <option>Select search type</option>
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </div>
            
            <div 
              className="w-[741px] h-[62px] bg-white rounded-[98px] border border-gray-300 flex items-center px-8 py-2 gap-2"
              style={{ marginTop: '298px', marginLeft: '410px' }}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search" 
                className="flex-grow border-0 focus:ring-0 focus:outline-none" 
              />
            </div>
          </div> */}
        </section>

        <Latestpropertytype />
      </main>
    </>
  );
}