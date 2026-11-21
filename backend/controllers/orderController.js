const Order = require('../models/Order');
const Product = require('../models/Product');
const { getDbStatus } = require('../config/db');

// In-memory orders store when DB is in fallback mode
const inMemoryOrders = [];

// POST /api/orders - Create a new order with stock validation
exports.createOrder = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      paymentMethod = 'COD'
    } = req.body;

    // 1. Validation
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'All customer and shipping address fields are required.'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Add products to checkout.'
      });
    }

    // 2. Validate items, prices, and stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const quantity = Math.max(1, parseInt(item.qty || item.quantity || 1, 10));
      const productId = item.productId || item._id || item.id;

      let product = null;

      if (getDbStatus() && productId && productId.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(productId);
      }

      const unitPrice = product ? product.price : (Number(item.price) || 999);
      const productName = product ? product.name : (item.name || 'StyleLens Eyewear');
      const productImage = product ? product.image : (item.image || '');

      // Stock check if DB connected
      if (product) {
        if (product.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${product.name}". Only ${product.stock} left in stock.`
          });
        }
      }

      subtotal += unitPrice * quantity;
      validatedItems.push({
        productId: String(productId),
        name: productName,
        price: unitPrice,
        qty: quantity,
        image: productImage
      });
    }

    // Free shipping above 999
    const shippingFee = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shippingFee;

    // Generate unique order ID: e.g. SL-202611-XXXX
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SL-${Date.now().toString().slice(-6)}-${randomHex}`;

    // Payment status handling:
    let paymentStatus = 'Pending';
    let transactionId = '';

    if (paymentMethod === 'COD') {
      paymentStatus = 'Pending (Cash on Delivery)';
    } else if (paymentMethod === 'UPI') {
      paymentStatus = 'Pending Verification';
      transactionId = `UPI-DEMO-${Date.now().toString().slice(-8)}`;
    } else if (paymentMethod === 'CARD') {
      paymentStatus = 'Demo Authorized (Simulated)';
      transactionId = `CARD-DEMO-${Date.now().toString().slice(-8)}`;
    }

    const orderData = {
      orderId,
      items: validatedItems,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      subtotal,
      discount: 0,
      shippingFee,
      total,
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        transactionId
      },
      status: 'placed'
    };

    if (getDbStatus()) {
      // Create order in MongoDB
      const createdOrder = await Order.create(orderData);

      // Decrement stock for purchased items
      for (const item of validatedItems) {
        if (item.productId.match(/^[0-9a-fA-F]{24}$/)) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.qty }
          });
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order: createdOrder
      });
    }

    // Fallback store
    const fallbackOrder = {
      ...orderData,
      _id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    inMemoryOrders.unshift(fallbackOrder);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully (Demo mode)!',
      order: fallbackOrder
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders - Get all orders
exports.getOrders = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: orders.length,
        orders
      });
    }

    return res.json({
      success: true,
      count: inMemoryOrders.length,
      orders: inMemoryOrders
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      let order = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      }
      if (!order) {
        order = await Order.findOne({ orderId: id });
      }
      if (order) {
        return res.json({ success: true, order });
      }
    }

    const order = inMemoryOrders.find(o => o.orderId === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
