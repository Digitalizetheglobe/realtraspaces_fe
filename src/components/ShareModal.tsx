import React from "react";
import Image from "next/image";
import share from "../../public/assets/Frame 29.png";
import whatsapp from "../../public/assets/WhatsApp.png";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  property: any;
  getPropertyUrl: (property: any) => string;
};

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, property, getPropertyUrl }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Image src={share} alt="Share" width={24} height={24} />
          Share Property
        </h3>
        <div className="flex flex-col gap-2">
          <a
            href={`https://wa.me/7039311539?text=${encodeURIComponent(property.title || 'Check out this property!')}%20${encodeURIComponent(getPropertyUrl(property))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-green-600"
            onClick={e => e.stopPropagation()}
          >
            <Image src={whatsapp} alt="WhatsApp" width={20} height={20} />
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getPropertyUrl(property))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-blue-600"
            onClick={e => e.stopPropagation()}
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(property.title || 'Check out this property!')}&url=${encodeURIComponent(getPropertyUrl(property))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-blue-400"
            onClick={e => e.stopPropagation()}
          >
            Twitter
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(getPropertyUrl(property))}&title=${encodeURIComponent(property.title || 'Property')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-blue-700"
            onClick={e => e.stopPropagation()}
          >
            LinkedIn
          </a>
          {typeof navigator !== 'undefined' && navigator.share ? (
            <button
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700 w-full text-left"
              onClick={e => {
                e.stopPropagation();
                const shareData = {
                  title: property.title || "Property",
                  text: `Check out this property: ${property.title || "Property"} in ${property.address?.city || ""}`,
                  url: getPropertyUrl(property),
                };
                navigator.share(shareData).then(onClose).catch(onClose);
              }}
            >
              Native Share
            </button>
          ) : (
            <div className="px-3 py-2 text-xs text-red-500">
              Native sharing is only available on supported browsers and devices.
            </div>
          )}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700 w-full text-left"
            onClick={e => {
              e.stopPropagation();
              navigator.clipboard.writeText(getPropertyUrl(property));
              onClose();
              alert('Link copied to clipboard!');
            }}
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal; 