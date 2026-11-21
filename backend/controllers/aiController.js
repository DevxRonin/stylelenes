const Product = require('../models/Product');
const seedProducts = require('../data/seedProducts');
const { getDbStatus } = require('../config/db');

// Fallback in-memory catalog
const fallbackCatalog = seedProducts.map((p, idx) => ({
  ...p,
  _id: `sl-prod-${idx + 1}`
}));

exports.chatWithAI = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question or shopping query.'
      });
    }

    const query = question.trim().toLowerCase();

    // 1. Fetch available products from DB or fallback
    let allProducts = [];
    if (getDbStatus()) {
      allProducts = await Product.find({ stock: { $gt: 0 } }).lean();
    } else {
      allProducts = [...fallbackCatalog];
    }

    if (allProducts.length === 0) {
      allProducts = [...fallbackCatalog];
    }

    // 2. Optional: If GEMINI_API_KEY or OPENAI_API_KEY is configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiResponse = await callGeminiAPI(process.env.GEMINI_API_KEY, question, allProducts);
        if (geminiResponse) {
          return res.json(geminiResponse);
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to rule-based engine:', err.message);
      }
    }

    // 3. Smart Rule-Based Recommendation Engine
    let filtered = [...allProducts];
    let guidanceNotes = [];

    // Check budget
    const underMatch = query.match(/under\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
                       query.match(/below\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
                       query.match(/less than\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
    if (underMatch) {
      const maxBudget = parseInt(underMatch[1], 10);
      filtered = filtered.filter(p => p.price <= maxBudget);
      guidanceNotes.push(`within your budget under ₹${maxBudget}`);
    }

    // Check category / gender
    if (query.includes('men') && !query.includes('women')) {
      filtered = filtered.filter(p => p.category === 'Men' || p.category === 'Sunglasses' || p.category === 'Unisex');
      guidanceNotes.push('tailored for men');
    } else if (query.includes('women') || query.includes('lady') || query.includes('female')) {
      filtered = filtered.filter(p => p.category === 'Women' || p.category === 'Unisex' || p.category === 'Premium Collection');
      guidanceNotes.push('flattering for women');
    }

    // Check style / occasion
    if (query.includes('black') || query.includes('dark')) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes('noir') ||
        p.name.toLowerCase().includes('black') ||
        p.name.toLowerCase().includes('carbon') ||
        p.lensColor.toLowerCase().includes('black') ||
        p.lensColor.toLowerCase().includes('grey')
      );
      guidanceNotes.push('featuring timeless black & dark tints');
    }

    if (query.includes('gold') || query.includes('luxury') || query.includes('premium')) {
      filtered = filtered.filter(p =>
        p.category === 'Premium Collection' ||
        p.name.toLowerCase().includes('gold') ||
        p.badge === 'EXCLUSIVE' ||
        p.badge === 'BESTSELLER'
      );
      guidanceNotes.push('from our ultra-premium gold and luxury handcrafted series');
    }

    if (query.includes('daily') || query.includes('everyday') || query.includes('regular') || query.includes('work') || query.includes('office')) {
      filtered = filtered.filter(p =>
        p.frameShape === 'Wayfarer' ||
        p.frameShape === 'Square' ||
        p.name.toLowerCase().includes('clear') ||
        p.name.toLowerCase().includes('savile') ||
        p.name.toLowerCase().includes('noir')
      );
      guidanceNotes.push('designed for all-day ergonomic comfort and crystal clarity');
    }

    if (query.includes('formal') || query.includes('suit') || query.includes('business')) {
      filtered = filtered.filter(p =>
        p.category === 'Premium Collection' ||
        p.name.toLowerCase().includes('executive') ||
        p.name.toLowerCase().includes('savile') ||
        p.name.toLowerCase().includes('monarch')
      );
      guidanceNotes.push('perfectly suited for formal attire and high-profile meetings');
    }

    if (query.includes('sport') || query.includes('driving') || query.includes('running') || query.includes('beach')) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes('sport') ||
        p.name.toLowerCase().includes('aviator') ||
        p.name.toLowerCase().includes('carbon') ||
        p.category === 'Sunglasses'
      );
      guidanceNotes.push('equipped with high-contrast polarized glare reduction');
    }

    // If filter produced nothing, fallback to top-rated
    if (filtered.length === 0) {
      filtered = [...allProducts].sort((a, b) => b.rating - a.rating);
    }

    // Pick top 3 recommendations
    filtered.sort((a, b) => b.rating - a.rating);
    const topPicks = filtered.slice(0, 3);

    const noteText = guidanceNotes.length > 0 ? ` focused on ${guidanceNotes.join(', ')}` : '';
    const answerIntro = `✨ StyleLens Concierge: Based on your request "${question}"${noteText}, here are my handpicked recommendations:`;
    const productHighlights = topPicks.map(p => `• **${p.name}** (₹${p.price}) – ${p.badge ? `[${p.badge}] ` : ''}Rated ${p.rating}★ with ${p.features ? p.features[0] : '100% UV Protection'}`).join('\n');
    const answer = `${answerIntro}\n\n${productHighlights}\n\nEach frame is engineered with premium UV400 lenses and backed by our 7-day hassle-free home trial guarantee!`;

    return res.json({
      success: true,
      answer,
      results: topPicks
    });
  } catch (error) {
    next(error);
  }
};

// Helper for Gemini API when key is configured
async function callGeminiAPI(apiKey, prompt, catalog) {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const catalogSummary = catalog.map(p => ({
    id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    rating: p.rating,
    features: p.features
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `You are the StyleLens Luxury Eyewear Styling Consultant. A customer is asking: "${prompt}".
Here is our available product catalog:
${JSON.stringify(catalogSummary)}

Respond in 2-3 friendly, luxury-focused sentences recommending the best frames, explaining why they suit the user's need. Mention the exact product names and prices in INR. Mention 2 or 3 products.`
          }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  // Find matching products mentioned in response
  const matched = catalog.filter(p => text.toLowerCase().includes(p.name.toLowerCase())).slice(0, 3);
  return {
    success: true,
    answer: text,
    results: matched.length > 0 ? matched : catalog.slice(0, 3)
  };
}
