// types/products.ts

export interface ProductCategory {
  id: string;
  title: string;
  imageSrc: string;
  linkHref: string;
  description?: string;
}

export const productCategories: ProductCategory[] = [
  {
    id: "apparel",
    title: "Apparel",
    imageSrc: "/images/product-categories/apparel-stacked-tshirts.png",
    linkHref: "/categories/apparel",
    description: "Custom t-shirts, polo shirts, and branded clothing",
  },
  {
    id: "athletic",
    title: "Athletic",
    imageSrc: "/images/product-categories/athletic-polo.png",
    linkHref: "/categories/athletic",
    description: "Performance wear and athletic gear",
  },
  {
    id: "hats",
    title: "Hats",
    imageSrc: "/images/product-categories/hats-baseball-cap.png",
    linkHref: "/categories/hats",
    description: "Baseball caps, beanies, and headwear",
  },
  {
    id: "hi-vis",
    title: "HI VIS",
    imageSrc: "/images/product-categories/hi-vis-safety-vest.png",
    linkHref: "/categories/hi-vis",
    description: "High visibility safety gear and workwear",
  },
  {
    id: "leisure",
    title: "Leisure",
    imageSrc: "/images/product-categories/leisure-golf-ball.png",
    linkHref: "/categories/leisure",
    description: "Golf balls and recreational items",
  },
  {
    id: "drinkware",
    title: "Drinkware",
    imageSrc: "/images/product-categories/drinkware-mug.png",
    linkHref: "/categories/drinkware",
    description: "Mugs, water bottles, and drink containers",
  },
  {
    id: "office",
    title: "Office",
    imageSrc: "/images/product-categories/office-supplies.png",
    linkHref: "/categories/office",
    description: "Office supplies and stationery",
  },
  {
    id: "bags",
    title: "Bags",
    imageSrc: "/images/product-categories/bags-backpack.png",
    linkHref: "/categories/bags",
    description: "Backpacks, totes, and carry bags",
  },
];
