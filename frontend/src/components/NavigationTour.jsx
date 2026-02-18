import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimes, FaArrowLeft, FaArrowRight, FaRocket } from 'react-icons/fa';

/**
 * Navigation Tour Component - Interactive onboarding guide
 * Shows users how to use the platform with step-by-step instructions
 */

const tourSteps = [
  {
    id: 1,
    target: 'welcome',
    page: '/home',
    title: '👋 Welcome to AalayaX!',
    description: 'Your AI-powered shopping assistant. Let me show you around!',
    position: 'center'
  },
  {
    id: 2,
    target: 'recommendations-btn',
    page: '/home',
    title: '🎯 Get Personalized Recommendations',
    description: 'Click here to set your preferences and get product recommendations tailored just for you.',
    position: 'bottom'
  },
  {
    id: 3,
    target: 'ai-assistant-btn',
    page: '/home',
    title: '🤖 AI Virtual Assistant',
    description: 'Chat with our AI assistant! Ask questions, get recommendations, or search using natural language.',
    position: 'bottom'
  },
  {
    id: 4,
    target: 'floating-chat',
    page: '/home',
    title: '💬 Floating Chat Button',
    description: 'Access AI chat from any page! Click this button anytime you need help.',
    position: 'left'
  },
  {
    id: 5,
    target: 'nav-ai-assistant',
    page: '/home',
    title: '🔍 AI Features Hub',
    description: 'Access advanced AI features: voice search, natural language queries, and conversation history.',
    position: 'bottom'
  },
  {
    id: 6,
    target: 'nav-history',
    page: '/home',
    title: '📜 Your History',
    description: 'View all your past recommendations, saved preferences, and shopping activity.',
    position: 'bottom'
  },
  {
    id: 7,
    target: 'stats-section',
    page: '/home',
    title: '📊 Activity Dashboard',
    description: 'Track your searches, viewed products, favorites, and explored categories in real-time.',
    position: 'top'
  }
];

function NavigationTour({ user, onComplete }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('aalayax_tour_completed');
    
    if (!hasSeenTour && user && location.pathname === '/home') {
      // Start tour after a short delay
      setTimeout(() => {
        setIsActive(true);
        setShowOverlay(true);
      }, 1000);
    }
  }, [user, location.pathname]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = tourSteps[currentStep + 1];
      
      // Navigate if needed
      if (nextStep.page !== location.pathname) {
        navigate(nextStep.page);
      }
      
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = tourSteps[currentStep - 1];
      
      // Navigate if needed
      if (prevStep.page !== location.pathname) {
        navigate(prevStep.page);
      }
      
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem('aalayax_tour_completed', 'true');
    setIsActive(false);
    setShowOverlay(false);
    if (onComplete) onComplete();
  };

  const skipTour = () => {
    completeTour();
  };

  const restartTour = () => {
    setCurrentStep(0);
    setIsActive(true);
    setShowOverlay(true);
    navigate('/home');
  };

  // Expose restart function globally
  useEffect(() => {
    window.restartAalayaxTour = restartTour;
    return () => {
      delete window.restartAalayaxTour;
    };
  }, []);

  if (!isActive || !user) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" />
      )}

      {/* Tour Tooltip */}
      <div className={`fixed z-50 ${getPositionClasses(step)}`}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md border-4 border-slate-800 animate-bounce-subtle">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-t-xl overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-slate-800 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {currentStep + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {step.title}
                </h3>
              </div>
              <button
                onClick={skipTour}
                className="text-gray-400 hover:text-gray-600 transition"
                title="Skip tour"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition font-medium"
              >
                <FaArrowLeft />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-slate-800 w-8'
                        : index < currentStep
                        ? 'bg-slate-400'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    <FaRocket />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Arrow pointer */}
          {step.position !== 'center' && (
            <div className={`absolute ${getArrowClasses(step.position)}`}>
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Helper functions for positioning
function getPositionClasses(step) {
  if (step.position === 'center') {
    return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
  }
  
  // Position near target elements (simplified positioning)
  switch (step.target) {
    case 'recommendations-btn':
      return 'top-[380px] left-1/2 transform -translate-x-1/2';
    case 'ai-assistant-btn':
      return 'top-[380px] left-1/2 transform -translate-x-1/2';
    case 'floating-chat':
      return 'bottom-24 right-24';
    case 'nav-ai-assistant':
      return 'top-20 left-1/2 transform -translate-x-1/2';
    case 'nav-history':
      return 'top-20 left-1/2 transform -translate-x-1/2';
    case 'stats-section':
      return 'bottom-32 left-1/2 transform -translate-x-1/2';
    default:
      return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
  }
}

function getArrowClasses(position) {
  switch (position) {
    case 'top':
      return 'bottom-[-8px] left-1/2 transform -translate-x-1/2';
    case 'bottom':
      return 'top-[-8px] left-1/2 transform -translate-x-1/2 rotate-180';
    case 'left':
      return 'right-[-16px] top-1/2 transform -translate-y-1/2 rotate-90';
    case 'right':
      return 'left-[-16px] top-1/2 transform -translate-y-1/2 -rotate-90';
    default:
      return 'hidden';
  }
}

export default NavigationTour;
