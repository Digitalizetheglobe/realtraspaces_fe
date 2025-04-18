"use client";
import Image from "next/image";
import Blogs from "../blogs/page";

export default function Testimonial () {
    return (
      <>
      <div className="py-10 w-full mx-auto bg-white">
  <div className="max-w-2xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-slate-900">
    What our clients are saying
    </h2>
   
  </div>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-lg:gap-12 max-md:justify-center text-center max-lg:max-w-3xl max-md:max-w-lg mx-auto mt-16">
    <div>
      <div className="flex flex-col items-center">
        <img
          src="https://readymadeui.com/team-2.webp"
          className="w-24 h-24 rounded-full border-2 border-purple-600"
        />
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-slate-900">John Doe</h4>
        </div>
      </div>
      <div className="flex justify-center space-x-1 mt-2.5">
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 fill-[#CED5D8]"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 fill-[#CED5D8]"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
      </div>
      <div className="mt-6">
        <p className="text-sm leading-relaxed text-slate-900 font-normal">
          The service was amazing. I never had to wait that long for my food.
          The staff was friendly and attentive, and the delivery was
          impressively prompt.
        </p>
      </div>
    </div>
    <div>
      <div className="flex flex-col items-center">
        <img
          src="https://readymadeui.com/team-3.webp"
          className="w-24 h-24 rounded-full border-2 border-purple-600"
        />
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-slate-900">Mark Adair</h4>
        </div>
      </div>
      <div className="flex justify-center space-x-1 mt-2.5">
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
      </div>
      <div className="mt-6">
        <p className="text-sm leading-relaxed text-slate-900 font-normal">
          The service was amazing. I never had to wait that long for my food.
          The staff was friendly and attentive, and the delivery was
          impressively prompt.
        </p>
      </div>
    </div>
    <div>
      <div className="flex flex-col items-center">
        <img
          src="https://readymadeui.com/team-4.webp"
          className="w-24 h-24 rounded-full border-2 border-purple-600"
        />
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-slate-900">
            Simon Konecki
          </h4>
        </div>
      </div>
      <div className="flex justify-center space-x-1 mt-2.5">
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 h-4 fill-purple-600"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
        <svg
          className="w-4 fill-[#CED5D8]"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
      </div>
      <div className="mt-6">
        <p className="text-sm leading-relaxed text-slate-900 font-normal">
          The service was amazing. I never had to wait that long for my food.
          The staff was friendly and attentive, and the delivery was
          impressively prompt.
        </p>
      </div>
    </div>
  </div>
</div>

<Blogs/>
      </>
    )
}