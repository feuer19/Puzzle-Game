//변수

const container = document.querySelector(".image-container");
const startButton = document.querySelector(".Start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");

const tileCount = 16;

let tiles = [];
const dragged = {
  el: "",
  class: "",
  index: "",
};
let isplaying = false;
let timeInterval = "";
let time = 0;

//function
// drag 상태 확인
function checkStatus() {
  const currentList = [...container.children];
  const unMatchedList = currentList.filter((child, index) => {
    return Number(child.getAttribute("data-index")) !== index;
  });
  if (unMatchedList.length === 0) {
    gameText.style.display = "block";
    isplaying = false;
    clearInterval(timeInterval);
  }
}

//초기 화면 렌더링
function render() {
  isplaying = false;
  container.innerHTML = "";
  tiles = createImageTiles();
  tiles.forEach((tile) => container.appendChild(tile));
}

//게임 세팅
function setGame() {
  isplaying = true;
  time = 0;
  container.innerHTML = "";
  gameText.style.display = "none";

  clearInterval(timeInterval);

  timeInterval = setInterval(() => {
    playTime.innerText = time;
    time++;
  }, 1000);

  tiles = createImageTiles();
  tiles.forEach((tile) => container.appendChild(tile));
  setTimeout(() => {
    container.innerHTML = "";
    startButton.innerText = "Re-Start The Game";
    shuffle(tiles).forEach((tile) => container.appendChild(tile));
  }, 2000);
}

// 이미지 타일
function createImageTiles() {
  const tempArray = [];
  Array(tileCount)
    .fill()
    .forEach((_, i) => {
      const li = document.createElement("li");
      li.setAttribute("data-index", i);
      li.setAttribute("draggable", "true");
      li.classList.add(`list${i}`);
      container.appendChild(li);
      tempArray.push(li);
    });
  return tempArray;
}

// 이미지 셔플
function shuffle(array) {
  let index = array.length - 1;
  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    index--;
  }
  return array;
}

// drag 이벤트
container.addEventListener("dragstart", (e) => {
  if (!isplaying) return;
  const obj = e.target;
  dragged.el = obj;
  dragged.class = obj.className;
  dragged.index = [...obj.parentNode.children].indexOf(obj);
  console.log(e);
});
container.addEventListener("dragover", (e) => {
  e.preventDefault();
});
container.addEventListener("drop", (e) => {
  if (!isplaying) return;
  const obj = e.target;
  if (obj.className !== dragged.class) {
    let originPlace;
    let isLast = false;
    if (dragged.el.nextSibling) {
      originPlace = dragged.el.nextSibling;
      //dragged.el.nextSibling : 현재 드롭한 el에 다음 el
    } else {
      originPlace = dragged.el.previousSibling;
      // dragged.el.previousSibling : 현재 드롭한 el에 그전 el
      isLast = true;
      // 마지막 el은 nextnextSibling 없으므로(null)  isLast값을 true 변경처리 해야한다.
    }

    const droppedIndex = [...obj.parentNode.children].indexOf(obj);

    dragged.index > droppedIndex
      ? obj.before(dragged.el)
      : obj.after(dragged.el);
    //obj.before(dragged.el);  :  obj(e.taget)를 dragged.el 뒤에 넣음
    //obj.after(dragged.el);   :   obj(e.taget)를 dragged.el 앞에에 넣음
    isLast ? originPlace.after(obj) : originPlace.before(obj);
    //originPlace.before(dragged.el); : dragged.el.previousSibling(현재 드롭한 el에 다음 el)를 dragged.el 뒤에 넣음
    //originPlace.after(dragged.el);  : dragged.el.nextSibling(현재 드롭한 el에 그전 el )를          dragged.el 앞에에 넣음
  }
  checkStatus();
});

startButton.addEventListener("click", () => {
  setGame();
});

render();
