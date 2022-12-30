// 使用嚴僅模式
"use strict";

// 基礎變數
const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
// movies 容器
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
//抓取電影清單節點
const dataPanel = document.querySelector('#data-panel')
//搜尋欄
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


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
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
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


function removeFromFavorite(id){
  //條件:如果不是movies變數 或是 movies變數長度不為零就回傳
  if (!movies || !movies.length) return 
  //宣告movie變數，找到movies變數中的資料符合
  const movieIndex = movies.findIndex( movie => movie.id === id)
  if(movieIndex === -1) return
  //使用splice移除指定id
  movies.splice(movieIndex,1)
  //設定將資料轉成json字串，放進local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  //重新渲染
  renderMovieList(movies)
}



//設立點擊監聽器
dataPanel.addEventListener('click', function onPanelClicked(event){
  //條件一：目標符合.btn-show-movie
  if (event.target.matches('.btn-show-movie')){
    //顯示電影資訊
    showMovieModal(Number(event.target.dataset.id))
    //條件二：目標符合.btn-remove-favorite
  } else if (event.target.matches('.btn-remove-favorite')){
    //移除電影
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

//渲染
renderMovieList(movies)








