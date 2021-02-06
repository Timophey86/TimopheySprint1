"use strict";

function init() {
  renderBooks();
  doTrans();
}

function renderBooks() {
  var books = getBooks();
  var strHtml = `<table><tr><th data-trans="id">Id</th><th data-trans="title">Title</th><th data-trans="author-name">Author</th><th data-trans="price">Price</th><th data-trans="action">Action</th></tr>`;
  books.forEach(function (book) {
    strHtml += `<tr><td>${book.id}</td><td>${book.title}</td><td>${book.author}</td><td>${book.price}$</td><td class="action"><button data-trans="update" class="update" onclick="onUpdateBook(${book.id})">Update</button><button data-trans="delete" class="delete" onclick="onRemoveBook(${book.id})">Delete</button><button data-trans="read" class="raed" onclick="onRead(${book.id});toggleElmentsDisplay()">Read</button></td></tr>`;
  });
  strHtml += `</table>`;
  var elTableContainer = document.querySelector(".table-container");
  elTableContainer.innerHTML = strHtml;
}

function renderDetailsPage() {
  var selectedFromGbooks = gBooks.find(function (b) {
    return gBookDetails.id === b.id;
  });
  console.log(selectedFromGbooks)
  var strHtml = `<h2 class="book-title">${gBookDetails.title}</h2>
    <h3 class="book-author">By: ${gBookDetails.author}</h3>
    <img src="img/${gBookDetails.photo}" alt="" />
    <div class="book-rating">Book is rated:<span class="current-rating"> ${selectedFromGbooks.rating}/10</span> by ${selectedFromGbooks.amountOfRatings} users</div>
    <div class="rate-book">
    <i class="fas fa-plus-square fa-2x" onclick="increaseRate()"></i></i><input type="text" value="0" class="rate"><i class="fas fa-minus-square fa-2x" onclick="decreaseRate()"></i>
<button class="submit" onclick="onSubmitRating(${gBookDetails.rate})">Submit Rating</button></div>
    <div class="description">
    ${gBookDetails.description}
    </div><div class="go-back" onclick="init();toggleElmentsDisplay()">Back</div>`;
  var elDetailsContainer = document.querySelector(".table-container");
  elDetailsContainer.innerHTML = strHtml;
}

function onAddBook() {
  addBook();
  renderBooks();
  doTrans();
}

function onRemoveBook(bookId) {
  removeBookById(bookId);
  renderBooks();
  doTrans();
}

function onUpdateBook(bookId) {
  var newPrice = +prompt("Enter the new price");
  updateBook(bookId, newPrice);
  renderBooks();
  doTrans();
}

function onRead(bookId) {
  gBookDetails = getBookDetails(bookId);
  renderDetailsPage();
}

function onSubmitRating() {
  addRating(gBookDetails);
  renderDetailsPage();
}

function onSortTable(event) {
  //Before using dataSet trans to determine the sort by value
  // var elSortBy = document.querySelector(`select[name=sortBy]`);
  // var sortBy = elSortBy.value;

  //Get options from Dataset of value
  var selectedOptionsValue =
    event.target.options[event.target.selectedIndex].dataset.trans;
  setSortBy(selectedOptionsValue);
  getSortedBooks();
  renderBooks();
  doTrans();
}

function onNextPage() {
  nextPage();
  renderBooks();
  doTrans();
}

function onPreviousPage() {
  previousPage();
  renderBooks();
  doTrans();
}

function onSetLang(lang) {
  console.log(lang);
  setLang(lang);
  // TODO: if lang is hebrew add RTL class to document.body
  if (lang === "he") {
    document.body.classList.add("rtl");
  } else {
    document.body.classList.remove("rtl");
  }
  doTrans();
  // renderBooks()
}

function onAddManually() {
  addBookManually();
  renderBooks()
}
