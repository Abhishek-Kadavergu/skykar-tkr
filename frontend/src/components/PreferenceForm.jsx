import { useState } from 'react';
import { FaShoppingBag, FaLaptop, FaMusic, FaPalette, FaDollarSign, FaStar } from 'react-icons/fa';

const CATEGORIES = [
  { value: 'Shoes', label: 'Shoes', icon: FaShoppingBag },
  { value: 'Tech', label: 'Tech', icon: FaLaptop },
  { value: 'Music', label: 'Music', icon: FaMusic },
  { value: 'Hobby', label: 'Hobbies', icon: FaPalette }
];

const BRANDS = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony', 'Fender', 'Yamaha', 'DJI', 'GoPro', 'LEGO'];

const FEATURE_TYPES = [
  'Comfort', 'Performance', 'Style', 'Durability', 
  'Sound Quality', 'Noise Cancellation', 'Productivity', 
  'Professional', 'Beginner Friendly', 'Photography', 
  'Adventure', 'Digital Art', 'Creative'
];

function PreferenceForm({ onSubmit, user }) {
  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState(200);
  const [brandPreference, setBrandPreference] = useState('');
  const [featurePreference, setFeaturePreference] = useState('');

  const toggleInterest = (category) => {
    setInterests(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (interests.length === 0) {
      alert('Please select at least one interest category');
      return;
    }
    if (!featurePreference) {
      alert('Please select a feature preference');
      return;
    }

    onSubmit({
      interests,
      budget,
      brandPreference: brandPreference || 'Any',
      featurePreference
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Tell Us Your Preferences</h2>
            <p className="text-slate-600">
              Help us recommend the perfect products for you, {user?.email?.split('@')[0]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Interests Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                What are you interested in?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleInterest(value)}
                    className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
                      interests.includes(value)
                        ? 'border-slate-800 bg-slate-50 text-slate-900'
                        : 'border-gray-300 hover:border-gray-400 text-slate-600'
                    }`}
                  >
                    <Icon className="text-3xl mb-2" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Slider */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                <FaDollarSign className="inline mr-2" />
                What's your budget?
              </label>
              <div className="space-y-4">
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
                <div className="text-center">
                  <span className="text-3xl font-bold text-slate-900">${budget}</span>
                </div>
              </div>
            </div>

            {/* Brand Preference */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Preferred Brand (Optional)
              </label>
              <select
                value={brandPreference}
                onChange={(e) => setBrandPreference(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">Any Brand</option>
                {BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Feature Preference */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                <FaStar className="inline mr-2" />
                What feature matters most?
              </label>
              <select
                value={featurePreference}
                onChange={(e) => setFeaturePreference(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">Select a feature</option>
                {FEATURE_TYPES.map(feature => (
                  <option key={feature} value={feature}>{feature}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 text-white font-semibold py-4 rounded-md hover:bg-slate-900 transition-all shadow-sm"
            >
              Get Recommendations
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PreferenceForm;
