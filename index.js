let searchBox       = document.querySelector('.search');
let autocompleteBox = document.querySelector('.search-autocomplete');
let searchFormInput = document.querySelector('.search-form-input');
let resultBox       = document.querySelector('.result');

searchInputHandler  = debounce(searchInputHandler, 500);
searchFormInput.addEventListener('input', searchInputHandler);

function searchInputHandler(event){
  clearResultField();
  
  if(event.data !== null || event.inputType === 'insertFromPaste' || event.inputType ==='deleteContentBackward' && searchFormInput.value !== '' ){

    let arrOfResult = getInfo(searchFormInput.value);

    arrOfResult.then(resultArr => {
        if(resultArr === 0){
          console.log('repositories not found');
          return 0;
        }
        for(let item of resultArr){
          addResultString(item);
        }
      }
    );
  }
}

function pickResultHandler(event){
  let selectedItem = event.target;
  addClickedItem(selectedItem);

  clearResultField();
  searchFormInput.value = '';
}

function addResultString(data){
  let resultString = makeResultString(data);
  autocompleteBox.append(resultString);
}

function closeBtnHandler(event){
  let ourBtn = event.target;
  let ourDivParent = ourBtn.closest('.result-message');

  ourDivParent.remove();
}

function makeResultString(data){
  let text = data.name;

  let div = document.createElement('div');
  div.className = 'fast-result';
  div.innerHTML = text;

  div.dataset.fullName = data.full_name;
  div.dataset.owner = data.owner.login;
  div.dataset.starsCount = data.stargazers_count;

  div.addEventListener('click', pickResultHandler);

  return div;
}

function clearResultField(){
  let arrOfResultStrings = document.querySelectorAll('.fast-result');

  for(let string of arrOfResultStrings){
    string.remove();
  }
}

function addClickedItem(item){
  let name = item.dataset.fullName;
  let owner = item.dataset.owner
  let starsCount = item.dataset.starsCount;

  let divParent = document.createElement('div');
  divParent.className = 'result-message';

  let divChild1 = document.createElement('div');
  divChild1.className = 'result-message-text';

  divChild1.innerHTML = `
  <table class="table-1">
    <tbody>
      <tr>
        <td>Name: </td>
        <td>${name} </td>
      </tr>
      <tr>
        <td>Owner: </td>
        <td>${owner} </td>
      </tr>
      <tr>
        <td>Stars:</td>
        <td>${starsCount} </td>
      </tr>
    </tbody>
  </table>
`;

  let divChild2 = document.createElement('div');
  divChild2.className = 'result-message-options';

  let btnClose = document.createElement('button');

  btnClose.className = 'result-message-options-btn btn';
  btnClose.type = 'button';
  btnClose.name = 'close-btn';

  btnClose.innerHTML = `
    <img src="icons/close-icon-1.svg">
  `;

  btnClose.addEventListener('click', closeBtnHandler);

  divChild2.append(btnClose);

  divParent.append(divChild1, divChild2);
  resultBox.append(divParent);
}

async function getInfo(text){
  let url = `https://api.github.com/search/repositories?q=${text}`;
  let response = await fetch(url);

  if(!response.ok){
    console.log('we got a problem');
    return 0;
  }

  let data = await response.json();
  let arrOfResult = data.items;

  if(arrOfResult.length === 0){
    return 0;
  }

  if(arrOfResult.length > 5){
    arrOfResult.length = 5;
  }

  return arrOfResult;
}


function debounce(fn, debounceTime){
  let timeOut;
  return function(){
    const someFn = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeOut);
    timeOut = setTimeout(someFn, debounceTime);
  };
}
