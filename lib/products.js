

const baseProducts = [
  { id: 1, name: "Widget", price: 9.99 },
  { id: 2, name: "Gadget", price: 12.49 },
  { id: 3, name: "Doohickey", price: 7.5 },
];

// Allowed numeric versions and mapping to 'vX' strings
const VERSION_MAP = {
  1: "v1",
  2: "v2",
  v1: "v1",
  v2: "v2",
};

function getProductsForVersion(version) {
  const v = normalizeVersion(version);
  if (v === "v1") {
    return baseProducts;
  }

  if (v === "v2") {
    
    return baseProducts.map((p) => ({
      ...p,
    
      sku: `SKU-${p.id}-V2`,
      tags: ["stable", "v2"],
    }));
  }

  
  throw new Error("Unsupported version");
}

// Normalize incoming version (accepts '1', 'v1', 1, etc.)
function normalizeVersion(raw) {
  if (!raw && raw !== 0) return "v1"; //default
  const s = String(raw).toLowerCase().replace(/^v/, "");
  if (s === "1") return "v1";
  if (s === "2") return "v2";
  throw new Error(`Invalid version: ${raw}`);
}

export {
  getProductsForVersion,
  normalizeVersion,
};
