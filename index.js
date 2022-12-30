// 使用嚴僅模式
"use strict";

// 基礎變數
const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
// movies 容器
const movies = [];
let filteredMovies = [] 
//抓取電影清單節點
const dataPanel = document.querySelector('#data-panel')
//搜尋欄
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
//分頁資料範圍
const MOVIES_PER_PAGE = 12
const paginator = document.querySelector('#paginator')


//設立搜尋監聽器
searchForm.addEventListener('input', function onSearchFormSubmitted(event){
  event.preventDefault() //停止事件的默認動作,如 a、button可能會跳出頁面
  //toLowerCase()，字串轉小寫
  //trim()，把字串頭尾空格去掉
  const keyword = searchInput.value.trim().toLowerCase()
  
  // if(!keyword.length){
  //   return alert('請輸入有效字串')
  // }

  //條件篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0){
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  //重新輸出至畫面
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))

})

//製作電影小卡
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${
          POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

//分頁製作
function renderPaginator(amount){
  const numberOfPage = Math.ceil( amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}



//該頁的資料內容
function getMoviesByPage(page){

  const data = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page -1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

//顯示當前電影資訊(用電影id抓資料)
function showMovieModal (id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response)=>{
    const data = response.data.results
    modalTitle.innerText = data.title 
    modalDate.innerText = ' Release data: ' +data.release_data
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`
  })

}

//將電影加入喜好
function addTOFavorite(id){
  //宣告list變數，將local storage 的資料或是[]放進收藏，並轉換成json資料
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  //宣告movie變數，找到movies變數中的資料符合
  const movie = movies.find( movie => movie.id === id)
  //條件:list中有資料符合id
  if (list.some(movie => movie.id === id)){
    return alert('此電影已經在收藏清單中')
  }
  //將movie變數放進list變數中
  list.push(movie)
  //設定將資料轉成json字串，放進local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}



//設立點擊監聽器
dataPanel.addEventListener('click', function onPanelClicked(event){
  //條件一：目標符合.btn-show-movie
  if (event.target.matches('.btn-show-movie')){
    //顯示電影資訊
    showMovieModal(Number(event.target.dataset.id))
    //條件二：目標符合.btn-add-favorite
  } else if (event.target.matches('.btn-add-favorite')){
    //加入喜好
    addTOFavorite(Number(event.target.dataset.id))
  }
})

//新增 Pagination 標籤的事件監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderMovieList(getMoviesByPage(page))
})

//電影渲染
function renderMovies(){
  axios
    .get(INDEX_URL)
    .then((response) => {
      movies.push(...response.data.results);
      //插入函數
      renderPaginator(movies.length)
      renderMovieList(getMoviesByPage(1))
    })
    .catch((err) => console.log(err));
}


renderMovies()








