// top navigation component
import React from "react";
import ActionButton from "./ActionButton";
import Collapser from "./Collapser";

const ProductCollapsers: React.FC = () => {
  interface Tile {
    id: string;
    tileTitle: string;
    className: string;
    tileSize: "big" | "small";
    tileContent: React.ReactNode;
  }

  const collapserTiles: Tile[] = [
    {
      id: "apparel",
      tileTitle: "Apparel",
      className: "col-span-2 row-span-2 aspect-square",
      tileSize: "big",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a href="https://en-ca.ssactivewear.com/categories" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/ssactivewear.jpg"
                className="w-full"
                alt="SS Activewear"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              SS Activewear
            </h3>
          </a>
          <a
            href="https://canadasportswear.com/collections/all-styles"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/canadasportswear.png"
                className="w-full"
                alt="Canada Sportswear"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Canada Sportswear
            </h3>
          </a>
          <a
            href="https://www.sanmarcanada.com/catalog/category/view/id/1107?product_list_limit=25"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/sanmar.webp"
                className="w-full"
                alt="Sanmar Canada"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Sanmar Canada
            </h3>
          </a>
        </div>
      ),
    },
    {
      id: "bags",
      tileTitle: "Bags",
      className: "col-span-1 row-span-1 aspect-square",
      tileSize: "small",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a href="https://hpgbrands.ca/bags-totes/" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img src="/images/hpg.webp" className="w-full" alt="HPG Brands" />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              HPG Brands
            </h3>
          </a>
        </div>
      ),
    },
    {
      id: "office",
      tileTitle: "Office",
      className: "col-span-1 row-span-1 aspect-square",
      tileSize: "small",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a
            href="https://www.busrel.com/office-accessories-.htm"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img src="/images/busrel.webp" className="w-full" alt="Busrel" />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">Busrel</h3>
          </a>
          <a
            href="https://www.magnuspen.com/office-supplies.htm"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/magnus.webp"
                className="w-full"
                alt="Magnus Pen"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Magnus Pen
            </h3>
          </a>
        </div>
      ),
    },
    {
      id: "athletic-wear",
      tileTitle: "Athletic Wear",
      className: "col-span-2 row-span-1",
      tileSize: "small",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a
            href="https://en-ca.ssactivewear.com/ps/tops-activewear"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/ssactivewear.jpg"
                className="w-full"
                alt="SS Activewear"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              SS Activewear
            </h3>
          </a>
        </div>
      ),
    },
    {
      id: "drinkware",
      tileTitle: "Drinkware",
      className: "col-span-2 row-span-2 aspect-square",
      tileSize: "big",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a href="https://dezinecorp.com/root-category" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/dezine.webp"
                className="w-full"
                alt="SS Activewear"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Dezine Corp
            </h3>
          </a>
          <a
            href="https://www.promoplace.com/busrelcanada/drinkware.htm"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img src="/images/busrel.webp" className="w-full" alt="Busrel" />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">Busrel</h3>
          </a>
        </div>
      ),
    },
    {
      id: "fun-items",
      tileTitle: "Fun Items",
      className: "col-span-1 row-span-1 aspect-square",
      tileSize: "small",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a
            href="https://www.promoplace.com/busrelcanada/golf-accessories--sports.htm"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img src="/images/busrel.webp" className="w-full" alt="Busrel" />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">Busrel</h3>
          </a>
          <a
            href="https://www.keystoneline.com/catalog/key-tags"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/keystone.webp"
                className="w-full"
                alt="Keystone"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Keystone
            </h3>
          </a>
        </div>
      ),
    },
    {
      id: "hats",
      tileTitle: "Hats",
      className: "col-span-1 row-span-1 aspect-square",
      tileSize: "small",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a href="https://www.ajmintl.com/AJM-Advance-Search" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/ajm.webp"
                className="w-full"
                alt="AJM International"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              AJM International
            </h3>
          </a>
          <a
            href="https://en-ca.ssactivewear.com/ps/headwear-hats"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/ssactivewear.jpg"
                className="w-full"
                alt="SS Activewear"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              SS Activewear
            </h3>
          </a>
        </div>
      ),
    },
    {
      id: "leisure-items",
      tileTitle: "Leisure Items",
      className: "col-span-2 row-span-1",
      tileSize: "small",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a
            href="https://www.promoplace.com/busrelcanada/golf-accessories--sports.htm"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img src="/images/busrel.webp" className="w-full" alt="Busrel" />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">Busrel</h3>
          </a>
        </div>
      ),
    },
    {
      id: "hivis",
      tileTitle: "HI VIS",
      className: "col-span-1 row-span-1 aspect-square",
      tileSize: "small",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a
            href="https://canadasportswear.com/collections/brands-cx2-hi-vis"
            target="_blank"
          >
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/canadasportswear.png"
                className="w-full"
                alt="Canada Sportswear"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Canada Sportswear
            </h3>
          </a>
        </div>
      ),
    },
    {
      id: "full-catalog",
      tileTitle: "Full Catalog",
      className: "col-span-1 row-span-1 aspect-square",
      tileSize: "small",
      tileContent: (
        <div className="flex flex-row flex-wrap justify-start items-center space-x-4 space-y-2">
          <a href="https://canadasportswear.com" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/canadasportswear.png"
                className="w-full"
                alt="Canada Sportswear"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Canada Sportswear
            </h3>
          </a>
          <a href="https://www.promoplace.com/busrelcanada/" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img src="/images/busrel.webp" className="w-full" alt="Busrel" />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">Busrel</h3>
          </a>
          <a href="https://en-ca.ssactivewear.com" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/ssactivewear.jpg"
                className="w-full"
                alt="SS Activewear"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              SS Activewear
            </h3>
          </a>
          <a href="https://www.ajmintl.com" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/ajm.webp"
                className="w-full"
                alt="AJM International"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              AJM International
            </h3>
          </a>
          <a href="https://www.keystoneline.com/" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/keystone.webp"
                className="w-full"
                alt="Keystone"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Keystone
            </h3>
          </a>
          <a href="https://dezinecorp.com/" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/dezine.webp"
                className="w-full"
                alt="SS Activewear"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Dezine Corp
            </h3>
          </a>
          <a href="https://www.magnuspen.com/" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/magnus.webp"
                className="w-full"
                alt="Magnus Pen"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Magnus Pen
            </h3>
          </a>
          <a href="https://www.sanmarcanada.com/" target="_blank">
            <div className="rounded-xl overflow-hidden w-28 md:w-48 aspect-square hover:scale-105 transition-all ease-in-out bg-white">
              <img
                src="/images/sanmar.webp"
                className="w-full"
                alt="Sanmar Canada"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-lg hover:underline">
              Sanmar Canada
            </h3>
          </a>
        </div>
      ),
    },
  ];

  return collapserTiles.map((tile) => (
    <Collapser id={tile.id} title={tile.tileTitle}>
      {tile.tileContent}
    </Collapser>
  ));
};

export default ProductCollapsers;
