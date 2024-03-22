const BASE_URL = 'http://localhost:3001/api/cart';

const getCart = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Misslyckades att hämta varukorg');
    }
    return await response.json();
  } catch (error) {
    console.error('Fel vid hämtning av varukorg:', error);
    throw error;
  }
};

const addToCart = async ({ userId, productId, quantity }) => {
  try {
    const response = await fetch(`${BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    if (!response.ok) {
      throw new Error('Misslyckades att lägga till objekt i varukorg');
    }
    return await response.json();
  } catch (error) {
    console.error('Fel vid tillägg av objekt i varukorg:', error);
    throw error;
  }
};

const updateCartItem = async ({ cartItemId, quantity }) => {
  try {
    const response = await fetch(`${BASE_URL}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItemId, quantity }),
    });
    if (!response.ok) {
      throw new Error('Misslyckades att uppdatera varukorgsobjekt');
    }
    // använder response.text() om man förväntar sig en sträng som svar istället för JSON
    const result = await response.text(); // använder response.json() endast om man förväntar sig JSON
    console.log(result); // Logga eller hantera resultatet
    return result;
  } catch (error) {
    console.error('Fel vid uppdatering av varukorgsobjekt:', error);
    throw error;
  }
};

const removeFromCart = async (cartItemId) => {
  try {
    const response = await fetch(`${BASE_URL}/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItemId }),
    });
    if (!response.ok) {
      throw new Error('Misslyckades att ta bort objekt från varukorg');
    }
    // använder response.text() istället för response.json() om servern svarar med text
    const resultText = await response.text();
    console.log(resultText); // kan logga detta för att bekräfta rätt svar
    return resultText;
  } catch (error) {
    console.error('Fel vid borttagning av objekt från varukorg:', error);
    throw error;
  }
};

const clearCart = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      throw new Error('Misslyckades att rensa varukorg');
    }

    const resultText = await response.text();
    console.log(resultText);
    return resultText;
  } catch (error) {
    console.error('Fel vid rensning av varukorg:', error);
    throw error;
  }
};

export const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
