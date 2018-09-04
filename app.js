// Storage Controller

// Item Controller
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
            // {
            //     id: 0,
            //     name: 'Steak Dinner',
            //     calories: 1200
            // },
            // {
            //     id: 1,
            //     name: 'Cookie',
            //     calories: 600
            // },
            // {
            //     id: 2,
            //     name: 'Eggs',
            //     calories: 300
            // }
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Public methodes
    return {
        getitems: function(){
            return data.items;
        },

        logData: function() {
            return data;
        },
        addItem: function(meal, calories) {
            console.log(data.items.length);
            // Creating ID
            let id;
            if(data.items.length > 0) {
                id = data.items.length;
            }else {
                id = 0
            }

            calories = parseInt(calories);

            const newItem = new Item(id ,meal, calories);
            data.items.push(newItem);

            return newItem;
        }
    }

})();



// UI Controller
const UiCtrl = (function() {

    // UI elements
    const UiElements = {
        itemList: document.querySelector('#item-list'),
        addBtn: document.querySelector('.add-btn'),
        inputName: document.querySelector('#item-name'),
        inputCal: document.querySelector('#item-calories')
    };
    
    // Public methodes
    return {
        populateItemList: function(items) {
            let html = '';
            items.forEach(item => {
                html+= `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>
                    </li>
                `;
            });
            
            // Insert Items to the DOM
            UiElements.itemList.innerHTML = html;

        },
        getSelectors: function() {
            return UiElements;
        },
        getUserInput: function() {
            return  {
                meal: UiElements.inputName.value,
                calories: UiElements.inputCal.value 
            };
        },
        addListItem: function(item) {
            // Show the list
            UiElements.itemList.style.display = 'block';

            // Create li Element
            const li = document.createElement('li');
            // Add Class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>
            `;
            // Insert item
            UiElements.itemList.insertAdjacentElement('beforeend', li);
        },
        hideList: function() {
            UiElements.itemList.style.display = 'none';
        },
        clearInputFields: function() {
            UiElements.inputName.value = '';
            UiElements.inputCal.value = '';
        }
    }

})(); 



// App Controller 
const App = (function(ItemCtrl, UiCtrl) {

    // Load Event Listeners
    const loadEvenListeners = function() {
        // Get UI elements
        const UiElements = UiCtrl.getSelectors();

        // Add Item Event
        UiElements.addBtn.addEventListener('click', itemAddSubmit);

    }

    // Add item Submit
    const itemAddSubmit = function(e) {
        // Get user input
        let input = UiCtrl.getUserInput();

        // make sure that the user has typed something
        if(input.meal && input.calories) {
            // add item
            const newItem = ItemCtrl.addItem(input.meal, input.calories);
            console.log('inside the condition')

            // Add Item to the UI list
            UiCtrl.addListItem(newItem);

            // Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Clear Fields
            UiCtrl.clearInputFields();
        }

        e.preventDefault();
    }

    // Public methodes
    return {
        init: function() {
            
            // Fetch Items from data Structure
            const items = ItemCtrl.getitems();
            
            if(items.length === 0) {
                UiCtrl.hideList();
            }else {
                // populate List with Items
                UiCtrl.populateItemList(items);
            }
            
            // Load Event Listeners
            loadEvenListeners();
        }
    }

    
})(ItemCtrl, UiCtrl);


// Initializing App
App.init();





