const axios = require('axios');
const cheerio = require('cheerio');
const fs=require('fs');
const xlsx=require('xlsx');

async function getProduct() {
    try {
        const products = [];
        for (let i = 1; i < 4; i++) {
            const { data: HTML } = await axios.get(`https://www.meesho.com/homecare/pl/3ts?page=${i}`);
            //console.log(HTML);
            const $ = cheerio.load(HTML);
            //console.log($);


            $('.ProductList__GridCol-sc-8lnc8o-0').each((index, element) => {
                const name = $(element).find('.NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5').text().trim();
                const price = $(element).find('.NewProductCardstyled__PriceRow-sc-6y2tys-7').text().trim().replace('₹', '');
                const rating = $(element).find('.Rating__StyledPill-sc-12htng8-1 span').first().text().trim();


                products.push({ name, price, rating });
            });


        }
        console.log(products);

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(products);

        // Append the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'product');

        // Write the workbook to a file
        xlsx.writeFile(workbook, 'product.xlsx');
    } catch (error) {
        console.log("some issue:-", error.message);
    }

}
getProduct();

