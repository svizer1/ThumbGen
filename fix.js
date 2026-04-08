const fs = require('fs');
const file = 'src/lib/youtube-packs.ts';
let content = fs.readFileSync(file, 'utf8');
const names = [
  'Майнкрафт Читы',
  'Стант на Вело',
  'Стант на Питбайке',
  'AI Технологии',
  'Шокирующая Реакция',
  'Заработок Денег',
  'Игровой Геймплей',
  'Как Сделать',
  'Челлендж',
  'Влог',
  'Обзор Техники',
  'Мотивация',
  'Минимализм',
  'Цветовые Блоки',
  'Новости'
];
let i = 0;
content = content.replace(/name: '[^']*'/g, () => 'name: \'' + names[i++] + '\'');
fs.writeFileSync(file, content);