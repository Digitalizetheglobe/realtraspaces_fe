// pages/privacy-policy.js
import Head from 'next/head';
import Image from 'next/image';
export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | RealtraSpaces</title>
        <meta name="description" content="Privacy Policy for RealtraSpaces" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <section className="relative ">
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/assets/signin.jpeg"
                    alt="Luxury Property" 
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
              <div className="relative z-10 flex items-center justify-center py-20 px-4">
    <div className="text-center max-w-3xl mx-auto text-white">
      <p
        className="uppercase tracking-wider mb-4"
        style={{
          fontSize: '18px',
          fontFamily: 'Lato',
          letterSpacing: '0.5px'
        }}
      >
        Our Privacy Policy
      </p>

      <h2
        className=" mb-6 font-[400] text-[48px] leading-[140%] tracking-[1px] font-[Ivy Mode] max-sm:text-[36px]"
        style={{
          fontFamily: 'Ivy Mode',
          fontSize: '48px',
          letterSpacing: '1px'
        }}
      >
        Committed to Protecting Your Data & Trust
      </h2>

      <p
        className="tracking-wider  mb-4"
        style={{
          fontSize: '20px',
          fontFamily: 'Lato',
          letterSpacing: '0.5px'
        }}
      >
        Your privacy is important to us. At RealtraSpaces, we ensure your
        personal information is secure and used responsibly. Learn how we collect,
        store, and protect your data while delivering exceptional real estate services.
      </p>
    </div>
  </div>
</section>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        

          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">
                This Privacy Policy outlines how RealtraSpaces ("we", "our", or "us") 
                collects, uses, and safeguards your information via https://realtraspaces.com. 
                By using our services, you agree to this Privacy Policy and our Terms of Use, 
                which are incorporated herein by reference. Please read both carefully. If you do not agree, 
                kindly refrain from using our services.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect personal data such as name, contact information, property preferences, and usage behavior.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                How We Use Your Information
              </h3>
              <p className="text-gray-700 mb-2">
                This information helps us:
              </p>
              <ul className="list-disc pl-5 mb-6 text-gray-700">
                <li className="mb-2">Customize our services to your needs</li>
                <li className="mb-2">Keep you connected across platforms and informed about residential real estate updates</li>
                <li className="mb-2">Connect you with relevant parties for buying, selling, renting, or financing property, and facilitate efficient communication</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Information Sharing
              </h2>
              <p className="text-gray-700 mb-6">
                Your data may be shared with real estate developers, service providers, or financial partners under strict confidentiality. 
                We do not sell your data. We use cookies and analytics tools to improve our website experience.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Data Protection
              </h2>
              <p className="text-gray-700 mb-6">
                We protect your data with appropriate security measures. You may request access to or deletion of your data by contacting us.
              </p>

              <hr className="my-8 border-gray-200" />

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-700">
                For questions, contact <a href="mailto:info@realtraspaces.com" className="text-blue-600 hover:text-blue-800 hover:underline">info@realtraspaces.com</a> or call +91 9730156575.
              </p>
            </div>
          </div>
          
         
        </div>
      </div>
    </>
  );
}