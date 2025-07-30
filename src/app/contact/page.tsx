"use client";

import Image from "next/image";
import contactimg from "../../../public/assets/images/contactimg.png";
import email from "../../../public/assets/images/email.png";
import map from "../../../public/assets/images/map.png";
import phone from "../../../public/assets/images/phone.png";
import ctabg from "../../../public/assets/images/ctabg.png";
import Link from "next/link";
import { useState } from "react";
import SeoHead from "../../components/SeoHead";
import PageWithSeo from "../../components/PageWithSeo";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
    <PageWithSeo page="contact">
      <main className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={contactimg}
              alt="Modern Home Interior"
              fill
              priority
              className="object-cover"
            />
          </div>

        
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center space-y-4">
            <h1 className="text-white text-4xl font-bold">Contact Us</h1>
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
              <ol className="text-white text-lg flex space-x-2">
                <li>
                  <Link href="/" className="">
                    Home
                  </Link>
                </li>
                <li>{">"}</li>
                <li className="">Contact</li>
              </ol>
            </nav>
          </div>
        </section>

        <div className="mt-6">
          <div className="grid sm:grid-cols-2 items-start gap-12 p-8 mx-auto max-w-5xl">
            <div>
              <h1 className="text-slate-900 text-3xl font-semibold">
                Connect with us
              </h1>

              <div className="mt-4 rounded-xl border border-gray-200 p-3">
                <ul className="">
                  <li className="flex items-center">
                    <div className="bg-[#e6e6e6cf] h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                      <Image src={email} alt="email" />
                    </div>
                    <a href="javascript:void(0)" className="text-sm ml-4">
                      <small className="block text-xl text-black">
                        Write to Us
                      </small>
                      <span className="text-gray-500 text-md font-medium">
                        contact@realtraspaces.com
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-4 rounded-xl border border-gray-200 p-3">
                <ul className="">
                  <li className="flex items-center">
                    <div className="bg-[#e6e6e6cf] h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                      <Image src={phone} alt="email" />
                    </div>
                    <a href="javascript:void(0)" className="text-sm ml-4 ">
                      <small className="block text-xl text-black">Phones</small>
                      <span className="text-gray-500 text-md font-medium">
                        +91 91456 88167  | +91 91456 88167
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-4 rounded-xl border border-gray-200 p-3">
                <ul className="">
                  <li className="flex items-center">
                    <div className="bg-[#e6e6e6cf] h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                      <Image src={map} alt="email" />
                    </div>
                    <a href="javascript:void(0)" className="text-sm ml-4">
                      <small className="block text-xl text-black">
                        Head office
                      </small>
                      <span className="text-gray-500 text-md font-medium">
                      Mickey Square, Road No. 17, MIDC, Andheri East, 400069
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-4">
                <h2 className="text-slate-900 text-base font-semibold">
                  Socials
                </h2>
                <ul className="flex mt-4 space-x-4">
                  <li className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <a href="javascript:void(0)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="#000"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M6.812 13.937H9.33v9.312c0 .414.335.75.75.75l4.007.001a.75.75 0 0 0 .75-.75v-9.312h2.387a.75.75 0 0 0 .744-.657l.498-4a.75.75 0 0 0-.744-.843h-2.885c.113-2.471-.435-3.202 1.172-3.202 1.088-.13 2.804.421 2.804-.75V.909a.75.75 0 0 0-.648-.743A26.926 26.926 0 0 0 15.071 0c-7.01 0-5.567 7.772-5.74 8.437H6.812a.75.75 0 0 0-.75.75v4c0 .414.336.75.75.75zm.75-3.999h2.518a.75.75 0 0 0 .75-.75V6.037c0-2.883 1.545-4.536 4.24-4.536.878 0 1.686.043 2.242.087v2.149c-.402.205-3.976-.884-3.976 2.697v2.755c0 .414.336.75.75.75h2.786l-.312 2.5h-2.474a.75.75 0 0 0-.75.75V22.5h-2.505v-9.312a.75.75 0 0 0-.75-.75H7.562z"
                          data-original="#000000"
                        />
                      </svg>
                    </a>
                  </li>
                  <li className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <a href="javascript:void(0)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="#000"
                        viewBox="0 0 511 512"
                      >
                        <path
                          d="M111.898 160.664H15.5c-8.285 0-15 6.719-15 15V497c0 8.285 6.715 15 15 15h96.398c8.286 0 15-6.715 15-15V175.664c0-8.281-6.714-15-15-15zM96.898 482H30.5V190.664h66.398zM63.703 0C28.852 0 .5 28.352.5 63.195c0 34.852 28.352 63.2 63.203 63.2 34.848 0 63.195-28.352 63.195-63.2C126.898 28.352 98.551 0 63.703 0zm0 96.395c-18.308 0-33.203-14.891-33.203-33.2C30.5 44.891 45.395 30 63.703 30c18.305 0 33.195 14.89 33.195 33.195 0 18.309-14.89 33.2-33.195 33.2zm289.207 62.148c-22.8 0-45.273 5.496-65.398 15.777-.684-7.652-7.11-13.656-14.942-13.656h-96.406c-8.281 0-15 6.719-15 15V497c0 8.285 6.719 15 15 15h96.406c8.285 0 15-6.715 15-15V320.266c0-22.735 18.5-41.23 41.235-41.23 22.734 0 41.226 18.495 41.226 41.23V497c0 8.285 6.719 15 15 15h96.403c8.285 0 15-6.715 15-15V302.066c0-79.14-64.383-143.523-143.524-143.523zM466.434 482h-66.399V320.266c0-39.278-31.953-71.23-71.226-71.23-39.282 0-71.239 31.952-71.239 71.23V482h-66.402V190.664h66.402v11.082c0 5.77 3.309 11.027 8.512 13.524a15.01 15.01 0 0 0 15.875-1.82c20.313-16.294 44.852-24.907 70.953-24.907 62.598 0 113.524 50.926 113.524 113.523zm0 0"
                          data-original="#000000"
                        />
                      </svg>
                    </a>
                  </li>
                  <li className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <a href="javascript:void(0)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="#000"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm0-1.8a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm5.85-.225a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0ZM12 4.8c-2.227 0-2.59.006-3.626.052-.706.034-1.18.128-1.618.299a2.59 2.59 0 0 0-.972.633 2.601 2.601 0 0 0-.634.972c-.17.44-.265.913-.298 1.618C4.805 9.367 4.8 9.714 4.8 12c0 2.227.006 2.59.052 3.626.034.705.128 1.18.298 1.617.153.392.333.674.632.972.303.303.585.484.972.633.445.172.918.267 1.62.3.993.047 1.34.052 3.626.052 2.227 0 2.59-.006 3.626-.052.704-.034 1.178-.128 1.617-.298.39-.152.674-.333.972-.632.304-.303.485-.585.634-.972.171-.444.266-.918.299-1.62.047-.993.052-1.34.052-3.626 0-2.227-.006-2.59-.052-3.626-.034-.704-.128-1.18-.299-1.618a2.619 2.619 0 0 0-.633-.972 2.595 2.595 0 0 0-.972-.634c-.44-.17-.914-.265-1.618-.298-.993-.047-1.34-.052-3.626-.052ZM12 3c2.445 0 2.75.009 3.71.054.958.045 1.61.195 2.185.419A4.388 4.388 0 0 1 19.49 4.51c.457.45.812.994 1.038 1.595.222.573.373 1.227.418 2.185.042.96.054 1.265.054 3.71 0 2.445-.009 2.75-.054 3.71-.045.958-.196 1.61-.419 2.185a4.395 4.395 0 0 1-1.037 1.595 4.44 4.44 0 0 1-1.595 1.038c-.573.222-1.227.373-2.185.418-.96.042-1.265.054-3.71.054-2.445 0-2.75-.009-3.71-.054-.958-.045-1.61-.196-2.185-.419A4.402 4.402 0 0 1 4.51 19.49a4.414 4.414 0 0 1-1.037-1.595c-.224-.573-.374-1.227-.419-2.185C3.012 14.75 3 14.445 3 12c0-2.445.009-2.75.054-3.71s.195-1.61.419-2.185A4.392 4.392 0 0 1 4.51 4.51c.45-.458.994-.812 1.595-1.037.574-.224 1.226-.374 2.185-.419C9.25 3.012 9.555 3 12 3Z"></path>
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full text-slate-900 rounded-md py-2.5 px-4 border text-sm outline-none focus:border-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full text-slate-900 rounded-md py-2.5 px-4 border text-sm outline-none focus:border-blue-500"
              />
              <div className="space-y-2">
               
                <div className="relative">
                  <input
                    type="tel"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers and restrict to 10 digits
                      if (/^\d{0,10}$/.test(value)) {
                        handleInputChange(e);
                      }
                    }}
                    required
                    maxLength={10}
                    className="w-full text-slate-900 rounded-md py-2.5 px-4 border text-sm outline-none focus:border-blue-500"
                     placeholder="phone number"
                  />
                </div>
              </div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="w-full text-slate-900 rounded-md py-2.5 px-4 border text-sm outline-none focus:border-blue-500"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message"
                rows={6}
                className="w-full text-slate-900 rounded-md px-4 border text-sm pt-2.5 outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="text-white bg-black hover:bg-white hover:text-black border border-black rounded-full text-[15px] font-medium px-4 py-2 w-full !mt-6"
              >
                Send a Message
              </button>
            </form>
          </div>
        </div>

        {/* CTA */}
        <div className="relative bg-white p-8 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={ctabg}
              alt="Modern Home Interior"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Content on top of background */}
          <div className="relative z-10 max-w-xl mx-auto text-center">
            <h2 className="text-black text-4xl  mb-2">
              Not sure where to start?
            </h2>
            <h2 className="text-gray-500 text-4xl  ">We’re here to help!</h2>

            <div className="mt-6 mb-8">
              <p className="text-gray-500 text-base">
                Speak with our property specialists and get personalized
                guidance for your next move.Book a call now and let’s get
                started.
              </p>
            </div>
            <div className="flex max-sm:flex-col justify-center gap-6 max-w-sm mx-auto ">
              <Link href={'/contact'}>
              <button
                type="button"
                className="text-slate-900 min-w-[140px] rounded px-4 py-2.5 text-sm tracking-wider font-medium outline-none border border-gray-600 hover:bg-black hover:text-white transition-all duration-300"
              >
                Book Now
              </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      </PageWithSeo>
    </>
  );
}
