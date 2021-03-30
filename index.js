const form = document.forms.event;
const checkbox = form.checkbox;
let items = fetchItemsFromStorage();
const filterForm = document.forms.filterSettings;
const noteList = document.getElementById('list');
const mainContainer = document.getElementById('main');
const inputForm = document.querySelector('input[name="event"]');
const btnChangeTheme = document.querySelector('button.btn-change-theme');
const imageTheme = document.getElementById('image-theme');

inputForm.setAttribute('data-checked', false);

function fetchItemsFromStorage() {
	if(!localStorage.items) {
		localStorage.filter = filtrationUnit();
		let items = [];
		return items;
	}
	else {
		localStorage.filter = filtrationUnit();
		return JSON.parse(localStorage.items);
	}
}

// Переделать функцию генерации id
let id = 0;
function generationId() {
	id++;
	return id;
}

form.addEventListener('click', function(e) {
	const target = e.target;
	const checkForm = document.querySelector('span.checkbox');
	const checkImg = document.querySelector('img[name="check-form"]');
	const spanForm = form.querySelector('span');

	if(checkForm.contains(target)) {
		if(inputForm.getAttribute('data-checked') == 'false') {
			inputForm.setAttribute('data-checked', true);
			form.event.classList.add('performed');
			checkImg.classList.add('opasity');
			spanForm.classList.add('backgroundCheck');
		}else {
			inputForm.setAttribute('data-checked', false);
			form.event.classList.remove('performed');
			spanForm.classList.remove('backgroundCheck');
			checkImg.classList.remove('opasity');
		}	
	}
})

function addEvent(info) {
	let obj = {
		text: info.event.value,
		checked: JSON.parse(info.event.dataset.checked),
		id: generationId()
	};

	items.push(obj);

	localStorage.items = JSON.stringify(items);

	info.event.value = '';
}

form.addEventListener('submit',function(e) {
	e.preventDefault();

	addEvent(form);

	createNote(items, localStorage.filter);

})

mainContainer.addEventListener('click', function(e) {
	const target = e.target;

	const inputCheck = document.querySelectorAll('input[type="checkbox"]');

	const imageCheck = document.querySelectorAll(`img[name="check"]`);

	const btnClearCompleted = document.getElementById('btnClearCompleted');

	for(let i = 0; i < inputCheck.length; i++) {
		if(target == inputCheck[i]) {
			if(inputCheck[i].checked) {
				imageCheck[i].classList.add('opasity');
				items[i].checked = true;
				localStorage.items = JSON.stringify(items);
				createNote(items, localStorage.filter);
			}else if(!inputCheck.checked) {
				imageCheck[i].classList.remove('opasity');
				items[i].checked = false;
				localStorage.items = JSON.stringify(items);
				createNote(items, localStorage.filter);
			}
		}
	}

	if(target == btnClearCompleted) {
		clearCompletedItems();
	}

})

