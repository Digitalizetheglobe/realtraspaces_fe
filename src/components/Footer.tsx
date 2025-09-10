import footerimg from '../../public/assets/images/footerimg1.png'
import Link from 'next/link';
const Footer = () => {
  // const menuItems = [
  //   { name: 'Home', href: '/' },
  //   { name: 'About', href: '/about' },
  //   { name: 'Services', href: '/services' },
  //   { name: 'Contact', href: '/contact' },
  // ];

  return (
    <footer  className="bg-no-repeat bg-right-bottom bg-black text-white"
    style={{
      backgroundImage: `url(${footerimg.src})`,
    }}
  >
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-teal-600 dark:text-teal-300">
         
            </div>

            <p className="mt-4 max-w-xs text-gray-200 dark:text-gray-400">
            Discover the best real estate opportunities in Mumbai with Realtra Spaces. Explore properties, connect with developers, and invest smartly. </p>

            
              

            <div>
              <p className="font-medium text-gray-200 dark:text-white">Quick Links</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link href="/" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                    About
                  </Link>
                </li>

                <li>
                  <Link href="/properties" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                  Properties
                  </Link>
                </li>

                <li>
                  <Link href="/blogs" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                    Career
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-gray-200 dark:text-white">Helpful Links</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link href="#" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                    Contact
                  </Link>
                </li>

                <li>
                  <Link href="#" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                    FAQs
                  </Link>
                </li>
                 <li>
                  <Link href="/privacy-policy" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-condition" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                    Terms and Condition
                  </Link>
                </li>
                <li>
                  <Link href="/irr-calculator" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                  IRR Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/lrd-calculator" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                  LRD Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/roi-calculator" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                  ROI Calculator
                  </Link>
                </li>
                {/* <li>
                  <a href="#" className="text-gray-200 transition hover:opacity-75 dark:text-gray-200">
                    Live Chat
                  </a>
                </li> */}
              </ul>
            </div>

            <div>
              <p className="font-medium text-gray-200 dark:text-white">Contact Us</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <svg className="size-5 mt-0.5 text-gray-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <Link 
                    href="https://maps.google.com/?q=Mickey+Square,+Road+No.+17,+MIDC,+Andheri+East,+Mumbai+Maharashtra+400069" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-200 dark:text-gray-200 hover:text-teal-400 transition-colors"
                  >
                    Mickey Square, Road No. 17, MIDC, Andheri East,<br />
                    Mumbai 400069
                  </Link>
                </li>

                <li className="flex items-center gap-3">
                  <svg className="size-5 text-gray-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <Link 
                    href="tel:+917039311539" 
                    className="text-gray-200 dark:text-gray-200 hover:text-teal-400 transition-colors"
                  >
                    +91 70393 1539
                  </Link>
                </li>

             

                <li className="flex items-center gap-3">
                  <svg className="size-5 text-gray-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <Link 
                    href="tel:+917039311539" 
                    className="text-gray-200 dark:text-gray-200 hover:text-teal-400 transition-colors"
                  >
                    +91 70393 1539
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="size-5 text-gray-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <Link
                    href="mailto:contact@realtraspaces.com" 
                    className="text-gray-200 dark:text-gray-200 hover:text-teal-400 transition-colors"
                  >
                    contact@realtraspaces.com
                  </Link>
                </li>
              </ul>
           
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-200 dark:text-gray-400">
            &copy; 2025. Realtraspaces. All rights reserved.
          </p>
          {/* <Image src={footerimg} alt='footer' className='items-end justify-end w-74 right-0' /> */}
        </div>

      </div>
    </footer>
  );
};

export default Footer; 