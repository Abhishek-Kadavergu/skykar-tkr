import { FaStar, FaTag, FaCheckCircle } from 'react-icons/fa';

function ProductCard({ product, rank }) {
  const isTopPick = rank === 1;

  return (
    <div className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-transform hover:scale-105 ${
      isTopPick ? 'border-slate-800 border-2' : 'border-gray-200'
    }`}>
      {isTopPick && (
        <div className="bg-slate-800 text-white text-center py-2 font-semibold text-sm">
          Top Pick for You
        </div>
      )}
      
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-lg px-4 py-2 shadow-md border border-gray-200">
          <span className="text-2xl font-bold text-slate-900">{product.matchScore}%</span>
          <span className="text-xs text-slate-600 block">Match</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h3>
            <p className="text-sm text-slate-500">{product.brand}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">${product.price}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span className="font-semibold text-slate-800">{product.rating}</span>
            <span className="text-sm text-slate-500">/5</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FaTag />
            <span>{product.category}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FaCheckCircle className="text-green-600" />
            <span className="text-sm font-semibold text-slate-800">{product.featureType}</span>
          </div>
          <div className="text-sm text-slate-600">
            Feature Score: {product.featureScore}/10
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">Match Breakdown</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Price Match:</span>
              <span className="font-semibold">{product.breakdown.priceScore}%</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Feature Match:</span>
              <span className="font-semibold">{product.breakdown.featureScore}%</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Brand Match:</span>
              <span className="font-semibold">{product.breakdown.brandScore}%</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Rating Score:</span>
              <span className="font-semibold">{product.breakdown.ratingScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
