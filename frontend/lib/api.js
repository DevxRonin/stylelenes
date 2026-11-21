import { fallbackProducts } from './productsData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchProducts(filters = {}) {
  try {
    const query = new URLSearchParams();
    if (filters.category && filters.category !== 'All') query.append('category', filters.category);
    if (filters.search) query.append('search', filters.search);
    if (filters.minPrice) query.append('minPrice', filters.minPrice);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
    if (filters.rating) query.append('rating', filters.rating);
    if (filters.sort) query.append('sort', filters.sort);
    if (filters.badge) query.append('badge', filters.badge);

    const res = await fetch(`${API_BASE_URL}/api/products?${query.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.warn('API fetch products error, using client fallback:', err.message);
    // Apply client-side filtering on fallback catalog
    let list = [...fallbackProducts];
    if (filters.category && filters.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.badge) {
      list = list.filter(p => p.badge?.toUpperCase() === filters.badge.toUpperCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (filters.minPrice) list = list.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) list = list.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.rating) list = list.filter(p => p.rating >= Number(filters.rating));
    if (filters.sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    if (filters.sort === 'rating_desc') list.sort((a, b) => b.rating - a.rating);
    return list;
  }
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Product not found');
    const data = await res.json();
    return data.product;
  } catch (err) {
    console.warn('API fetch product by id error, using fallback:', err.message);
    return (
      fallbackProducts.find(
        p => p._id === id || p.id === id || p.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
      ) || fallbackProducts[0]
    );
  }
}

export async function createOrder(orderPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create order');
    }
    return data;
  } catch (err) {
    console.warn('Backend order failed or unreachable:', err.message);
    // Return a valid client order for offline continuity
    const mockId = `SL-DEMO-${Date.now().toString().slice(-6)}`;
    return {
      success: true,
      message: 'Order placed in demo offline mode!',
      order: {
        ...orderPayload,
        orderId: mockId,
        _id: mockId,
        createdAt: new Date().toISOString(),
        payment: {
          method: orderPayload.paymentMethod || 'COD',
          status: orderPayload.paymentMethod === 'COD' ? 'Pending (COD)' : 'Demo Authorized'
        },
        status: 'placed'
      }
    };
  }
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.orders || [];
  } catch (err) {
    console.warn('API fetch orders error:', err.message);
    // Return localStorage orders if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stylelens_orders');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  }
}

export async function sendAIChat(question) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) throw new Error('AI Service error');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend AI route unavailable, using local styling concierge fallback:', err.message);
    // Smart local fallback
    const q = question.toLowerCase();
    let picks = [...fallbackProducts];
    if (q.includes('under') || q.includes('below')) {
      const m = q.match(/\d+/);
      const budget = m ? parseInt(m[0], 10) : 1000;
      picks = picks.filter(p => p.price <= budget);
    }
    if (picks.length === 0) picks = fallbackProducts.slice(0, 3);
    else picks = picks.slice(0, 3);

    return {
      success: true,
      answer: `✨ StyleLens Concierge: For your request "${question}", I highly recommend exploring our top-rated frames below, crafted with high-definition polarized optics and featherlight Italian acetate:`,
      results: picks
    };
  }
}
