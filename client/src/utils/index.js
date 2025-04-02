export const daysLeft = (deadline) => {
  const now = Math.floor(Date.now() / 1000); // Get current time in seconds
  const timeLeft = deadline - now; // Calculate remaining seconds

  if (timeLeft <= 0) {
    return 0; // Return 0 if deadline has passed
  }

  return Math.ceil(timeLeft / (60 * 60 * 24)); // Convert seconds to days
};


export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};
