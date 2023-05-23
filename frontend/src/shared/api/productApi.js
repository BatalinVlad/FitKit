export const fetchProducts = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/products`);
    if (!response.ok) {
      throw new Error('Error fetching products');
    }
    const responseData = await response.json();
    return responseData.loadedproducts;
  } catch (err) {
    throw new Error('Error fetching products: ' + err.message);
  }
};
