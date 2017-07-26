$(document).ready(displayAllCards);
$('.title-input, .task-input').keyup(disableSaveButton);
$('.card-parent').on('click', '#delete', deleteCard);
$('.save-btn').on('click', saveNewCard);
$('.filter-input').on('keyup', filterCards);
$('.card-parent').on('keydown', 'h2', updateCardInfo);
$('.card-parent').on('keydown', '.task-text', updateCardInfo);
$('.card-parent').on('click', '.ratings', changeImportance);
$('.card-parent').on('click', '.complete-btn', taskComplete)
$('.card-parent').on('click', '.filter-complete-btn', filterCompleteCards)


function taskComplete() {
  var selectedCardId = parseInt($(this).closest('.card')[0].id);
  console.log('this: ', $('#' + selectedCardId).find('.card, h2, .task-text'));
  $('#' + selectedCardId).find('.card, h2, .task-text').toggleClass('complete-task')
}

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
};

function CardElements(title, task) {
  this.title = title;
  this.task = task;
  this.id = Date.now();
  this.importance = 2;
};

function disableSaveButton() {
  if (($('.title-input').val()) && ($('.task-input').val())) {
    $('.save-btn').attr('disabled', false);
  } else {
    $('.save-btn').attr('disabled', true);
  }
}

function deleteCard() {
  var currentCardId = parseInt($(this).closest('.card')[0].id);
  var index = getIndex(currentCardId);
  var cardArray = retrieveLocalStorage();
  if (index >= 0) {
    cardArray.splice(index, 1);
  }
  setLocalStorage(cardArray);
  $(this).parents('.card').remove();
}

function getIndex(id) {
  var allCards = retrieveLocalStorage();
  var index = allCards.findIndex(function(card) {
    return card.id === id;
  })
  return index;
}

function changeImportance(e) {
  var cardId = parseInt($(e.target).closest('.card')[0].id);
  var index = getIndex(cardId);
  var cardArray = retrieveLocalStorage();
  cardArray[index].importance += validateChange(e, cardArray[index].importance);
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
  var importance = cardArray[index].importance;
  var importanceText = getImportanceLevels();
  $('#'+id).find('.new-importance').text(importanceText[importance]);
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
  var id = parseInt($(e.target).closest('.card')[0].id);
  var index = getIndex(id);
  var cardArray = retrieveLocalStorage();
  cardArray[index].title = $('#'+id).find('h2').text();
  cardArray[index].task = $('#'+id).find('.task-text').text();
  setLocalStorage(cardArray);
}

function filterCards() {
  var cardArray = retrieveLocalStorage();
  console.log(cardArray);
  var results = cardArray.filter(function(elementCard) {
    return elementCard.title.toUpperCase().includes($('.filter-input').val().toUpperCase()) ||
           elementCard.task.toUpperCase().includes($('.filter-input').val().toUpperCase());
  });
  $('.card-parent').empty();
  for (var i = 0; i < results.length; i++) {
    addCards(results[i]);
  }
};

// function filterCompleteCards() {
//   var cardArray = retrieveLocalStorage();
//   var completed = cardArray.filter(function(cardsMarkedComplete) {
//       return cardsMarkedComplete.
//   });
// };

function addCards(buildCard) {
  var template = $('#card-template').clone();
  template.attr('id', buildCard.id);
  template.find('h2').text(buildCard.title);
  template.find('.task-text').text(buildCard.task);
  console.log(template);
  $('.card-parent').prepend(template);
  displayImportance(buildCard.id, getIndex(buildCard.id));
};

function fireCards() {
  var newCard = new CardElements($('.title-input').val(), $('.task-input').val());
  var cardArray = retrieveLocalStorage();
  cardArray.push(newCard);
  setLocalStorage(cardArray);
  addCards(newCard);
  clearInputs();
};

function clearInputs() {
  $('.title-input').val('');
  $('.task-input').val('');
  $('.title-input').focus();
};
