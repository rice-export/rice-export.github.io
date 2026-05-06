// ==========================================
// GURU TEJA HERITAGE EXPORTS - PRODUCT DATABASE
// ==========================================

/**
 * Product Database
 * Contains all rice varieties with specifications and pricing
 */
const products = [
    {
        id: 1,
        name: "1121 XXXL Extra Long Basmati",
        type: "basmati",
        price: 1250,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvB_UptGZfCOcfDGFMmilKk8ZuY5pmd0C9rjkDvhVU7if5Au8bpjGEzpSZNW0OjIcdgeuZ7s6Hs70tcHQwSBTBBJ_n_5WWzNxHgeOfhTL4-x4ixekDq3dkpKCJJjjO2AiKGiT6OtSk0qMnvaIT88tUEaUnpz3Lr0LacBLI_UdybmoVzPXV97SAGEmmI6IjTkLMdRJyuSTWoa8CKux3iW3PSlBYOMpJwYMUrUc2ckwHDmDT_6wCDH0QT0S3PrNy_Yh7Pngso3crWCrG",
        description: "Premium aged basmati rice with 2 years maturation for enhanced aroma.",
        grainLength: "extra-long",
        badge: "Grade A++ Premium",
        specs: {
            moisture: "12.5% Max",
            length: "8.35mm",
            purity: "< 2% Broken",
            broken: "< 2%"
        },
        details: "Aged for 2 years to perfection. Known globally for its distinct aroma and exquisite length after cooking.",
        certifications: ["ISO 9001:2015", "HACCP"]
    },
    {
        id: 2,
        name: "Traditional Golden Parboiled",
        type: "parboiled",
        price: 950,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDskjpumrLFJmsJ7tdHaLfdHNIELX7VfiMD2CmzqLNhUbDAUIShR3k7sa4tSne8inISBEqNs_f2DKyWtso0XKwCBVZNdO2cqNHmRlZnMz8GGehOG0oGeX45IMTjy0vebz6wk-QdYM0_rV-FfM2iHmLogdzGx2nkKBM1PipDSTa7Yk8LEG6NJhxZy66ScHIME66ezvNqw98M9hpqIU8nFHj2Nc2012nBylYl5xKjXj0GPOLxCsycxpJhCCgfvLIfSf1DHJx04zec7HIE",
        description: "Nutritious parboiled rice perfect for catering and food service.",
        grainLength: "long",
        badge: "Export Quality",
        specs: {
            moisture: "13% Max",
            length: "6.00mm",
            purity: "100% Clean",
            broken: "< 5%"
        },
        details: "High nutritional value and easy to digest. Ideal for bulk catering and industrial kitchens.",
        certifications: ["ISO 9001:2015", "HACCP"]
    },
    {
        id: 3,
        name: "IR-64 Long Grain White",
        type: "white",
        price: 750,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVPcCBjqOHRVGclR7IUCHb3px94BENBMSuocuhXkr3Dz4dKGTUZimZlzIQsJ6I7JVdC3zMLb7HUQYgyldKNdY_R_aLZXZZilDKnA3iZZKMSjcAw8drPAMeYgpNzl_jQuON9QhiildbLc7au8k23AtPOqBSOocyox8_pm0hjWEsgYO88NBWc44rgPF3xIJBEIrXxh8lBtTwxtZ5A8eNMRL7pUlB_LIinMHzu_RvqUsjDjGQXtsDpEXtg01wM0pFhALYXXduYkkt0QyT",
        description: "Cost-effective long-grain white rice for wholesale markets.",
        grainLength: "long",
        badge: "Economy",
        specs: {
            moisture: "14% Max",
            length: "6.40mm",
            purity: "95% Min",
            broken: "< 5%"
        },
        details: "Cost-effective solution for global food security and wholesale distributors.",
        certifications: ["ISO 9001:2015"]
    },
    {
        id: 4,
        name: "Super Kernal Jasmine",
        type: "jasmine",
        price: 1100,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDALvn0y3IJwgAfuNOiYw3DhJjoLVdBhS7jJWeaKaAjaqs7TOuFZYdI91I3CQG__gWEtQMoRq-imyIOJv9Wh4NaoKDURCahsYAKrKmI-cbTKNCEUcPnQG8SHG091iC30PylWa5sdbQc5tN9PanUu5jkbQugkYaOy7pVWooEIwlTUqAO7foeWlIyRSnHyr1DdhOnNr4o7JkCZoRsk0iJDIMVr9xVuwzoaHV9K26L12cfd9a4EVDGq1OKhVwO7wHGvXH7HX0tVJdIZlCp",
        description: "Fragrant jasmine rice with exceptional aroma and sticky texture.",
        grainLength: "extra-long",
        badge: "New Harvest",
        specs: {
            moisture: "12% Max",
            length: "7.20mm",
            purity: "< 3% Chalky",
            broken: "< 3%"
        },
        details: "Exceptional fragrance and sticky texture. Harvested from the region's most fertile river belts.",
        certifications: ["ISO 9001:2015", "HACCP"]
    }
];

/**
 * Get all products or filter by criteria
 * @param {Object} filters - Filter criteria {type, grainLength}
 * @returns {Array} Filtered products array
 */
function getProducts(filters = {}) {
    let filtered = products;

    if (filters.type && filters.type.length > 0) {
        filtered = filtered.filter(p => filters.type.includes(p.type));
    }

    if (filters.grainLength && filters.grainLength !== 'all') {
        filtered = filtered.filter(p => p.grainLength === filters.grainLength);
    }

    return filtered;
}

/**
 * Get single product by ID
 * @param {number} id - Product ID
 * @returns {Object} Product object
 */
function getProductById(id) {
    return products.find(p => p.id === id);
}

/**
 * Sort products by criteria
 * @param {Array} productList - Products to sort
 * @param {string} sortBy - Sort criteria (default, price-low, price-high)
 * @returns {Array} Sorted products array
 */
function sortProducts(productList, sortBy = 'default') {
    const sorted = [...productList];

    switch (sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        default:
            // Keep original order
            break;
    }

    return sorted;
}
