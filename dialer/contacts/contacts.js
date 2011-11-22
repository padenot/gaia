
var Contacts = {
  init: function contactsInit() {
    // Could be much easier to have am argument named 'parameters' pass as
    // a second argument that I can omit
    this.find(['id', 'displayName'], this.show.bind(this));
  },
  find: function contactsFind(fields, callback) {
    // Ideally I would like to choose the ordering
    // It also misses simple constaints like the one you can pass to the webSMS API
    window.navigator.mozContacts.find(fields, function findCallback(contacts) {
      contacts.sort(function contactsSort(a, b) {
        return a.name.familyName[0] > b.name.familyName[0];
      });
      callback(contacts);
    });
  },
  show: function contactsShow(contacts) {
    var content = '';
    var currentLetter = '';

    var count = contacts.length;
    for (var i = 0; i < count; i++) {
      var contact = contacts[i];
      var displayName = contact.displayName;
      var phoneNumber = contact.phones[0];

      var name = contact.name.familyName[0]; 
      if (currentLetter != name[0]) {
        currentLetter = name[0].toUpperCase();

        content += '<div id="' + currentLetter + '" class="contact-header">' +
                      currentLetter +
                   '</div>';
      }

      content += '<div class="contact" id="' + contact.id + '">' +
                 '  <span class="displayName">' + displayName + '</span>' +
                 '  <span class="phoneNumber">' + phoneNumber + '</span>' +
                 '</div>';
    }
    var contactsContainer = document.getElementById('contacts');
    contactsContainer.innerHTML = content;
    this.filter();

    // Hide the search field by default
    setTimeout(function () {
      var searchContainer = document.getElementById('search-container');
      searchContainer.hidden = false;

      var mainContainer = document.getElementById('main-container');
      mainContainer.scrollTop = searchContainer.getBoundingClientRect().height;
    }, 400);
  },
  filter: function contactsFilter(value) {
    var contacts = document.getElementById('contacts').children;

    var count = contacts.length;
    for (var i = 0; i < count; i++) {
      var contact = contacts[i];
      if (contact.className == 'contact-header')
        continue;

      var name = contact.firstElementChild.textContent;
      var rule = new RegExp(value, 'gi');
      contact.hidden = (name.search(rule) == -1);
    }

    // If there is 0 childs for a particular letter, hide it.
    var enabledLetters = [];
    for (var i = 0; i < count; i++) {
      var contactHeader = contacts[i];
      if (contactHeader.className != 'contact-header')
        continue;

      var nextSibling = contactHeader.nextSibling;
      while (nextSibling && nextSibling.className == 'contact') {
        if (!nextSibling.hidden) {
          enabledLetters.push(contactHeader.id);
          break;
        }
        nextSibling = nextSibling.nextSibling;
      }
    }

    // Reflect the change in the shortcut letter
    var shortcuts = document.getElementById('shortcuts').children;
    for (var j = 1; j < shortcuts.length; j++) {
      var shortcut = shortcuts[j];
      var targetId = shortcut.name;
      var header = document.getElementById(targetId);

      var disabled =  (enabledLetters.indexOf(targetId) == -1);
      if (header && disabled) {
        shortcut.setAttribute('data-disabled', 'true');
        header.hidden = true;
      } else if (disabled) {
        shortcut.setAttribute('data-disabled', 'true');
      } else {
        shortcut.removeAttribute('data-disabled');
        header.hidden = false;
      }
    }
  },
  anchor: function contactsAnchor(evt) {
    var target = evt.target;
    var targetId = evt.target.name;
    var target = document.getElementById(targetId);
    if (!target)
      return;

    var top = target.getBoundingClientRect().top;
    var scrollable = document.getElementById('main-container');
    scrollable.scrollTop = top + scrollable.scrollTop;
  },
  showDetails: function contactsShowDetails(evt) {
    var target = evt.target;
    // TODO Create a view for details here
  }
};