function createNote(model, filter) {
	getTheme();

	noteList.innerHTML = '';
	noteList.setAttribute('class', 'list-reverse');

	paintActiveFilter();

	showCountItems();

	if(filter == 'All') {

		for(let i = 0; i < model.length; i++) {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const inputCheckbox = document.createElement('input');
			const p = document.createElement('span');
			const btn = document.createElement('button');
			const imageDelete = document.createElement('img');
			const imageCheck = document.createElement('img');

			if(model[i].checked == true) {
				div.setAttribute('class', 'event borbott');
				span.setAttribute('class', 'checkbox backgroundCheck');
				inputCheckbox.setAttribute('type', 'checkbox');
				imageDelete.src = './images/icon-cross.svg';
				imageDelete.classList.add('img-delete');
				btn.classList.add('button-del');
				btn.setAttribute('onclick', 'deleteItem()');
				imageCheck.setAttribute('name', 'check');
				inputCheckbox.setAttribute('checked', 'check');
				imageCheck.setAttribute('class', 'img-check opasity');
				imageCheck.src = './images/icon-check.svg';
				p.setAttribute('class', 'inp-event performed');
			}else {
				div.setAttribute('class', 'event borbott');
				span.setAttribute('class', 'checkbox');
				inputCheckbox.setAttribute('type', 'checkbox');
				imageDelete.src = './images/icon-cross.svg';
				imageDelete.classList.add('img-delete');
				btn.classList.add('button-del');
				btn.setAttribute('onclick', 'deleteItem()');
				imageCheck.setAttribute('name', 'check');
				imageCheck.setAttribute('class', 'img-check');
				imageCheck.src = './images/icon-check.svg';
				p.setAttribute('class', 'inp-event');
			}

			btn.append(imageDelete);
			span.append(imageCheck);
			span.append(inputCheckbox);
			div.append(span);
			p.innerHTML = model[i].text;
			div.append(p);
			div.append(btn);
			noteList.append(div);
		}
	}else if(filter == 'Completed') {

		for(let i = 0; i < model.length; i++) {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const inputCheckbox = document.createElement('input');
			const p = document.createElement('span');
			const btn = document.createElement('button');
			const imageDelete = document.createElement('img');
			const imageCheck = document.createElement('img');

			if(model[i].checked == true) {
				div.setAttribute('class', 'event borbott');
				span.setAttribute('class', 'checkbox backgroundCheck');
				inputCheckbox.setAttribute('type', 'checkbox');
				imageDelete.src = './images/icon-cross.svg';
				imageDelete.classList.add('img-delete');
				btn.classList.add('button-del');
				btn.setAttribute('onclick', 'deleteItem()');
				imageCheck.setAttribute('name', 'check');
				inputCheckbox.setAttribute('checked', 'check');
				imageCheck.setAttribute('class', 'img-check opasity');
				imageCheck.src = './images/icon-check.svg';
				p.setAttribute('class', 'inp-event performed');

				btn.append(imageDelete);
				span.append(imageCheck);
				span.append(inputCheckbox);
				div.append(span);
				p.innerHTML = model[i].text;
				div.append(p);
				div.append(btn);
				noteList.append(div);
			}else {
				div.setAttribute('class', 'event borbott');
				span.setAttribute('class', 'checkbox');
				inputCheckbox.setAttribute('type', 'checkbox');
				imageDelete.src = './images/icon-cross.svg';
				imageDelete.classList.add('img-delete');
				btn.classList.add('button-del');
				btn.setAttribute('onclick', 'deleteItem()');
				imageCheck.setAttribute('name', 'check');
				imageCheck.setAttribute('class', 'img-check');
				imageCheck.src = './images/icon-check.svg';
				p.setAttribute('class', 'inp-event');

				btn.append(imageDelete);
				span.append(imageCheck);
				span.append(inputCheckbox);
				div.append(span);
				p.innerHTML = model[i].text;
				div.append(p);
				div.append(btn);
				noteList.append(div);
				div.classList.add('display-none');
			}	
		}
	}else if(filter == 'Active') {

		for(let i = 0; i < model.length; i++) {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const inputCheckbox = document.createElement('input');
			const p = document.createElement('span');
			const btn = document.createElement('button');
			const imageDelete = document.createElement('img');
			const imageCheck = document.createElement('img');

			if(model[i].checked == false) {
				div.setAttribute('class', 'event borbott');
				span.setAttribute('class', 'checkbox');
				inputCheckbox.setAttribute('type', 'checkbox');
				imageDelete.src = './images/icon-cross.svg';
				imageDelete.classList.add('img-delete');
				btn.classList.add('button-del');
				btn.setAttribute('onclick', 'deleteItem()');
				imageCheck.setAttribute('name', 'check');
				imageCheck.setAttribute('class', 'img-check');
				imageCheck.src = './images/icon-check.svg';
				p.setAttribute('class', 'inp-event');

				btn.append(imageDelete);
				span.append(imageCheck);
				span.append(inputCheckbox);
				div.append(span);
				p.innerHTML = model[i].text;
				div.append(p);
				div.append(btn);
				noteList.append(div);
			}else {
				div.setAttribute('class', 'event borbott');
				span.setAttribute('class', 'checkbox');
				inputCheckbox.setAttribute('type', 'checkbox');
				imageDelete.src = './images/icon-cross.svg';
				imageDelete.classList.add('img-delete');
				btn.classList.add('button-del');
				btn.setAttribute('onclick', 'deleteItem()');
				imageCheck.setAttribute('name', 'check');
				inputCheckbox.setAttribute('checked', 'check');
				imageCheck.setAttribute('class', 'img-check opasity');
				imageCheck.src = './images/icon-check.svg';
				p.setAttribute('class', 'inp-event performed');

				btn.append(imageDelete);
				span.append(imageCheck);
				span.append(inputCheckbox);
				div.append(span);
				p.innerHTML = model[i].text;
				div.append(p);
				div.append(btn);
				noteList.append(div);
				div.classList.add('display-none');
			}	
		}
	}
}

