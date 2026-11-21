const Product = require('../models/Product');
const seedProducts = require('../data/seedProducts');
const { getDbStatus } = require('../config/db');

// In-memory memory fallback store when DB is disconnected
let inMemoryProducts = seedProducts.map((p, idx) => ({
  ...p,
  _id: `sl-prod-${idx + 1}`,
  id: `sl-prod-${idx + 1}`,
  createdAt: new Date().toISOString()
}));

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, rating, sort, badge } = req.query;

    if (getDbStatus()) {
      const filter = {};

      if (category && category !== 'All') {
        filter.category = new RegExp(`^${category}$`, 'i');
      }

      if (badge) {
        filter.badge = badge.toUpperCase();
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      if (rating) {
        filter.rating = { $gte: Number(rating) };
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { name: regex },
          { description: regex },
          { category: regex },
          { frameShape: regex }
        ];
      }

      let query = Product.find(filter);

      // Sorting
      if (sort === 'price_asc') {
        query = query.sort({ price: 1 });
      } else if (sort === 'price_desc') {
        query = query.sort({ price: -1 });
      } else if (sort === 'rating_desc') {
        query = query.sort({ rating: -1 });
      } else {
        query = query.sort({ createdAt: -1 });
      }

      const products = await query.exec();
      return res.json({
        success: true,
        count: products.length,
        source: 'database',
        products
      });
    }

    // In-Memory Fallback if DB not connected yet
    let results = [...inMemoryProducts];

    if (category && category !== 'All') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (badge) {
      results = results.filter(p => p.badge?.toUpperCase() === badge.toUpperCase());
    }

    if (minPrice) {
      results = results.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      results = results.filter(p => p.price <= Number(maxPrice));
    }

    if (rating) {
      results = results.filter(p => p.rating >= Number(rating));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.frameShape?.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating_desc') {
      results.sort((a, b) => b.rating - a.rating);
    }

    return res.json({
      success: true,
      count: results.length,
      source: 'in-memory-fallback',
      products: results
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      let product = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      }
      if (!product) {
        product = await Product.findOne({
          $or: [{ _id: id }, { name: new RegExp(id.replace(/-/g, ' '), 'i') }]
        });
      }
      if (product) {
        return res.json({ success: true, product });
      }
    }

    // Fallback search
    const product = inMemoryProducts.find(
      p => p._id === id || p.id === id || p.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/categories/all
exports.getCategories = async (req, res, next) => {
  try {
    const categories = ['Sunglasses', 'Men', 'Women', 'Unisex', 'Premium Collection'];
    return res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};
