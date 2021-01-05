import { bind, wire } from 'hyperhtml';

interface Card {
  id: string;
  text: string;
  title?: string;
  secretText?: string;
  picture?: string;
  tags: string[];
  color?: string;
}

var card: Card = {
  id: 'unique-card',
  text: 'Clean inbox all the way!',
  secretText: 'Delete incriminating evidence!',
  //picture: 'https://smidgeo.com/images/smidgeo_headshot.jpg',
  picture:
    'https://smidgeo.com/notes/deathmtn/media/54F917E8-D61B-4D7D-8537-7073D2E53713.jpeg',
  tags: ['email', 'maintenance', 'chore'],
  color: 'hsl(0, 50%, 50%)'
};

function renderCard(card) {
  bind(
    document.getElementById('temp')
  )`<div class="card" style="background-color: ${card.color}">
    <h2 contenteditable>${card.title || card.text}</h2>
    <img src="${card.picture}" alt="Card illustration">
    <div class="text" contenteditable>${card.text}</div>
    <div class="secret text" contenteditable>${card.secretText}</div>
    <div class="tags" contenteditable>${card.tags.map(renderTag)}</div>
   </div>`;
}

function renderTag(tag) {
  return wire()`<span class="tag">${tag}</span>`;
}

renderCard(card);
