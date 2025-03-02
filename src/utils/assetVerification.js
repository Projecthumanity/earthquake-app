export const verifyAssets = () => {
  const requiredAssets = [
    '/images/Earthquake.png',
    '/sounds/alert-sound.mp3'
  ];

  requiredAssets.forEach(asset => {
    fetch(asset)
      .then(response => {
        if (!response.ok) {
          console.error(`Asset not found: ${asset}`);
        }
      })
      .catch(error => {
        console.error(`Failed to load asset: ${asset}`, error);
      });
  });
};