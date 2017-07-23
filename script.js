$(document).ready(displayAllCards);
$('.title-input, .task-input').keyup(disableSaveButton);
$('.todo-card-parent').on('click', '#delete', deleteCard);
$('.save-btn').on('click', saveNewCard);
$('.filter-input').on('keyup', filterCards);
$('.todo-card-parent').on('keydown', 'h2', updateCardInfo);
$('.todo-card-parent').on('keydown', '.task-text', updateCardInfo);

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

function CardElements(title, task) {
  this.title = title;
  this.task = task;
  this.id = Date.now();
  this.quality = 0;
};

function disableSaveButton() {
  if (($('.title-input').val()) && ($('.task-input').val())) {
    $('.save-btn').attr('disabled', false);
  } else {
    $('.save-btn').attr('disabled', true);
  }
}

function deleteCard() {
  var currentCardId = parseInt($(this).closest('.idea-card')[0].id);
  var index = getIndex(currentCardId);
  var cardArray = retrieveLocalStorage();
  if (index >= 0) {
    cardArray.splice(index, 1);
  }
  setLocalStorage(cardArray);
  $(this).parents('.idea-card').remove();
}

function getIndex(id) {
  var allCards = retrieveLocalStorage();
  var index = allCards.findIndex(function(card) {
    return card.id === id;
  })
  return index;
}

// UPVOTE AND DOWN BUTTONS THAT COMMUNITCATE CHANGE TO STORAGE
$('.idea-card-parent').on('click', '.ratings', changeQuality);

function changeQuality(e) {
  e.preventDefault();
  var cardId = parseInt($(e.target).closest('.idea-card')[0].id);
  var index = getIndex(cardId);
  var cardArray = retrieveLocalStorage();
  if ($(e.target).attr('id') === 'upvote') {
    var i = 1;
  } else {
    var i = -1;
  }
  var newVal = cardArray[index].quality;
  newVal = newVal + i;
  if (newVal >= 0 && newVal <= 2) {
    cardArray[index].quality += i;
  }
  setLocalStorage(cardArray);
  displayQuality(cardId, index);
}

function displayQuality(id, index) {
  var cardArray = retrieveLocalStorage();
  var quality = cardArray[index].quality;
  var status = ["swill", "plausible", "genius"];
  $('#'+id).find('.card-quality').text(status[quality]);
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
  var id = parseInt($(e.target).closest('.idea-card')[0].id);
  var index = getIndex(id);
  var cardArray = retrieveLocalStorage();
  cardArray[index].title = $('#'+id).find('h2').text();
  cardArray[index].task = $('#'+id).find('.task-text').text();
  setLocalStorage(cardArray);
}

function filterCards() {
  var cardArray = retrieveLocalStorage();
  var results = cardArray.filter(function(elementCard) {
    return elementCard.title.toUpperCase().includes($('.filter-input').val().toUpperCase()) ||
           elementCard.task.toUpperCase().includes($('.filter-input').val().toUpperCase());
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
  template.find('.task-text').text(buildCard.task);
  $('.idea-card-parent').prepend(template);
};

function fireCards() {
  var newCard = new CardElements($('.title-input').val(), $('.task-input').val());
  var cardArray = retrieveLocalStorage();
  cardArray.push(newCard)
  addCards(newCard);
  setLocalStorage(cardArray);
  clearInputs();
};

function clearInputs() {
  $('.title-input').val('');
  $('.task-input').val('');
  $('.title-input').focus();
};
