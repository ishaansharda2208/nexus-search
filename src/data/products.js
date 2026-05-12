// ─── Product Catalog ────────────────────────────────────────────────────────
// 1000 curated products: phones, TVs, laptops
// Kept in memory — never sent to LLM

const BRANDS = {
  phones: ["Apple", "Samsung", "Google", "OnePlus", "Sony", "Motorola", "Xiaomi", "Nothing", "ASUS", "Oppo"],
  tvs: ["Samsung", "LG", "Sony", "TCL", "Hisense", "Vizio", "Philips", "Panasonic", "Sharp", "Toshiba"],
  laptops: ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Microsoft", "Acer", "Razer", "MSI", "LG"],
};

const COLORS = {
  phones: ["Midnight Black", "Pearl White", "Ocean Blue", "Sage Green", "Rose Gold", "Titanium", "Coral", "Lavender", "Graphite", "Cream"],
  tvs: ["Jet Black", "Brushed Silver", "Carbon Gray", "Matte Black", "Champagne Gold"],
  laptops: ["Space Gray", "Silver", "Midnight Blue", "Platinum", "Onyx Black", "Rose Gold", "Frost White", "Storm Gray"],
};

const PHONE_MODELS = [
  "Pro Max", "Ultra", "Plus", "Lite", "Edge", "Flip", "Fold", "Note", "Play", "Neo",
  "X Pro", "S Series", "Vision", "Pixel", "Ace", "Spark", "Velocity", "Fusion", "Nova", "Pulse",
];

const TV_MODELS = [
  "QLED", "OLED", "Crystal", "Nanocell", "MiniLED", "FrameTV", "4K Pro", "8K Vision",
  "Bravia", "Signature", "UltraView", "ClearScreen",
];

const LAPTOP_MODELS = [
  "Pro", "Air", "Studio", "XPS", "Spectre", "ThinkPad", "Inspiron", "Zenbook",
  "Surface", "Blade", "Creator", "Swift", "Aspire", "Book Pro", "Gram",
];

const TV_SIZES = [32, 43, 50, 55, 65, 75, 85, 98];
const PHONE_STORAGE = [64, 128, 256, 512, 1024];
const LAPTOP_RAM = [8, 16, 32, 64];
const LAPTOP_STORAGE = [256, 512, 1024, 2048];

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function pick(arr, seed) {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function generatePhone(id, index) {
  const brand = pick(BRANDS.phones, index * 3);
  const model = pick(PHONE_MODELS, index * 7);
  const color = pick(COLORS.phones, index * 11);
  const storage = pick(PHONE_STORAGE, index * 13);
  const basePrice = 199 + Math.floor(seededRandom(index * 17) * 1200);
  const price = Math.round(basePrice / 10) * 10 - 1;
  const ram = [4, 6, 8, 12, 16][Math.floor(seededRandom(index * 19) * 5)];
  const cameras = [12, 48, 50, 64, 108, 200][Math.floor(seededRandom(index * 23) * 6)];
  const year = 2022 + Math.floor(seededRandom(index * 29) * 3);

  return {
    id,
    category: "phone",
    brand,
    name: `${brand} ${model} ${storage}GB`,
    model,
    price,
    color,
    storage: `${storage}GB`,
    ram: `${ram}GB`,
    camera: `${cameras}MP`,
    year,
    specs: `${storage}GB Storage • ${ram}GB RAM • ${cameras}MP Camera • ${year}`,
    rating: (3.5 + seededRandom(index * 31) * 1.5).toFixed(1),
    reviews: 100 + Math.floor(seededRandom(index * 37) * 4900),
  };
}

function generateTV(id, index) {
  const brand = pick(BRANDS.tvs, index * 3);
  const model = pick(TV_MODELS, index * 7);
  const color = pick(COLORS.tvs, index * 11);
  const size = pick(TV_SIZES, index * 13);
  const basePrice = 199 + Math.floor(seededRandom(index * 17) * 3800);
  const price = Math.round(basePrice / 10) * 10 - 1;
  const resolution = size >= 65 ? "8K" : "4K";
  const refreshRate = [60, 120, 144, 240][Math.floor(seededRandom(index * 23) * 4)];
  const year = 2022 + Math.floor(seededRandom(index * 29) * 3);

  return {
    id,
    category: "tv",
    brand,
    name: `${brand} ${size}" ${model} ${resolution}`,
    model,
    price,
    color,
    size: `${size}"`,
    resolution,
    refreshRate: `${refreshRate}Hz`,
    year,
    specs: `${size}" • ${resolution} • ${refreshRate}Hz • ${model} Panel • ${year}`,
    rating: (3.5 + seededRandom(index * 31) * 1.5).toFixed(1),
    reviews: 50 + Math.floor(seededRandom(index * 37) * 2000),
  };
}

function generateLaptop(id, index) {
  const brand = pick(BRANDS.laptops, index * 3);
  const model = pick(LAPTOP_MODELS, index * 7);
  const color = pick(COLORS.laptops, index * 11);
  const ram = pick(LAPTOP_RAM, index * 13);
  const storage = pick(LAPTOP_STORAGE, index * 17);
  const basePrice = 399 + Math.floor(seededRandom(index * 19) * 3200);
  const price = Math.round(basePrice / 10) * 10 - 1;
  const displaySize = [13.3, 14, 15.6, 16, 17.3][Math.floor(seededRandom(index * 23) * 5)];
  const cpu = pick(["Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M2", "Apple M3", "Apple M3 Pro", "Apple M3 Max"], index * 29);
  const year = 2022 + Math.floor(seededRandom(index * 31) * 3);

  return {
    id,
    category: "laptop",
    brand,
    name: `${brand} ${model} ${displaySize}"`,
    model,
    price,
    color,
    ram: `${ram}GB`,
    storage: `${storage}GB`,
    display: `${displaySize}"`,
    cpu,
    year,
    specs: `${cpu} • ${ram}GB RAM • ${storage}GB SSD • ${displaySize}" Display • ${year}`,
    rating: (3.5 + seededRandom(index * 37) * 1.5).toFixed(1),
    reviews: 30 + Math.floor(seededRandom(index * 41) * 3000),
  };
}

// Generate exactly 1000 products (400 phones, 300 TVs, 300 laptops)
function generateCatalog() {
  const products = [];
  let id = 1;

  for (let i = 0; i < 400; i++) products.push(generatePhone(id++, i + 1));
  for (let i = 0; i < 300; i++) products.push(generateTV(id++, i + 401));
  for (let i = 0; i < 300; i++) products.push(generateLaptop(id++, i + 701));

  return products;
}

export const PRODUCTS = generateCatalog();
export const TOTAL_COUNT = PRODUCTS.length;
