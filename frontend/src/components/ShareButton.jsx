import { useState } from 'react';
import { FaShare, FaWhatsapp, FaEnvelope, FaLink, FaFacebook, FaTwitter } from 'react-icons/fa';

/**
 * Share Component - Feature #4
 * Share recommendations via WhatsApp, Email, Copy Link, Social Media
 */
function ShareButton({ product, recommendations = null, small = false }) {
  const [showMenu, setShowMenu] = useState(false);

  const generateShareText = () => {
    if (recommendations && recommendations.length > 0) {
      // Share multiple recommendations
      const items = recommendations.slice(0, 5).map(r => 
        `• ${r.name} - ₹${r.price} (⭐${r.rating}/5)`
      ).join('\n');
      return `Check out these amazing recommendations from AalayaX:\n\n${items}\n\nFind yours at: ${window.location.origin}`;
    } else if (product) {
      // Share single product
      return `Check out ${product.name} on AalayaX!\n\nPrice: ₹${product.price}\nRating: ⭐${product.rating}/5\n\n${product.description || ''}\n\nFind it at: ${window.location.origin}`;
    }
    return `Check out AalayaX for personalized recommendations! ${window.location.origin}`;
  };

  const generateShareUrl = () => {
    return window.location.href;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowMenu(false);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(product ? `Check out ${product.name}` : 'AalayaX Recommendations');
    const body = encodeURIComponent(generateShareText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareUrl());
      alert('Link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = generateShareUrl();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Link copied to clipboard!');
    }
    setShowMenu(false);
  };

  const handleFacebook = () => {
    const url = encodeURIComponent(generateShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowMenu(false);
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(generateShareText());
    const url = encodeURIComponent(generateShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setShowMenu(false);
  };

  const buttonClass = small
    ? "p-2 bg-gray-100 text-slate-700 rounded-md hover:bg-gray-200 transition"
    : "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold";

  return (
    <div className="relative">
      <button onClick={() => setShowMenu(!showMenu)} className={buttonClass} title="Share">
        <FaShare className={small ? "" : "text-sm"} />
        {!small && "Share"}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-2">
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-md transition"
              >
                <FaWhatsapp className="text-green-500 text-xl" />
                <span className="font-medium text-slate-700">WhatsApp</span>
              </button>
              
              <button
                onClick={handleEmail}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-md transition"
              >
                <FaEnvelope className="text-blue-500 text-xl" />
                <span className="font-medium text-slate-700">Email</span>
              </button>
              
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-md transition"
              >
                <FaLink className="text-purple-500 text-xl" />
                <span className="font-medium text-slate-700">Copy Link</span>
              </button>

              <button
                onClick={handleFacebook}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-md transition"
              >
                <FaFacebook className="text-blue-600 text-xl" />
                <span className="font-medium text-slate-700">Facebook</span>
              </button>

              <button
                onClick={handleTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-md transition"
              >
                <FaTwitter className="text-sky-500 text-xl" />
                <span className="font-medium text-slate-700">Twitter</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ShareButton;