function filtrationUnit() {
	const radioButtons = document.querySelectorAll('input[type="radio"]');

	let filter;

	for(let i = 0; i < radioButtons.length; i++) {
		if(radioButtons[i].checked) {
			filter = radioButtons[i].value;			
			return filter;
		}
	}
}

filterForm.addEventListener('click', function(e) {
	const target = e.target;

	const radioButtons = document.querySelectorAll('input[type="radio"]');

	for(let i = 0; i < radioButtons.length; i++) {
		if(target == radioButtons[i]) {
			localStorage.filter = radioButtons[i].value;
			createNote(items, localStorage.filter);
		}
	}
});

function paintActiveFilter() {
	const radioButtons = document.querySelectorAll('input[type="radio"]');

	const filterRadio = document.querySelectorAll('label[name="filterName"]');

	for(let i = 0; i < radioButtons.length; i++) {
		if(radioButtons[i].checked) {
			filterRadio[i].classList.add('active-filter');
		}else {
			filterRadio[i].classList.remove('active-filter');
		}
	}
}

function showCountItems() {
	const itemsContainer = document.getElementById('countItems');

	if(localStorage.filter == 'All') {
		const countAll = items.length;
		itemsContainer.innerHTML = `${countAll} items left`;
	}else if(localStorage.filter == 'Completed') {
		const countCompleted = [];

		for(let i =0; i < items.length; i++) {
			if(items[i].checked) {
				countCompleted.push(items[i]);
			}
		}
		itemsContainer.innerHTML = `${countCompleted.length} items left`;
	}else if(localStorage.filter == 'Active') {
		const countActive = [];

		for(let i =0; i < items.length; i++) {
			if(!items[i].checked) {
				countActive.push(items[i]);
			}
		}
		itemsContainer.innerHTML = `${countActive.length} items left`;
	}
}

function clearCompletedItems() {
	const newItems = [];

	const question = confirm('You definitely want to delete all items ?');

	if(question) {
		for(let i = 0; i < items.length; i++) {

			if(!items[i].checked) {
				newItems.push(items[i]);
			}
		}

		// Array.prototype.filter
		//
		// items = items.filter(i => !i.checked);


		localStorage.items = JSON.stringify(newItems);

		items = JSON.parse(localStorage.items); // <-- лишний парсинг
		
		createNote(items, localStorage.filter);
	}
}

function deleteItem() {
	noteList.addEventListener('click', function(e) {
		const divItem = document.querySelectorAll('div.event');

		const btnDell = document.querySelectorAll('button.button-del');

		// console.log(divItem);

		for(let i = 0; i < divItem.length; i++) {
			if(btnDell[i].contains(e.target)) {
				const index = items.indexOf(items[i]);

				items.splice(index, 1);

				localStorage.items = JSON.stringify(items);

				items = JSON.parse(localStorage.items);
				// console.log(items[i])

				createNote(items, localStorage.filter);
			}
		}
	})
}

function changeTheme() {
	if(document.documentElement.getAttribute('theme') == 'dark') {
		imageTheme.src = "./images/icon-sun.svg";
		document.documentElement.setAttribute('theme', 'light');
		localStorage.theme = 'light';
	}else {
		imageTheme.src = "./images/icon-moon.svg";
		document.documentElement.setAttribute('theme', 'dark');
		localStorage.theme = 'dark';
	}
}

function getTheme(theme) {
	if(localStorage.theme == 'dark') {
		imageTheme.src = "./images/icon-moon.svg";
		document.documentElement.setAttribute('theme', 'dark');
	}else {
		imageTheme.src = "./images/icon-sun.svg";
		document.documentElement.setAttribute('theme', 'light');
	}
}

btnChangeTheme.addEventListener('click', changeTheme);

createNote(items, localStorage.filter);

// setTimeout(() => changeTheme(localStorage.theme),4000)
 // console.log(root)