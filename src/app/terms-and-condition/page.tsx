'use client';

import { useState } from 'react';

export default function TermsAndConditions() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 my-10">
            Legal Information
          </h1>

          {/* Tab Navigation */}
          

          {/* Privacy Policy Tab */}
         

          {/* Terms & Conditions Tab */}
          {activeTab === 'terms' && (
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6 text-lg">
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  1. Service Description
                </h3>
                <p className="text-gray-700 mb-6">
                  RealtraSpaces is an online platform that connects property buyers, sellers, renters, and real estate agents. We provide property listings, agent profiles, and related real estate services to facilitate property transactions and information sharing. All services are subject to platform availability and applicable laws.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  2. Account Registration & Usage
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li><strong>Eligibility:</strong> Users must be at least 18 years old to create an account.</li>
                    <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</li>
                    <li><strong>Accurate Information:</strong> All information provided must be accurate and up to date.</li>
                    <li><strong>Prohibited Activities:</strong> No fraudulent, misleading, or illegal activities are permitted on the platform.</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  3. Property Listings & Content
                </h3>
                <p className="text-gray-700 mb-4">
                  Users may post property listings, reviews, and other content, subject to the following:
                </p>
                <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-2">
                  <li>All listings must be truthful, lawful, and not infringe on third-party rights.</li>
                  <li>RealtraSpaces reserves the right to remove any content that violates our policies.</li>
                  <li>Users are responsible for the accuracy and legality of their listings and content.</li>
                  <li>No posting of duplicate, misleading, or offensive content.</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  4. Intellectual Property & Usage Rights
                </h3>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700 mb-3">
                    <strong>User Rights:</strong> You retain ownership of content you post, but grant RealtraSpaces a license to display and promote it on the platform.
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Platform Rights:</strong> RealtraSpaces may use listings, images, and reviews for marketing and promotional purposes.
                  </p>
                  <p className="text-gray-700">
                    <strong>Restrictions:</strong> Content may not be copied, scraped, or used for competing services without permission.
                  </p>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  5. Liability & Disclaimers
                </h3>
                <p className="text-gray-700 mb-6">
                  RealtraSpaces acts as an intermediary and does not guarantee the accuracy of listings or the outcome of property transactions. We are not responsible for any loss, damage, or disputes arising from use of the platform. Users are advised to conduct their own due diligence before entering into any agreements.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  6. Privacy & Confidentiality
                </h3>
                <p className="text-gray-700 mb-6">
                  We respect your privacy and handle your personal information in accordance with our Privacy Policy. User data will not be shared with third parties except as required to provide services or by law.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  7. Service Availability & Modifications
                </h3>
                <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-2">
                  <li>Platform features and availability may change at any time without notice.</li>
                  <li>We strive for uptime but do not guarantee uninterrupted access.</li>
                  <li>We may update these terms periodically; continued use constitutes acceptance of changes.</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  8. Governing Law
                </h3>
                <p className="text-gray-700 mb-6">
                  These terms are governed by Indian law. Disputes will be resolved through arbitration in Maharashtra, India, in accordance with the Arbitration and Conciliation Act, 2015.
                </p>

                <div className="bg-red-50 p-6 rounded-lg mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Important Notice</h3>
                  <p className="text-gray-700">
                    By using RealtraSpaces, you acknowledge that you have read, understood, and agree to these terms and conditions. These terms may be updated periodically, and continued use of our services constitutes acceptance of any changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
        
        </div>
      </div>
    </>
  );
}