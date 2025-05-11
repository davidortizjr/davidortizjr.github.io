var products = [
    {
        "category": "Coffee",
        "contents": [
            {
                "isAvailable": true,
                "name": "Original Blend",
                "code": "ORGBLND",
                "image": "coffee",
                "sizes": [
                    { "name": "Small", "code": "SM", "price": 45 },
                    { "name": "Medium", "code": "MD", "price": 50 },
                    { "name": "Large", "code": "LG", "price": 55 }
                ]
            },
            {
                "isAvailable": true,
                "name": "Cold Brew",
                "code": "CLDBRW",
                "image": "coffee",
                "sizes": [
                    { "name": "Small", "code": "SM", "price": 50 },
                    { "name": "Medium", "code": "MD", "price": 55 },
                    { "name": "Large", "code": "LG", "price": 60 }
                ]
            },
            {
                "isAvailable": true,
                "name": "Latte",
                "code": "LATTE",
                "image": "coffee",
                "sizes": [
                    { "name": "Small", "code": "SM", "price": 60 },
                    { "name": "Medium", "code": "MD", "price": 65 },
                    { "name": "Large", "code": "LG", "price": 70 }
                ]
            },
            {
                "isAvailable": true,
                "name": "Cappuccino",
                "code": "CAPPU",
                "image": "coffee",
                "sizes": [
                    { "name": "Small", "code": "SM", "price": 60 },
                    { "name": "Medium", "code": "MD", "price": 65 },
                    { "name": "Large", "code": "LG", "price": 70 }
                ]
            },
            {
                "isAvailable": true,
                "name": "Espresso",
                "code": "ESP",
                "image": "coffee",
                "sizes": [
                    { "name": "Single", "code": "SNGL", "price": 45 },
                    { "name": "Double", "code": "DBL", "price": 55 }
                ]
            },
            {
                "isAvailable": true,
                "name": "Iced Macchiato",
                "code": "ICEDMAC",
                "image": "coffee",
                "sizes": [
                    { "name": "Small", "code": "SM", "price": 65 },
                    { "name": "Medium", "code": "MD", "price": 70 },
                    { "name": "Large", "code": "LG", "price": 75 }
                ]
            }
        ]
    },
    {
        "category": "Donut",
        "contents": [
            {
                "isAvailable": true,
                "name": "Glazed Donut",
                "code": "GLZD",
                "price": 35,
                "image": "donut"
            },
            {
                "isAvailable": true,
                "name": "Chocolate Frosted",
                "code": "CHOCFRST",
                "price": 40,
                "image": "donut"
            },
            {
                "isAvailable": true,
                "name": "Boston Kreme",
                "code": "BSTKRM",
                "price": 45,
                "image": "donut"
            },
            {
                "isAvailable": true,
                "name": "Strawberry Frosted",
                "code": "STRAWFRST",
                "price": 40,
                "image": "donut"
            },
            {
                "isAvailable": true,
                "name": "Old Fashioned",
                "code": "OLDFSH",
                "price": 35,
                "image": "donut"
            },
            {
                "isAvailable": true,
                "name": "Jelly Filled",
                "code": "JELLY",
                "price": 45,
                "image": "donut"
            },
            {
                "isAvailable": true,
                "name": "Blueberry Cake",
                "code": "BLUBRYCK",
                "price": 40,
                "image": "donut"
            }
        ]
    },
    {
        "category": "Combo",
        "contents": [
            {
                "isAvailable": true,
                "name": "Bacon, Egg & Cheese Combo",
                "code": "BEC COMBO",
                "price": 150,
                "image": "combo"
            },
            {
                "isAvailable": true,
                "name": "Sausage, Egg & Cheese Combo",
                "code": "SEC COMBO",
                "price": 150,
                "image": "combo"
            },
            {
                "isAvailable": true,
                "name": "Turkey Sausage Flatbread Combo",
                "code": "TSF COMBO",
                "price": 160,
                "image": "combo"
            },
            {
                "isAvailable": true,
                "name": "Ham, Egg & Cheese Combo",
                "code": "HEC COMBO",
                "price": 155,
                "image": "combo"
            },
            {
                "isAvailable": true,
                "name": "Wake-Up Wrap Combo",
                "code": "WRAP COMBO",
                "price": 140,
                "image": "combo"
            },
            {
                "isAvailable": true,
                "name": "Beyond Sausage Sandwich Combo",
                "code": "BYND COMBO",
                "price": 165,
                "image": "combo"
            }
        ]
    }
];

