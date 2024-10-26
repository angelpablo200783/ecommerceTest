const InstagramRedirect = ({ productName, productPrice, instaAccount }: any) => {
    const handleInstagramRedirect = () => {
      const encodedProductDetails = encodeURIComponent(
        `I'm interested in the product: ${productName}, Price: ${productPrice}`
      );
      const instagramUrl = `https://www.instagram.com/direct/new/?recipient=${instaAccount}&text=${encodedProductDetails}`;
      window.open(instagramUrl, "_blank"); // Opens in a new tab
    };
  
    return (
      <button onClick={handleInstagramRedirect}>
        Complete Checkout in Instagram
      </button>
    );
  };

export default InstagramRedirect;