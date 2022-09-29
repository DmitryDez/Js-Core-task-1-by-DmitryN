let autocompleteBox = document.querySelector('.search-autocomplete');
let searchFormInput = document.querySelector('.search-form-input');
let resultBox       = document.querySelector('.result');

let gitHubURL = 'https://api.github.com/search/repositories?q=';

searchInputHandler  = debounce(searchInputHandler, 500);
searchFormInput.addEventListener('input', searchInputHandler);

function searchInputHandler(event){
  clearResultField();

  if( (event.data !== null) || (event.inputType === 'insertFromPaste') || (event.inputType ==='deleteContentBackward' && searchFormInput.value !== '') ){

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
  addClickedItem(event.target);

  clearResultField();
  searchFormInput.value = '';
}

function addResultString(data){
  autocompleteBox.append(makeResultString(data));
}

function closeBtnHandler(event){
  let ourDivParent = event.target.closest('.result-message');
  ourDivParent.remove();
}

function makeResultString(data){
  let div = document.createElement('div');
  div.className = 'fast-result';
  div.innerHTML = data.name;

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
  let divParent = document.createElement('div');
  divParent.className = 'result-message';

  let divChild1 = document.createElement('div');
  divChild1.className = 'result-message-text';

  divChild1.innerHTML = `
  <table class="table-1">
    <tbody>
      <tr>
        <td>Name: </td>
        <td>${item.dataset.fullName} </td>
      </tr>
      <tr>
        <td>Owner: </td>
        <td>${item.dataset.owner} </td>
      </tr>
      <tr>
        <td>Stars:</td>
        <td>${item.dataset.starsCount} </td>
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

async function getInfo(queryText){
  let response = await fetch(gitHubURL + queryText);

  if(!response.ok){
    console.log('we got a problem');
    return 0;
  }

  let {items: arrOfResult} = await response.json();

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
