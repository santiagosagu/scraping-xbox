const { chromium } = require("playwright");

const shops = [
  {
    vendor: "Microsoft",
    url: "https://www.xbox.com/es-es/configure/8WJ714N3RBTL",
    checkStock: async ({ page }) => {
      const content = await page.textContent(
        '[aria-label="Finalizar la compra del pack"]'
      );
      return (hasStock = content.includes("Sin existencias") === false);
    },
  },
  {
    vendor: "xtralife",
    url: "https://www.xtralife.com/producto/xbox-series-x-xbox-series/61325",
    checkStock: async ({ page }) => {
      const content = await page.textContent(".actionText");
      return content.includes("Reservas agotadas") === false;
    },
  },
  {
    vendor: "Amazon",
    url: "https://www.amazon.com/-/es/Microsoft-controladores-Xbox-inal%C3%A1mbricos-procesamiento/dp/B09JT3WNP1",
    checkStock: async ({ page }) => {
      const content = await page.textContent(".a-size-medium");
      return content.includes("No disponible por el momento.") === false;
    },
  },
  // {
  //   vendor: "MediaMarkt",
  //   url: "https://www.mediamarkt.es/es/product/_consola-microsoft-xbox-series-x-1-tb-ssd-negro-1487615.html",
  //   checkStock: async ({ page }) => {
  //     const content = await page.textContent(
  //       '[data-test="pdp-product-not-available"]'
  //     );
  //     return content.includes("no está disponible") === false;
  //   },
  // },
];
(async () => {
  const browser = await chromium.launch({ headless: false });

  for (const shop of shops) {
    const { checkStock, vendor, url } = shop;

    const page = await browser.newPage();
    await page.goto(url);

    const hasStock = await checkStock({ page });
    console.log(`${vendor}: ${hasStock ? "HAS STOCK!!!" : "OUT OF STOCK "}`);
    await page.screenshot({ path: `screenshots/${vendor}.png` });
    page.close();
  }

  await browser.close();
})();
