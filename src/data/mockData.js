// Centralized Mock Data for Woodzon
// This ensures consistency across all pages

// ============================================
// SELLERS DATA
// ============================================
export const mockSellers = {
  1: {
    seller_id: 1,
    business_name: 'Premium Teak Furniture',
    logo: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=150',
    banner_image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=200&fit=crop',
    rating: 4.8,
    review_count: 245,
    product_count: 89,
    verified: true,
    city: 'Bangalore',
    state: 'Karnataka',
    location: 'Bangalore, Karnataka',
    description: 'Premium handcrafted teak wood furniture with 20+ years of experience',
  },
  2: {
    seller_id: 2,
    business_name: 'Woodcraft Masters',
    logo: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=150',
    banner_image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop',
    rating: 4.6,
    review_count: 178,
    product_count: 67,
    verified: true,
    city: 'Bangalore',
    state: 'Karnataka',
    location: 'Bangalore, Karnataka',
    description: 'Expert woodcraft and custom furniture solutions',
  },
  3: {
    seller_id: 3,
    business_name: 'Royal Wood Works',
    logo: 'https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=150',
    banner_image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=200&fit=crop',
    rating: 4.9,
    review_count: 312,
    product_count: 124,
    verified: true,
    city: 'Bangalore',
    state: 'Karnataka',
    location: 'Bangalore, Karnataka',
    description: 'Royal quality wooden furniture and home decor',
  },
};

// ============================================
// CATEGORIES DATA
// ============================================
export const mockCategories = [
  {
    category_id: 1,
    name: 'Furniture',
    icon: '🛋️',
    subcategory_count: 6,
    total_products: 245,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
  },
  {
    category_id: 2,
    name: 'Doors & Windows',
    icon: '🚪',
    subcategory_count: 4,
    total_products: 156,
    image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=400&h=300&fit=crop',
  },
  {
    category_id: 3,
    name: 'Flooring & Cladding',
    icon: '📐',
    subcategory_count: 3,
    total_products: 89,
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop',
  },
  {
    category_id: 4,
    name: 'Railings & Stairs',
    icon: '🛡️',
    subcategory_count: 3,
    total_products: 67,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
  },
  {
    category_id: 5,
    name: 'Home Decor',
    icon: '🎨',
    subcategory_count: 5,
    total_products: 423,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop',
  },
  {
    category_id: 6,
    name: 'Kitchen & Dining',
    icon: '🍽️',
    subcategory_count: 4,
    total_products: 178,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
  },
  {
    category_id: 7,
    name: 'Outdoor & Garden',
    icon: '🌿',
    subcategory_count: 4,
    total_products: 134,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
  },
  {
    category_id: 8,
    name: 'Raw Wood Materials',
    icon: '🌲',
    subcategory_count: 5,
    total_products: 298,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop',
  },
];

