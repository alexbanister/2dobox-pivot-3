$(document).ready(displayAllCards);
$('.title-input, .body-input').keyup(disableSaveButton);
$('.idea-card-parent').on('click', '#delete', deleteCard);
$('.save-btn').on('click', saveNewCard);
$('.search-input').on('keyup', searchCards);
$('.idea-card-parent').on('keydown', 'h2', updateCardInfo);
$('.idea-card-parent').on('keydown', '.body-text', updateCardInfo);

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
$('.idea-card-parent').on('click', '#upvote', changeQuality);

function changeQuality(e) {
  e.preventDefault();
  var cardId = parseInt($(e.target).closest('.idea-card')[0].id);
  var index = getIndex(cardId);
  var cardArray = retrieveLocalStorage();
  cardArray[index].quality++;
  setLocalStorage(cardArray);
  displayQuality(cardId, index);
}

function displayQuality(id, index) {
  var cardArray = retrieveLocalStorage();
  var quality = cardArray[index].quality;
  var status = ["swill", "plausible", "genius"];
  $('.'+id).text(status[quality])
}

$('.idea-card-parent').on('click', '#downvote', function(event) {
  event.preventDefault();
  var cardId = parseInt($(this).closest('.idea-card')[0].id);
  var status = ["swill", "plausible", "genius"];
  cardArray.forEach(function(card) {
      if (card.id === cardId) {
      card.quality--;
      console.log('status', status[card.quality]);
      $('.new-quality').text(status[card.quality])
    }
    storeCards();
    });
});

// ORIGINAL UPVOTE AND DOWNVOTE BUTTONS
// $('.idea-card-parent').on('click', '#upvote', function(event) {
//   event.preventDefault();
//   var cardId = $(this).closest('.idea-card')[0].id
//   cardArray.forEach(function(card) {
//     if (card.id == cardId) {
//       if (card.quality === "swill") {
//         card.quality = "plausible";
//         $('.' + cardId).text('plausible')
//       } else if (card.quality === "plausible") {
//         card.quality = "genius"
//         $('.' + cardId).text('genius')
//       } else {
//         card.quality = "genius"
//         $('.' + cardId).text('genius')
//       }
//     }
//     storeCards();
//   })
// });

// $('.idea-card-parent').on('click', '#downvote', function (event){
//   event.preventDefault();
//   var cardId = $(this).closest('.idea-card')[0].id
//   cardArray.forEach(function (card) {
//   if (card.id == cardId) {
//     if (card.quality === 'genius') {
//         card.quality = 'plausible';
//         $('.' + cardId).text('plausible')
//       } else if (card.quality === 'plausible') {
//         card.quality = 'swill'
//         $('.' + cardId).text('swill')
//       }else{
//         card.quality = 'swill'
//         $('.' + cardId).text('swill')
//       }
//   }
//   storeCards();
// })
// });

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
};

function fireCards() {
  var newCard = new CardElements($('.title-input').val(), $('.body-input').val());
  var cardArray = retrieveLocalStorage();
  cardArray.push(newCard)
  addCards(newCard);
  setLocalStorage(cardArray);
  clearInputs();
};

function clearInputs() {
  $('.title-input').val('');
  $('.body-input').val('');
  $('title-input').focus();
};
