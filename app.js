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

        getItemById: function(id) {
            const currItem = data.items.filter((item) => {
                return item.id === id;
            })

            return currItem;
        },

        updateItem: function(name, calories) {
            // turn the calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(item => {
                if (item.id === data.currentItem[0].id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }

            })
            return found;
        },

        getCurrentItem: function() {
            return data.currentItem;
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
        },
        getTotalCalories: function() {
            let total = 0;

            data.items.forEach(item => {
                total += item.calories;
            });

            // Set total calories in data structure
            data.totalCalories = total;

            return data.totalCalories;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        }
    }

})();



// UI Controller
const UiCtrl = (function() {

    // UI elements
    const UiElements = {
        itemList: document.querySelector('#item-list'),
        addBtn: document.querySelector('.add-btn'),
        deleteBtn: document.querySelector('.delete-btn'),
        updateBtn: document.querySelector('.update-btn'),
        backBtn: document.querySelector('.back-btn'),
        inputName: document.querySelector('#item-name'),
        inputCal: document.querySelector('#item-calories'),
        totalCalories: document.querySelector('.total-calories')
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
        },
        showTotalCalories: function(totalCal) {
            UiElements.totalCalories.textContent = totalCal;
        },
        setInitialState: function() {
            UiCtrl.clearInputFields();
            UiElements.deleteBtn.style.display = 'none';
            UiElements.updateBtn.style.display = 'none';
            UiElements.backBtn.style.display = 'none';
            UiElements.addBtn.style.display = 'inline';
        },

        showEditState: function() {
            UiElements.deleteBtn.style.display = 'inline';
            UiElements.updateBtn.style.display = 'inline';
            UiElements.backBtn.style.display = 'inline';
            UiElements.addBtn.style.display = 'none';
        },
        addItemToForm: function() {
            UiElements.inputName.value = ItemCtrl.getCurrentItem()[0].name;
            UiElements.inputCal.value = ItemCtrl.getCurrentItem()[0].calories;
            UiCtrl.showEditState();
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll('#item-list li');

            // Turn Node List into Array
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>
                    `;
                }
            });
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
        UiCtrl.getSelectors().addBtn.addEventListener('click', itemAddSubmit);

        // Disable Submit on 'Enter'
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
            }
        })

        // Edit Item icon click Event
        UiCtrl.getSelectors().itemList.addEventListener('click', itemEditSubmit);

        // Update Item Event
        UiCtrl.getSelectors().updateBtn.addEventListener('click', itemUpdateSubmit);

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

            // Add total Calories to the UI
            UiCtrl.showTotalCalories(totalCalories);

            // Clear Fields
            UiCtrl.clearInputFields();
        }

        e.preventDefault();
    }

    //  Edit Item Submit
    const itemEditSubmit = function(e) {
        if(e.target.classList.contains('edit-item')) {
            // Get list Item ID
            const listId = e.target.parentNode.parentNode.id;
            // Break into array
            const listIdArr = listId.split('-');
            // Get the actual ID
            const id = parseInt(listIdArr[1]);
            // get Item to edit
            const item = ItemCtrl.getItemById(id);

            // Set current Item to edit
            ItemCtrl.setCurrentItem(item);

            // Add item to form
            UiCtrl.addItemToForm();

        }
        e.preventDefault();
    }

    // Update Item Submit
    const itemUpdateSubmit = function(e) {
        // Get item input
        const input = UiCtrl.getUserInput();


        // Update item
        const updatedItem = ItemCtrl.updateItem(input.meal, input.calories);

        // Update UI
        UiCtrl.updateListItem(updatedItem);

        // Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();  

        // Add total Calories to the UI
        UiCtrl.showTotalCalories(totalCalories);

        // clear edit state
        UiCtrl.setInitialState();


        e.preventDefault();
    }

    // Public methodes
    return {
        init: function() {

            // Set Initial State
            UiCtrl.setInitialState();

            // Fetch Items from data Structure
            const items = ItemCtrl.getitems();
            
            if(items.length === 0) {
                UiCtrl.hideList();
            }else {
                // populate List with Items
                UiCtrl.populateItemList(items);
            }

            // Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();  
            // Add total Calories to the UI
            UiCtrl.showTotalCalories(totalCalories);
            // Clear Fields
            UiCtrl.clearInputFields();
            
            // Load Event Listeners
            loadEvenListeners();
        }
    }

    
})(ItemCtrl, UiCtrl);


// Initializing App
App.init();





