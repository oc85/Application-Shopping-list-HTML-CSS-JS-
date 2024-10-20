// Function to handle the load button click
function loadShoppingList() {
    document.getElementById('file-input').click();
}


///////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    var shopButtons = document.querySelectorAll('.shop-btn');
    var itemInput = document.getElementById('item-input');
    var addCartBtn = document.getElementById('add-cart-btn');
    var itemsContainers = document.querySelectorAll('.items');

    // Function to show only the items for the selected shop
    function showShopItems(shopName) {
        itemsContainers.forEach(function(container) {
            container.classList.remove('active');
            if (container.getAttribute('data-shop') === shopName) {
                container.classList.add('active');
            }
        });
    }

    // Function to handle shop button clicks
    function selectShop(event) {
        // Remove the 'active' class from all shop buttons
        shopButtons.forEach(function(btn) {
            btn.classList.remove('active');
        });

        // Add the 'active' class to the clicked button
        event.target.classList.add('active');

        // Show the items for the selected shop
        showShopItems(event.target.getAttribute('data-shop'));
    }

    // Function to add item to the cart
    function addItemToCart() {
        var itemText = itemInput.value.trim();
        if (itemText !== '') {
            var activeShopItems = document.querySelector('.items.active');
            var newButton = document.createElement('button');
            newButton.classList.add('item');
            newButton.textContent = itemText;
            newButton.onclick = function() { toggleCrossedOut(this); };
            activeShopItems.appendChild(newButton);
            itemInput.value = '';
        }
    }

    // Add click event listener to the add-cart-btn
    addCartBtn.addEventListener('click', addItemToCart);

    // Function to toggle the crossed-out style for an item
    function toggleCrossedOut(item) {
        item.classList.toggle('crossed-out');
    }

    // Function to generate a text file with the shopping list
    function generateTextFile() {
        // ... (The generateTextFile function you provided earlier) ...
    }

    // Initially show the first shop's items
    showShopItems(shopButtons[0].getAttribute('data-shop'));

    shopButtons.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            selectShop(event);
        });
    });

    // Prevent the shop button active state from being removed when the input is focused
    itemInput.addEventListener('focus', function() {
        shopButtons.forEach(function(btn) {
            if (btn.classList.contains('active')) {
                btn.classList.add('active');
            }
        });
    });

});



///////////////////////////////////////////////////////////////////////////
function generateTextFile() {
    // Find all items containers
    const itemsContainers = document.querySelectorAll('.items');
    let textContent = '';

    // Loop through each container and build the text content
    itemsContainers.forEach(container => {
        const shopName = container.getAttribute('data-shop');
        textContent += `Shop: ${shopName}\n`;
        const items = container.querySelectorAll('.item');
        items.forEach(item => {
            textContent += `- ${item.textContent}\n`;
        });
        textContent += '\n';
    });

    // Create a Blob object representing the text file
    const blob = new Blob([textContent], { type: 'text/plain' });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a new link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shopping_list.txt'; // Name of the downloaded file

    // Append the link to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up the URL after the download has started
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}

///////////////////////////////////////////////////////////////////////////
function toggleCrossedOut(item) {
    item.classList.toggle('crossed-out');
}

///////////////////////////////////////////////////////////////////////////

  
// Add an event listener for the file input change event
document.getElementById('file-input').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            updateShopsFromText(text);  // Parse and update the UI
        };
        reader.readAsText(file);
    }
});


// This function should be called after the text file is read
function updateShopsFromText(text) {
    // Split the text by double newlines to separate each shop section
    const shops = text.split(/\n\s*\n/);

    shops.forEach(shopSection => {
        const lines = shopSection.split('\n');
        let shopName = null;
        const shopItems = [];

        lines.forEach(line => {
            if (line.startsWith('Shop: ')) {
                // Get the shop name from the line
                shopName = line.replace('Shop: ', '').trim();
            } else if (shopName && line.trim()) {
                // Trim and remove leading hyphens from the items
                const item = line.trim().replace(/^- */, '');
                shopItems.push(item);
            }
        });

        // If shopName is found, update the corresponding shop's items
        if (shopName) {
            console.log(`Updating shop: ${shopName} with items:`, shopItems);
            updateShopItems(shopName, shopItems);
        }
    });
}

// Function to update items for a specific shop
function updateShopItems(shopName, items) {
    const shopContainer = document.querySelector(`.items[data-shop="${shopName.toLowerCase()}"]`);
    if (shopContainer) {
        shopContainer.innerHTML = '';  // Clear existing items

        // Add each item as a button in the shop's container
        items.forEach(item => {
            const newButton = document.createElement('button');
            newButton.classList.add('item');
            newButton.textContent = item;
            newButton.onclick = function() {
                toggleCrossedOut(this);  // Allow crossing out items
            };
            shopContainer.appendChild(newButton);
        });
    } else {
        console.error(`Could not find container for shop: ${shopName}`);
    }
}

// Function to toggle the crossed-out style for an item
function toggleCrossedOut(item) {
    item.classList.toggle('crossed-out');
}




