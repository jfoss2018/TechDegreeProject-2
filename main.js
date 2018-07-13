// This creates the searchbox dynamically.
const $newDiv = $('<div class="student-search"></div>');
const $newInput = $('<input placeholder="Search for students...">');
const $newButton = $('<button>Search</button>');
$('.page-header').append($newDiv);
$('.student-search').append($newInput);
$('.student-search').append($newButton);

// This collects all student list objects initially and creates an array.
const list = document.querySelectorAll('.student-list li');
let dynamicList = [];

// This selects both the input box and the search button, and adds the event
// listeners which both call the same function.
const inputField = document.querySelector('.student-search input');
const searchButton = document.querySelector('.student-search button');
inputField.addEventListener('keyup', () => {
  searchFunct();
});
searchButton.addEventListener('click', () => {
  searchFunct();
});

// This function hides all students and then displays only the Students
// who are associated with the page number passed as an argument.
function showPage(pageNumber, studentList) {
  $(list).hide();
  for (let i = 0; i < studentList.length; i += 1) {
    if (i < pageNumber*10 && i >= pageNumber*10-10) {
      studentList[i].style.display = 'block';
    }
  }
}

// This function determines how many pages should be created based on 10
// students per page given any number of list items. It then removes any added
// page links if they exist and then adds new page links based on the amount
// calculated above. If there are page links, it will then pass the page number
// and student list to the showPage function. After that, the click event will
// detect page links clicked on, and pass new arguments to the showPage function.
// I inserted two functions here for the adding and removing of the html elements
// because it was easier for me to keep the code legible.
function appendPageLinks(studentList) {
  let pages = Math.ceil((studentList.length)/10);
  let prevPages;
  removePagination(prevPages);
  prevPages = pages;
  addPagination(pages);
  if(document.querySelector('.active')) {
    let newNum = (parseInt(document.querySelector('.active').innerText));
    showPage(newNum,studentList);
    const divSelect = document.querySelector('.pagination');
    divSelect.addEventListener('click', (event) => {
      let pageNum;
      if (event.target.tagName === 'A') {
        pageNum = parseInt(event.target.textContent);
        document.querySelector('.active').classList.remove('active');
        event.target.classList.add('active');
      }
      showPage(pageNum, studentList);
    });
  } else {
    $(list).hide();
  }
}

// This function collects the string in the input box and compares it to all of
// the objects in list. It then adds all objects that contain the search criteria
// into the dynamicList array. This function also clears the "no search results"
// message if it is no longer valid and adds the statement if it is valid.
// Finally, it calls the appendPageLinks function.
function searchFunct() {
  let inputStr = document.querySelector('.student-search input').value;
  dynamicList = [];
  if (document.querySelector('.page .temp')) {
    const removeTempPage = document.querySelector('.page');
    const removeTempDiv = document.querySelector('.temp');
    const removeTempH2 = document.querySelector('.temp h2');
    removeTempDiv.removeChild(removeTempH2);
    removeTempPage.removeChild(removeTempDiv);
  }
  for (let i = 0; i < list.length; i += 1) {
    let studentName = list[i].querySelector('h3').innerHTML.toUpperCase();
    let studentEmail = list[i].querySelector('.email').innerHTML.toUpperCase();
    let testNum1 = studentName.indexOf(inputStr.toUpperCase());
    let testNum2 = studentEmail.indexOf(inputStr.toUpperCase());
    if (testNum1 > -1 || testNum2 > -1 ) {
      dynamicList.push(list[i]);
    }
  }
  if (dynamicList.length === 0) {
    const $ifEmpty = $('<div class="temp"><h2>Sorry, we couldn\'t find a match for your search criteria. Please try again.</h2></div>')
    $('.page').append($ifEmpty);
  }
  appendPageLinks(dynamicList);
}

// This function creates the html elements needed in order to add the page links.
// It also creates as many links as the calculated pages from the previous function
// via accepting the page count as an argument.
function addPagination(pageCount) {
  const $newDiv = $('<div class="pagination"></div>');
  const $newUl = $('<ul></ul>');
  $('.page').append($newDiv);
  $('.pagination').append($newUl);
  for (let i = 0; i < pageCount; i +=1) {
    let $newLi;
    if (i === 0) {
      $newLi = $(`<li><a href="#" class="active">${i+1}</a></li>`);
    } else {
      $newLi = $(`<li><a href="#">${i+1}</a></li>`);
    }
    $('.pagination ul').append($newLi);
  }
}

// This function removes the html elements that were created for the page links
// if they exist. It accepts one argument.
function removePagination(prevPageCount) {
  if (document.querySelector('.pagination')) {
    const selectLi = document.querySelectorAll('.pagination ul li');
    const selectUl = document.querySelector('.pagination ul');
    const selectDiv = document.querySelector('.pagination');
    const selectPage = document.querySelector('.page');
    for (let i = 0; i < prevPageCount; i += 1) {
      selectUl.removeChild(selectLi[i]);
    }
    selectDiv.removeChild(selectUl);
    selectPage.removeChild(selectDiv);
  }
}

// This calls the appendPageLinks function when the page loads. This will make
// the page show the first page with 10 students listed.
appendPageLinks(list);
