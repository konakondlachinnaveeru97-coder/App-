import Product from '../models/Product.js';
import defaultProducts from '../data/products.js';

const PUBLIC_FIELDS = 'slug name region price rating badge eggless allergens description image sortOrder';

export function toPublicProduct(p) {
  return {
    id: p.slug,
    name: p.name,
    region: p.region,
    price: p.price,
    rating: p.rating,
    badge: p.badge ?? null,
    eggless: !!p.eggless,
    allergens: p.allergens || [],
    description: p.description || '',
    image: p.image,
  };
}

// Products from MongoDB, or the bundled menu when the database is down.
export async function listProducts(dbReady) {
  if (dbReady()) {
    const docs = await Product.find({ available: true }).select(PUBLIC_FIELDS).sort({ sortOrder: 1 }).lean();
    return docs.map(toPublicProduct);
  }
  return [...defaultProducts].sort((a, b) => a.sortOrder - b.sortOrder).map(toPublicProduct);
}

// Insert any bundled products that are missing. Existing documents are left alone
// so prices edited in the database are not overwritten.
export async function seedProducts() {
  const ops = defaultProducts.map((p) => ({
    updateOne: { filter: { slug: p.slug }, update: { $setOnInsert: p }, upsert: true },
  }));
  const res = await Product.bulkWrite(ops);
  return res.upsertedCount;
}
