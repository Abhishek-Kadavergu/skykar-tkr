import { FaQuestionCircle } from 'react-icons/fa';

/**
 * Tour Trigger Button - Allows users to restart the tour anytime
 */
function TourTrigger() {
  const handleRestartTour = () => {
    // Clear tour completion flag
    localStorage.removeItem('aalayax_tour_completed');

    // Trigger tour restart
    if (window.restartAalayaxTour) {
      window.restartAalayaxTour();
    } else {
      // Fallback: reload page
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleRestartTour}
      className="fixed bottom-20 left-4 w-12 h-12 md:bottom-24 md:left-6 md:w-14 md:h-14 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-600 transition transform hover:scale-110 flex items-center justify-center z-30"
      title="Start Platform Tour"
    >
      <FaQuestionCircle className="text-xl md:text-2xl" />
    </button>
  );
}

export default TourTrigger;
