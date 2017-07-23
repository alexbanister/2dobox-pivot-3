$(document).ready(displayAllCards);
$('.title-input, .body-input').keyup(disableSaveButton);
$('.idea-card-parent').on('click', '#delete', deleteCard);
$('.save-btn').on('click', saveNewCard);
$('.search-input').on('keyup', searchCards);
$('.idea-card-parent').on('keydown', 'h2', updateCardInfo);
$('.idea-card-parent').on('keydown', '.body-text', updateCardInfo);
$('.idea-card-parent').on('click', '.ratings', changeImportance);

function setLocalStorage(array) {
  localStorage.setItem('array', JSON.stringify(array));
};

function retrieveLocalStorage() {
  return JSON.parse(localStorage.getItem('array')) || [];
};

function displayAllCards() {
  var cardArray = retrieveLocalStorage();
  cardArray.forEach(function(card) {
    addCards(card);
  })
}

function CardElements(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.quality = 0;
};

function disableSaveButton() {
  if (($('.title-input').val()) && ($('.body-input').val())) {
    $('.save-btn').attr('disabled', false);
  } else {
    $('.save-btn').attr('disabled', true);
  }
}

function deleteCard() {
  var currentCardId = parseInt($(this).closest('.todo-card')[0].id);
  var index = getIndex(currentCardId);
  var cardArray = retrieveLocalStorage();
  if (index >= 0) {
    cardArray.splice(index, 1);
  }
  setLocalStorage(cardArray);
  $(this).parents('.todo-card').remove();
}

function getIndex(id) {
  var allCards = retrieveLocalStorage();
  var index = allCards.findIndex(function(card) {
    return card.id === id;
  })
  return index;
}

function changeImportance(e) {
  var cardId = parseInt($(e.target).closest('.todo-card')[0].id);
  var index = getIndex(cardId);
  var cardArray = retrieveLocalStorage();
  cardArray[index].quality += validateChange(e, cardArray[index].quality);
  setLocalStorage(cardArray);
  displayImportance(cardId, index);
}

function validateChange(e, currentVal) {
  var increment = ($(e.target).attr('id') === 'upvote') ? 1 : -1;
  var newVal = increment + currentVal;
  if (newVal >= 0 && newVal < getImportanceLevels().length) {
    return increment;
  } else {
    return 0;
  }
}

function getImportanceLevels(){
  return ["None", "Low", "Normal", "High", "Critical"]
}

function displayImportance(id, index) {
  var cardArray = retrieveLocalStorage();
  var importance = cardArray[index].quality;
  var importanceText = getImportanceLevels();
  $('#'+id).find('.new-quality').text(importanceText[importance]);
}

function saveNewCard(e) {
  e.preventDefault();
  fireCards();
  disableSaveButton();
}

function updateCardInfo(e) {
  if (e.keyCode == 13 && !e.shiftKey) {
    event.preventDefault();
    this.blur();
    updateText(e);
  }
}

function updateText(e) {
  var id = parseInt($(e.target).closest('.todo-card')[0].id);
  var index = getIndex(id);
  var cardArray = retrieveLocalStorage();
  cardArray[index].title = $('#'+id).find('h2').text();
  cardArray[index].body = $('#'+id).find('body-text').text();
  setLocalStorage(cardArray);
}

function searchCards() {
  var cardArray = retrieveLocalStorage();
  var results = cardArray.filter(function(elementCard) {
    return elementCard.title.toUpperCase().includes($('.search-input').val().toUpperCase()) ||
           elementCard.body.toUpperCase().includes($('.search-input').val().toUpperCase());
  });
  $('.idea-card-parent').empty();
  for (var i = 0; i < results.length; i++) {
    addCards(results[i]);
  }
};

function addCards(buildCard) {
  var template = $('#card-template').clone();
  template.attr('id', buildCard.id);
  template.find('h2').text(buildCard.title);
  template.find('.body-text').text(buildCard.body);
  $('.idea-card-parent').prepend(template);
  displayImportance(buildCard.id, getIndex(buildCard.id));
};

function fireCards() {
  var newCard = new CardElements($('.title-input').val(), $('.body-input').val());
  var cardArray = retrieveLocalStorage();
  cardArray.push(newCard)
  setLocalStorage(cardArray);
  addCards(newCard);
  clearInputs();
};

function clearInputs() {
  $('.title-input').val('');
  $('.body-input').val('');
  $('.title-input').focus();
};