// ============================================
// SUBCATEGORIES DATA (Different for each category)
// ============================================
export const mockSubcategories = {
  // Category 1: Furniture
  1: {
    name: 'Furniture',
    icon: '🛋️',
    subcategories: [
      { subcategory_id: 101, name: 'Beds', icon: '🛏️', seller_count: 3, total_products: 89, image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400' },
      { subcategory_id: 102, name: 'Chairs', icon: '🪑', seller_count: 3, total_products: 67, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400' },
      { subcategory_id: 103, name: 'Tables', icon: '🪑', seller_count: 3, total_products: 54, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400' },
      { subcategory_id: 104, name: 'Sofas', icon: '🛋️', seller_count: 3, total_products: 45, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
      { subcategory_id: 105, name: 'Wardrobes', icon: '🚪', seller_count: 3, total_products: 38, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400' },
      { subcategory_id: 106, name: 'Cabinets', icon: '🗄️', seller_count: 3, total_products: 52, image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400' },
    ],
  },
  // Category 2: Doors & Windows
  2: {
    name: 'Doors & Windows',
    icon: '🚪',
    subcategories: [
      { subcategory_id: 201, name: 'Wooden Doors', icon: '🚪', seller_count: 3, total_products: 78, image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=400' },
      { subcategory_id: 202, name: 'Window Frames', icon: '🪟', seller_count: 3, total_products: 45, image: 'https://images.unsplash.com/photo-1545259742-12f8e8c5e0e5?w=400' },
      { subcategory_id: 203, name: 'Door Frames', icon: '🚪', seller_count: 3, total_products: 23, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { subcategory_id: 204, name: 'Sliding Doors', icon: '🚪', seller_count: 3, total_products: 10, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400' },
    ],
  },
  // Category 3: Flooring & Cladding
  3: {
    name: 'Flooring & Cladding',
    icon: '📐',
    subcategories: [
      { subcategory_id: 301, name: 'Wooden Flooring', icon: '📐', seller_count: 3, total_products: 45, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400' },
      { subcategory_id: 302, name: 'Wall Cladding', icon: '🧱', seller_count: 3, total_products: 34, image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400' },
      { subcategory_id: 303, name: 'Deck Flooring', icon: '🏡', seller_count: 3, total_products: 10, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400' },
    ],
  },
  // Category 4: Railings & Stairs
  4: {
    name: 'Railings & Stairs',
    icon: '🛡️',
    subcategories: [
      { subcategory_id: 401, name: 'Stair Railings', icon: '🛡️', seller_count: 3, total_products: 34, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400' },
      { subcategory_id: 402, name: 'Handrails', icon: '🤚', seller_count: 3, total_products: 23, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400' },
      { subcategory_id: 403, name: 'Balusters', icon: '🏛️', seller_count: 3, total_products: 10, image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400' },
    ],
  },
  // Category 5: Home Decor
  5: {
    name: 'Home Decor',
    icon: '🎨',
    subcategories: [
      { subcategory_id: 501, name: 'Wall Art', icon: '🖼️', seller_count: 3, total_products: 120, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400' },
      { subcategory_id: 502, name: 'Sculptures', icon: '🗿', seller_count: 3, total_products: 89, image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400' },
      { subcategory_id: 503, name: 'Vases', icon: '🏺', seller_count: 3, total_products: 67, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400' },
      { subcategory_id: 504, name: 'Mirrors', icon: '🪞', seller_count: 3, total_products: 78, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400' },
      { subcategory_id: 505, name: 'Shelves', icon: '📚', seller_count: 3, total_products: 69, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400' },
    ],
  },
  // Category 6: Kitchen & Dining
  6: {
    name: 'Kitchen & Dining',
    icon: '🍽️',
    subcategories: [
      { subcategory_id: 601, name: 'Dining Tables', icon: '🍽️', seller_count: 3, total_products: 56, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400' },
      { subcategory_id: 602, name: 'Kitchen Cabinets', icon: '🗄️', seller_count: 3, total_products: 45, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
      { subcategory_id: 603, name: 'Cutting Boards', icon: '🔪', seller_count: 3, total_products: 34, image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400' },
      { subcategory_id: 604, name: 'Serving Trays', icon: '🍴', seller_count: 3, total_products: 43, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400' },
    ],
  },
  // Category 7: Outdoor & Garden
  7: {
    name: 'Outdoor & Garden',
    icon: '🌿',
    subcategories: [
      { subcategory_id: 701, name: 'Garden Furniture', icon: '🪑', seller_count: 3, total_products: 45, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400' },
      { subcategory_id: 702, name: 'Planters', icon: '🌱', seller_count: 3, total_products: 34, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400' },
      { subcategory_id: 703, name: 'Garden Swings', icon: '⛺', seller_count: 3, total_products: 23, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400' },
      { subcategory_id: 704, name: 'Pergolas', icon: '🏛️', seller_count: 3, total_products: 32, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400' },
    ],
  },
  // Category 8: Raw Wood Materials
  8: {
    name: 'Raw Wood Materials',
    icon: '🌲',
    subcategories: [
      { subcategory_id: 801, name: 'Teak Wood', icon: '🌲', seller_count: 3, total_products: 89, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400' },
      { subcategory_id: 802, name: 'Oak Wood', icon: '🌳', seller_count: 3, total_products: 67, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400' },
      { subcategory_id: 803, name: 'Pine Wood', icon: '🌲', seller_count: 3, total_products: 56, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400' },
      { subcategory_id: 804, name: 'Mahogany', icon: '🌳', seller_count: 3, total_products: 45, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400' },
      { subcategory_id: 805, name: 'Rosewood', icon: '🌲', seller_count: 3, total_products: 41, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
    ],
  },
};

// ============================================
// SUBCATEGORY SLUG TO ID MAPPING
// ============================================
export const subcategorySlugToId = {
  // Living Room
  'sofa-sets': 104,
  'coffee-tables': 103,
  'tv-units': 106,
  'wall-shelves': 106,
  'recliners': 102,
  'lounge-chairs': 102,
  'side-tables': 103,
  'fabric-sofas': 104,
  'benches': 102,
  'bookshelves': 106,

  // Bedroom
  'beds': 101,
  'wardrobes': 105,
  'bedside-tables': 103,
  'dressing-tables': 103,
  'chest-drawers': 105,
  'study-tables': 103,
  'bed-sheets': 101,
  'mattress': 101,
  'photo-frames': 106,
  'sofa-cum-beds': 104,
  'trunk-blanket-box': 105,
  'wall-mirrors': 106,

  // Dining
  'dining-tables': 103,
  'dining-chairs': 102,
  'bar-units': 106,
  'crockery-units': 106,
  '6-seater-dining-table-sets': 103,
  '4-seater-dining-table-sets': 103,
  'modular-kitchen': 106,
  'bar-cabinets': 106,
  'bar-trolleys': 106,
  'kitchen-cabinet': 106,
  'kitchen-shelves': 106,

  // Storage
  'cabinets': 106,
  'shelving-units': 106,
  'storage-boxes': 106,
  'shoe-racks': 106,
  'book-shelves': 106,
  'wall-shelves-storage': 106,

  // Mattress
  'spring-mattress': 101,
  'foam-mattress': 101,
  'coir-mattress': 101,
  'orthopedic-mattress': 101,
  'memory-foam-mattress': 101,

  // Outdoor
  'garden-furniture': 102,
  'balcony-sets': 104,
  'outdoor-chairs': 102,
  'patio-furniture': 102,
  'garden-benches': 102,

  // Furnishings
  'cushions': 104,
  'curtains': 104,
  'rugs': 104,
  'carpets': 104,
  'bed-covers': 101,
  'table-runners': 103,

  // Lighting
  'ceiling-lights': 106,
  'wall-lights': 106,
  'table-lamps': 103,
  'floor-lamps': 106,
  'pendant-lights': 106,

  // Interiors
  'wall-panels': 106,
  'false-ceiling': 106,
  'partitions': 106,
  'wall-cladding': 106,
  'decorative-panels': 106,
};

// Helper function to get numeric ID from slug
export const getSubcategoryIdFromSlug = (slug) => {
  // If it's already a number, return it
  if (!isNaN(slug)) {
    return parseInt(slug);
  }
  // Otherwise, look up the slug
  return subcategorySlugToId[slug] || null;
};

// Helper function to get sellers by subcategory
export const getSellersBySubcategory = (subcategoryId) => {
  // Convert slug to ID if needed
  const numericId = getSubcategoryIdFromSlug(subcategoryId);

  // Return all 3 sellers for any subcategory (in real app, this would be filtered)
  return Object.values(mockSellers);
};

// ============================================
// COMPREHENSIVE PRODUCTS DATABASE
// ============================================
export const mockProducts = {
  // FURNITURE - Beds (101)
  101: [
    {
      id: 1001,
      name: 'Teak Wood King Size Bed with Storage',
      price: 125000,
      mrp: 180000,
      rating: 4.9,
      review_count: 56,
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=400&fit=crop',
      seller_id: 1,
      seller_name: 'Premium Teak Furniture',
      in_stock: true,
      discount: 31,
      subcategory_id: 101,
      description: 'Handcrafted king size bed with ample storage space. Made from premium teak wood.',
    },
    {
      id: 1002,
      name: 'Solid Wood Queen Bed - Modern Design',
      price: 89000,
      mrp: 135000,
      rating: 4.7,
      review_count: 43,
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 34,
      subcategory_id: 101,
      description: 'Contemporary queen size bed with sleek design and sturdy construction.',
    },
    {
      id: 1003,
      name: 'Royal Carved Wooden Bed',
      price: 156000,
      mrp: 220000,
      rating: 5.0,
      review_count: 28,
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=400&fit=crop',
      seller_id: 3,
      seller_name: 'Royal Wood Works',
      in_stock: true,
      discount: 29,
      subcategory_id: 101,
      description: 'Exquisitely carved wooden bed with royal finish and premium quality.',
    },
  ],

  // FURNITURE - Chairs (102)
  102: [
    {
      id: 1011,
      name: 'Handcrafted Wooden Dining Chair',
      price: 4800,
      mrp: 8000,
      rating: 4.5,
      review_count: 89,
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop',
      seller_id: 1,
      seller_name: 'Premium Teak Furniture',
      in_stock: true,
      discount: 40,
      subcategory_id: 102,
      description: 'Beautiful handcrafted wooden chair with woven seat. Perfect for any modern or traditional home.',
    },
    {
      id: 1012,
      name: 'Ergonomic Office Chair - Wooden',
      price: 12500,
      mrp: 18000,
      rating: 4.6,
      review_count: 67,
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 31,
      subcategory_id: 102,
      description: 'Comfortable ergonomic office chair with solid wood frame.',
    },
    {
      id: 1013,
      name: 'Set of 4 Wooden Dining Chairs',
      price: 18000,
      mrp: 28000,
      rating: 4.8,
      review_count: 124,
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop',
      seller_id: 3,
      seller_name: 'Royal Wood Works',
      in_stock: true,
      discount: 36,
      subcategory_id: 102,
      description: 'Set of 4 matching dining chairs with cushioned seats.',
    },
    {
      id: 1014,
      name: 'Woven Accent Chair',
      price: 4800,
      mrp: 7200,
      rating: 5,
      review_count: 24,
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
      seller_id: 1,
      seller_name: 'Premium Teak Furniture',
      in_stock: true,
      discount: 33,
      subcategory_id: 102,
      description: 'Elegant woven accent chair perfect for any room.',
    },
  ],

  // FURNITURE - Tables (103)
  103: [
    {
      id: 1021,
      name: 'Premium Teak Wood Dining Table',
      price: 89999,
      mrp: 150000,
      rating: 4.8,
      review_count: 72,
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=400&fit=crop',
      seller_id: 1,
      seller_name: 'Premium Teak Furniture',
      in_stock: true,
      discount: 40,
      subcategory_id: 103,
      description: 'Spacious dining table for 8 people. Made from premium teak wood.',
    },
    {
      id: 1022,
      name: 'Handcrafted Coffee Table',
      price: 15999,
      mrp: 25000,
      rating: 4.6,
      review_count: 134,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 36,
      subcategory_id: 103,
      description: 'Beautiful coffee table with storage shelf underneath.',
    },
    {
      id: 1023,
      name: 'Live Edge Wooden Table',
      price: 45000,
      mrp: 68000,
      rating: 4.9,
      review_count: 45,
      image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=400&fit=crop',
      seller_id: 3,
      seller_name: 'Royal Wood Works',
      in_stock: true,
      discount: 34,
      subcategory_id: 103,
      description: 'Unique live edge table showcasing natural wood beauty.',
    },
  ],

  // FURNITURE - Sofas (104)
  104: [
    {
      id: 1031,
      name: 'Kamoni Solid Teakwood Sofa',
      price: 62500,
      mrp: 125000,
      rating: 4.5,
      review_count: 89,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      seller_id: 1,
      seller_name: 'Premium Teak Furniture',
      in_stock: true,
      discount: 50,
      subcategory_id: 104,
      description: 'Exquisite hand-crafted teakwood sofa with premium upholstery.',
    },
    {
      id: 1032,
      name: 'Prestige Teak Wood Sofa',
      price: 20000,
      mrp: 25000,
      rating: 4.7,
      review_count: 124,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 20,
      subcategory_id: 104,
      description: 'Classic teak wood sofa with comfortable seating.',
    },
    {
      id: 1033,
      name: 'Royal Oak Teak Wood Sofa',
      price: 20000,
      mrp: 35000,
      rating: 4.5,
      review_count: 156,
      image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=400&fit=crop',
      seller_id: 3,
      seller_name: 'Royal Wood Works',
      in_stock: true,
      discount: 43,
      subcategory_id: 104,
      description: 'Premium oak wood sofa with royal finish.',
    },
  ],

  // RAILINGS & STAIRS - Stair Railings (401)
  401: [
    {
      id: 4011,
      name: 'Live Edge Slim Stair Rail - Solid Wood Handrail',
      price: 8164,
      mrp: 12000,
      rating: 4.6,
      review_count: 21,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 32,
      subcategory_id: 401,
      description: 'Modern slim stair rail with live edge design.',
    },
    {
      id: 4012,
      name: '100 Feet Wood SS Stair Railing',
      price: 80000,
      mrp: 120000,
      rating: 5.0,
      review_count: 14,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 33,
      subcategory_id: 401,
      description: 'Complete stair railing system with stainless steel fittings.',
    },
    {
      id: 4013,
      name: 'Custom Modern Solid Wood Indoor Stair Railing',
      price: 92767.85,
      mrp: 120000,
      rating: 4.8,
      review_count: 45,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 23,
      subcategory_id: 401,
      description: 'Custom-designed modern stair railing for indoor use.',
    },
  ],

  // RAILINGS & STAIRS - Handrails (402)
  402: [
    {
      id: 4021,
      name: 'Modern Farmhouse Wood Handrail - Premium Quality',
      price: 5839,
      mrp: 9000,
      rating: 5.0,
      review_count: 14,
      image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 35,
      subcategory_id: 402,
      description: 'Farmhouse style handrail with premium finish.',
    },
    {
      id: 4022,
      name: '6084 Modern Wooden Handrail - Contemporary Style',
      price: 14496,
      mrp: 22000,
      rating: 4.4,
      review_count: 24,
      image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 34,
      subcategory_id: 402,
      description: 'Contemporary wooden handrail with modern design.',
    },
    {
      id: 4023,
      name: 'Stair Banister Handrail 50cm - Solid Wood',
      price: 38756,
      mrp: 55000,
      rating: 4.6,
      review_count: 89,
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 30,
      subcategory_id: 402,
      description: 'Solid wood banister handrail with smooth finish.',
    },
  ],

  // RAILINGS & STAIRS - Balusters (403)
  403: [
    {
      id: 4031,
      name: '80 Pieces Wooden Railing Balusters - Complete Set',
      price: 289600,
      mrp: 400000,
      rating: 4.9,
      review_count: 67,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=400&fit=crop',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 28,
      subcategory_id: 403,
      description: 'Complete set of 80 wooden balusters for stair railing.',
    },
  ],

  // DECOR - Vases (503)
  503: [
    {
      id: 5031,
      name: 'Handcrafted Bowls',
      price: 1550,
      mrp: 2500,
      rating: 5,
      review_count: 18,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
      seller_id: 2,
      seller_name: 'Woodcraft Masters',
      in_stock: true,
      discount: 38,
      subcategory_id: 503,
      description: 'Beautiful handcrafted wooden bowls set.',
    },
  ],

  // KITCHEN & DINING - Cutting Boards (603)
  603: [
    {
      id: 6031,
      name: 'Acacia Cutting Board',
      price: 500,
      mrp: 800,
      rating: 4.5,
      review_count: 12,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      seller_id: 3,
      seller_name: 'Royal Wood Works',
      in_stock: true,
      discount: 38,
      subcategory_id: 603,
      description: 'Premium acacia wood cutting board.',
    },
  ],

  // DECOR - Shelves (505)
  505: [
    {
      id: 5051,
      name: 'Modern Desk Lamp',
      price: 850,
      mrp: 1200,
      rating: 5,
      review_count: 31,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      seller_id: 1,
      seller_name: 'Premium Teak Furniture',
      in_stock: true,
      discount: 29,
      subcategory_id: 505,
      description: 'Modern wooden desk lamp with adjustable arm.',
    },
  ],
};

// ============================================
// PRODUCT REVIEWS DATABASE
// ============================================
export const mockReviews = {
  // Reviews for Woven Accent Chair (1014)
  1014: [
    {
      review_id: 'r1014_1',
      product_id: 1014,
      buyer_name: 'Rajesh Kumar',
      rating: 5,
      title: 'Excellent Quality Chair!',
      review: 'This woven accent chair is absolutely beautiful! The craftsmanship is top-notch and it fits perfectly in my living room. Very comfortable and sturdy.',
      verified_purchase: true,
      created_at: '2024-11-15',
      helpful_count: 12,
    },
    {
      review_id: 'r1014_2',
      product_id: 1014,
      buyer_name: 'Priya Sharma',
      rating: 5,
      title: 'Love it!',
      review: 'Great chair for the price. The woven design is elegant and the wood quality is excellent. Highly recommend!',
      verified_purchase: true,
      created_at: '2024-11-10',
      helpful_count: 8,
    },
    {
      review_id: 'r1014_3',
      product_id: 1014,
      buyer_name: 'Amit Patel',
      rating: 5,
      title: 'Perfect addition to my home',
      review: 'The chair arrived well-packaged and in perfect condition. Assembly was easy and it looks amazing in my bedroom.',
      verified_purchase: true,
      created_at: '2024-11-05',
      helpful_count: 5,
    },
  ],

  // Reviews for Handcrafted Bowls (5031)
  5031: [
    {
      review_id: 'r5031_1',
      product_id: 5031,
      buyer_name: 'Sneha Reddy',
      rating: 5,
      title: 'Beautiful handcrafted bowls',
      review: 'These bowls are absolutely gorgeous! The wood grain is beautiful and they are very well made. Perfect for serving salads and fruits.',
      verified_purchase: true,
      created_at: '2024-11-20',
      helpful_count: 15,
    },
    {
      review_id: 'r5031_2',
      product_id: 5031,
      buyer_name: 'Vikram Singh',
      rating: 5,
      title: 'Great quality',
      review: 'Excellent craftsmanship. The bowls are smooth and well-finished. Great value for money!',
      verified_purchase: true,
      created_at: '2024-11-12',
      helpful_count: 9,
    },
  ],

  // Reviews for Acacia Cutting Board (6031)
  6031: [
    {
      review_id: 'r6031_1',
      product_id: 6031,
      buyer_name: 'Meera Iyer',
      rating: 5,
      title: 'Perfect cutting board',
      review: 'This acacia cutting board is exactly what I needed. It is sturdy, beautiful, and the perfect size for my kitchen.',
      verified_purchase: true,
      created_at: '2024-11-18',
      helpful_count: 10,
    },
    {
      review_id: 'r6031_2',
      product_id: 6031,
      buyer_name: 'Arjun Nair',
      rating: 4,
      title: 'Good quality board',
      review: 'Nice cutting board with beautiful wood grain. Slightly smaller than expected but still very good quality.',
      verified_purchase: true,
      created_at: '2024-11-08',
      helpful_count: 6,
    },
  ],

  // Reviews for Modern Desk Lamp (5051)
  5051: [
    {
      review_id: 'r5051_1',
      product_id: 5051,
      buyer_name: 'Kavita Desai',
      rating: 5,
      title: 'Stylish and functional',
      review: 'This desk lamp is perfect for my home office. The wooden design is elegant and the adjustable arm is very convenient.',
      verified_purchase: true,
      created_at: '2024-11-22',
      helpful_count: 18,
    },
    {
      review_id: 'r5051_2',
      product_id: 5051,
      buyer_name: 'Rahul Gupta',
      rating: 5,
      title: 'Excellent lamp',
      review: 'Great quality lamp with a modern design. Provides good lighting and looks beautiful on my desk.',
      verified_purchase: true,
      created_at: '2024-11-14',
      helpful_count: 11,
    },
    {
      review_id: 'r5051_3',
      product_id: 5051,
      buyer_name: 'Ananya Krishnan',
      rating: 5,
      title: 'Love the design',
      review: 'Beautiful wooden lamp that adds a warm touch to my workspace. Highly recommend!',
      verified_purchase: true,
      created_at: '2024-11-09',
      helpful_count: 7,
    },
  ],

  // Reviews for Teak Wood King Size Bed (1001)
  1001: [
    {
      review_id: 'r1001_1',
      product_id: 1001,
      buyer_name: 'Suresh Menon',
      rating: 5,
      title: 'Outstanding quality bed',
      review: 'This teak wood bed is absolutely stunning! The storage space is very practical and the craftsmanship is exceptional. Worth every penny!',
      verified_purchase: true,
      created_at: '2024-11-25',
      helpful_count: 24,
    },
    {
      review_id: 'r1001_2',
      product_id: 1001,
      buyer_name: 'Lakshmi Rao',
      rating: 5,
      title: 'Best purchase ever',
      review: 'The bed is very sturdy and the storage drawers are spacious. Delivery was on time and assembly was straightforward.',
      verified_purchase: true,
      created_at: '2024-11-18',
      helpful_count: 19,
    },
    {
      review_id: 'r1001_3',
      product_id: 1001,
      buyer_name: 'Karthik Bhat',
      rating: 4.5,
      title: 'Great bed with ample storage',
      review: 'Very happy with this purchase. The teak wood is of premium quality and the storage is a great feature for our bedroom.',
      verified_purchase: true,
      created_at: '2024-11-10',
      helpful_count: 15,
    },
  ],

  // Reviews for Handcrafted Coffee Table (1022)
  1022: [
    {
      review_id: 'r1022_1',
      product_id: 1022,
      buyer_name: 'Deepa Nambiar',
      rating: 5,
      title: 'Beautiful coffee table',
      review: 'This coffee table is exactly what I was looking for. The handcrafted details are beautiful and it is very functional with the storage shelf.',
      verified_purchase: true,
      created_at: '2024-11-20',
      helpful_count: 22,
    },
    {
      review_id: 'r1022_2',
      product_id: 1022,
      buyer_name: 'Arun Kumar',
      rating: 4.5,
      title: 'Excellent value',
      review: 'Great quality table at a reasonable price. The wood finish is smooth and it looks premium in my living room.',
      verified_purchase: true,
      created_at: '2024-11-15',
      helpful_count: 16,
    },
    {
      review_id: 'r1022_3',
      product_id: 1022,
      buyer_name: 'Nisha Pillai',
      rating: 4.5,
      title: 'Lovely table',
      review: 'Very pleased with this coffee table. It is sturdy, well-made, and the storage underneath is very convenient.',
      verified_purchase: true,
      created_at: '2024-11-08',
      helpful_count: 13,
    },
  ],

  // Reviews for Kamoni Solid Teakwood Sofa (1031)
  1031: [
    {
      review_id: 'r1031_1',
      product_id: 1031,
      buyer_name: 'Ramesh Iyer',
      rating: 5,
      title: 'Premium quality sofa',
      review: 'This teakwood sofa is absolutely gorgeous! The upholstery is premium and the wood finish is flawless. A great investment for our home.',
      verified_purchase: true,
      created_at: '2024-11-23',
      helpful_count: 28,
    },
    {
      review_id: 'r1031_2',
      product_id: 1031,
      buyer_name: 'Divya Krishnan',
      rating: 4.5,
      title: 'Excellent sofa',
      review: 'Very comfortable and stylish sofa. The teak wood is of excellent quality and it looks beautiful in our living room.',
      verified_purchase: true,
      created_at: '2024-11-16',
      helpful_count: 21,
    },
    {
      review_id: 'r1031_3',
      product_id: 1031,
      buyer_name: 'Sanjay Reddy',
      rating: 4,
      title: 'Great sofa',
      review: 'Good quality sofa with beautiful craftsmanship. Slightly expensive but worth it for the quality.',
      verified_purchase: true,
      created_at: '2024-11-11',
      helpful_count: 17,
    },
  ],

  // Reviews for Prestige Teak Wood Sofa (1032)
  1032: [
    {
      review_id: 'r1032_1',
      product_id: 1032,
      buyer_name: 'Pooja Sharma',
      rating: 5,
      title: 'Perfect sofa for our home',
      review: 'This sofa is comfortable, stylish, and very well-made. The teak wood is beautiful and the price is reasonable.',
      verified_purchase: true,
      created_at: '2024-11-21',
      helpful_count: 20,
    },
    {
      review_id: 'r1032_2',
      product_id: 1032,
      buyer_name: 'Manoj Kumar',
      rating: 4.5,
      title: 'Great value sofa',
      review: 'Excellent sofa for the price. The wood quality is good and it is very comfortable to sit on.',
      verified_purchase: true,
      created_at: '2024-11-14',
      helpful_count: 14,
    },
  ],
};

// Helper function to get reviews for a product
export const getProductReviews = (productId) => {
  return mockReviews[productId] || [];
};

// Helper function to get products by subcategory and seller
export const getProductsBySubcategoryAndSeller = (subcategoryId, sellerId) => {
  // Convert slug to numeric ID if needed
  const numericId = getSubcategoryIdFromSlug(subcategoryId);

  const products = mockProducts[numericId] || [];
  if (sellerId) {
    return products.filter(p => p.seller_id === parseInt(sellerId));
  }
  return products;
};

