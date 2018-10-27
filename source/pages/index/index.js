import 'normalize.css';
import createMenu from '../../components/menu/menu';
import './index.scss';

const menu = createMenu(['Главная', 'Блог'], 'menu');
document.body.appendChild(menu);
console.log('in index.js');

function merge(a, b) {
    return {
        ...a,
        ...b,
    };
}

console.log(merge(
    {a: 1},
    {b: 2},
));
