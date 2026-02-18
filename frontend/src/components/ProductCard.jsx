import { FaStar, FaTag, FaCheckCircle } from 'react-icons/fa';
import Image360Viewer from './Image360Viewer';

function ProductCard({ product, rank }) {
  const isTopPick = rank === 1;

  // Check if product has multiple images for 360 view
  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <div className={`premium-card overflow-hidden group h-full flex flex-col relative ${isTopPick ? 'ring-2 ring-slate-900 dark:ring-white scale-[1.02]' : ''}`}>
      {isTopPick && (
        <div className="bg-slate-900 dark:bg-white text-white dark:text-black text-center py-1.5 font-bold text-xs uppercase tracking-widest">
          Top Pick
        </div>
      )}

      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800">
        {hasMultipleImages ? (
          <div className="h-full w-full">
            <Image360Viewer
              images={product.images}
              title={product.name}
            />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        )}

        {/* Match Percentage Badge - Premium Style */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-slate-200 dark:border-slate-700 z-10 flex flex-col items-center">
          <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">{product.matchScore}%</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Match</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{product.brand}</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="flex text-slate-900 dark:text-white text-sm">
                <FaStar className="w-3.5 h-3.5" />
                <span className="ml-1 font-bold">{product.rating}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <FaTag className="w-3 h-3" /> {product.category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-slate-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Feature Score & Details - Cleaner */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-slate-700 dark:text-slate-300 w-4 h-4" />
              <span className="font-medium text-slate-700 dark:text-slate-300">{product.featureType}</span>
            </div>
            <span className="text-slate-500 dark:text-slate-500 font-mono text-xs">Score: {product.featureScore}/10</span>
          </div>

          {/* Detailed breakdown - only visible on hover or cleaner display */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-slate-900 dark:bg-white h-full" style={{ width: `${product.breakdown.priceScore}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <span>Price Match</span>
              <span>{product.breakdown.priceScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