var total = 0;
var receiptItems = {};

function loadCategories() {
    var categoriesContainer = document.getElementById("categories");

    products.forEach((product, index) => {
        categoriesContainer.innerHTML += `
  <div onclick="loadProducts('`+ index + `')" class="card mx-1 my-2 custom-button p-3 text-center">
    <small>`+ product.category + `</small>
  </div>
`;
    });
}

function loadProducts(categoryIndex) {
    var maincontainer = document.getElementById("maincontainer");
    maincontainer.innerHTML = "";

    if (categoryIndex == 0) {
        products[categoryIndex].contents.forEach(content => {
            content.sizes.forEach(size => {
                maincontainer.innerHTML += `
      <div onclick="addToReceipt('`+ size.price + `','` + content.code + size.code + `','` + content.image + `')" class="card shadow mx-1 my-2 custom-button content p-3 d-flex align-items-center">
        <img src="img/`+ content.image + `.png" class="img-fluid py-2" width="100px" height="100px">
        <small class="py-5">`+ size.name + ' ' + content.name + `</small>
      </div>
    `;
            });
        });
    } else {
        products[categoryIndex].contents.forEach(content => {
            maincontainer.innerHTML += `
    <div onclick="addToReceipt('`+ content.price + `','` + content.code + `','` + content.image + `')" class="card shadow mx-1 my-2 custom-button content p-3  d-flex align-items-center">
      <img src="img/`+ content.image + `.png" class="img-fluid py-2" width="100px" height="100px">
      <small class="py-5">`+ content.name + `</small>
    </div>
  `;
        });
    }

}

function removeItem(code) {
    const item = receiptItems[code];

    total -= item.totalPrice;
    document.getElementById("totalValue").innerHTML = total;

    delete receiptItems[code];
    renderReceipt();
}

function renderReceipt() {
    const receiptContainer = document.getElementById("receipt");
    receiptContainer.innerHTML = "";

    Object.keys(receiptItems).forEach(code => {
        const item = receiptItems[code];
        const quantityLabel = item.quantity > 1 ? ` x` + item.quantity : ``;

        receiptContainer.innerHTML += `
        <div class="d-flex flex-row justify-content-between align-items-center m-1" style="border: 1px solid #898989; border-radius: 4px; padding: 8px;">
                <div class="d-flex flex-row align-items-center">
                    <img src="img/` + item.image + `.png" class="img-fluid" width="50px" height="50px">
                    <small class="mx-2">` + code + quantityLabel + `</small>
                </div>
                <small class="mx-2">` + item.totalPrice + `</small>
        </div>
        <div class="d-flex flex-row align-items-center">
            <button class="btn btn-danger btn-sm mx-2" onclick="removeItem('` + code + `')">Remove</button>
        </div>`;
    });
}

function addToReceipt(price, code, image) {

    price = parseFloat(price);
    document.getElementById("totalValue").innerHTML = total;

    if (receiptItems[code]) {
        receiptItems[code].quantity += 1;
        receiptItems[code].totalPrice += price;
    } else {
        receiptItems[code] = {
            quantity: 1,
            totalPrice: price,
            image: image
        };
    }

    total += price;
    document.getElementById("totalValue").innerHTML = total;

    renderReceipt();
}

loadCategories();