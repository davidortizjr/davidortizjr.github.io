var categories = [];
var products = [];

const getAllCategories = async () => {
    fetch(
        'http://localhost/Workspace/WebDev/davidortizjr.github.io/school/ADET/A06/categories.php'
    )
        .then(response => response.json())
        .then(data => {
            categories = data;
            loadCategories();
        });
}

const getAllProducts = async (categoryID) => {
      const categoryData = {
        categoryID: categoryID
      };

      fetch(
          'http://localhost/Workspace/WebDev/davidortizjr.github.io/school/ADET/A06/products.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
          })
        .then(response => response.json())
        .then(data => {
          products = data;
          loadProducts();
        });
    }

getAllCategories();

var total = 0;
var receiptItems = {};

function loadCategories() {
    var categoriesContainer = document.getElementById("categories");
    categoriesContainer.innerHTML = '';

    categories.forEach(function (category) {
        categoriesContainer.innerHTML += '<div onclick="getAllProducts(' + category.categoryID + ')" class="card mx-1 my-2 custom-button p-3 text-center">' +
            '<small>' + category.name + '</small>' +
            '</div>';
    });
}

function loadProducts(categoryID) {
    var maincontainer = document.getElementById("maincontainer");
    maincontainer.innerHTML = '';

    products.forEach(function (product) {
        if (product.size) {
            maincontainer.innerHTML += '<div onclick="addToReceipt(' + product.price + ',\'' + product.code + '\',\'' + product.img + '\')" class="card shadow mx-1 my-2 custom-button content p-3 d-flex align-items-center">' +
                '<img src="img/' + product.img + '.png" class="img-fluid py-2" width="100px" height="100px">' +
                '<small>' + product.size + ' ' + product.name + '</small>' +
                '</div>';
        } else {
            maincontainer.innerHTML += '<div onclick="addToReceipt(' + product.price + ',\'' + product.code + '\',\'' + product.img + '\')" class="card shadow mx-1 my-2 custom-button content p-3 d-flex align-items-center">' +
                '<img src="img/' + product.img + '.png" class="img-fluid py-2" width="100px" height="100px">' +
                '<small>' + product.name + '</small>' +
                '</div>';
        }
    });
}

function removeItem(code) {
    var item = receiptItems[code];
    total -= item.totalPrice;
    delete receiptItems[code];
    document.getElementById("totalValue").innerHTML = total;
    renderReceipt();
}

function renderReceipt() {
    var receiptContainer = document.getElementById("receipt");
    receiptContainer.innerHTML = '';

    Object.keys(receiptItems).forEach(function (code) {
        var item = receiptItems[code];
        var quantityLabel = item.quantity > 1 ? ' x' + item.quantity : '';

        receiptContainer.innerHTML += '<div class="d-flex flex-row justify-content-between align-items-center m-1" style="border: 1px solid #898989; border-radius: 4px; padding: 8px;">' +
            '<div class="d-flex flex-row align-items-center">' +
            '<img src="img/' + item.img + '.png" class="img-fluid" width="50px" height="50px">' +
            '<small class="mx-2">' + code + quantityLabel + '</small>' +
            '</div>' +
            '<small class="mx-2">' + item.totalPrice + '</small>' +
            '</div>' +
            '<div class="d-flex flex-row align-items-center">' +
            '<button class="btn btn-danger btn-sm mx-2" onclick="removeItem(\'' + code + '\')">Remove</button>' +
            '</div>';
    });
}

function addToReceipt(price, code, img) {
    price = parseFloat(price);
    document.getElementById("totalValue").innerHTML = total;

    if (receiptItems[code]) {
        receiptItems[code].quantity += 1;
        receiptItems[code].totalPrice += price;
    } else {
        receiptItems[code] = {
            quantity: 1,
            totalPrice: price,
            img: img
        };
    }

    total += price;
    document.getElementById("totalValue").innerHTML = total;
    renderReceipt();
}

loadCategories();