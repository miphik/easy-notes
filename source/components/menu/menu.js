import './menu.scss';

export default function (array, className) {
    const menu = document.createElement('ul');
    menu.className = className;
    let listItems = '';
    array.forEach(item => {
        listItems += `<li>${item}</li>`;
    });
    menu.innerHTML = listItems;
    return menu;
}
