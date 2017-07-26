
function fireCards(title, task) {
  var newCard = new CardElements(title, task);
  var cardArray = retrieveLocalStorage();
  cardArray.push(newCard);
  setLocalStorage(cardArray);
  addCards(newCard);
  clearInputs();
};

function loadTestData() {
  fireCards('accumsan cursus justo', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis sapien ac sem laoreet suscipit ac a ligula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.');
  fireCards('blandit varius erat tempus', 'Praesent auctor fringilla tincidunt. Duis pharetra auctor tortor vitae posuere. Phasellus vestibulum ante leo, blandit varius erat tempus ac.');
  fireCards('ras accumsan ut est', 'Mauris ac fringilla dui. Donec blandit id sem vitae ornare. Cras accumsan ut est interdum posuere. Maecenas venenatis risus sed quam facilisis rhoncus.');
  fireCards('Donec quam felis','dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.')
  fireCards('Curabitur nisi.','Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus', 1)
  fireCards('Donec sodales.','Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus.')
}

function clearTestData() {
  localStorage.clear();
  console.log(localStorage);
}
