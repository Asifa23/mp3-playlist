var listItems = [],
	detailItems = [],
  playlist = [
    {"time":"323","title":"Sandalee - GV Prakash", "img":"media/Sandalee.jpg", "src":"media/Sandalee.mp3"},
    {"time":"309","title":"Lolita - Harris Jayraj","img":"media/Lolita.jpg","src":"media/Lolita.mp3"},
    {"time":"359","title":"Munbe Vaa - AR Rahman","img":"media/Munbe Vaa.jpg","src":"media/Munbe Vaa.mp3"},
    {"time":"251","title":"Ennadi Maayavi - Santhosh N","img":"media/Ennadi Maayavi.jpg","src":"media/Ennadi Maayavi.mp3"},
    {"time":"319","title":"Iragai Poley","img":"media/Iragai Poley.jpg","src":"media/Iragai Poley.mp3"}
  ];

playlist.forEach(function(el, i) {
	let [artist, title] = el.title.split('-');
	let top = (66*(i+1)) + (i*22); 
	let z = i+1;

	let itemList = `<div class="list-item" data-index="${i}">
        <div class="thumb">
        	<img src="${el.img}" alt="song_title" style="top: ${top}px">
        </div>
        <div class="title">
          <span>${title}</span>
          <small>${artist}</small>
        </div>
        <div class="length"><small>${formatTime(el.time) || "0:00"}</small></div>
      </div>`;

    let itemDetail = `<div class="slide">
      <div class="thumb">
        <div style="background-image:url(${el.img})"></div>
        <div style="background-image:url(${el.img})"></div>
      </div>
      <div class="title">
        <i class="zmdi zmdi-minus-circle-outline"></i>
        <h3><span>${title}</span><small>${artist}</small></h3>
        <i class="zmdi zmdi-favorite-outline"></i>
      </div>
    </div>`;

    listItems.push(itemList);
    detailItems.push(itemDetail);
});

document.querySelector('.list section').innerHTML = listItems.join('');
document.querySelector('.detail .slider').innerHTML = detailItems.join('');

let positionElement = document.querySelector('.wrapper'),
	sliderElement = document.querySelector('.slider');

let $listItemImg = $('.list-item img'),
	$detail = $('.detail');


var _player = new Player('.player', {tracks: playlist});
_player.$container.addEventListener('playerStateChanged', function(evt) {
  //console.log('player changed to ' + evt.detail);
  let $wrapper = $('.wrapper');

  if(evt.detail == 'play')
    $wrapper.removeClass('paused').addClass('playing');
  else if(evt.detail == 'pause')
    $wrapper.removeClass('playing').addClass('paused');
  else
    $wrapper.removeClass('paused').removeClass('playing');

}, false);

$('.player-indicator .playb').on('click', function(evt) {
  _player.play();
});


$('.list-item').on('click', function(evt) {
	// select the current detail item
	let $this = $(this),
		index = this.getAttribute('data-index');
	
	positionElement.setAttribute('data-pos', index);
	currentSlide = parseInt(index); 
	
	$this.find('img').addClass('open');
	$detail.addClass('open');
	setTimeout(() => { 
		$detail.addClass('ready');
		
		if(_player.currentTrack != currentSlide)
			_player.changeTrack(currentSlide, true);
	}, 300);
});


$('.detail .close').on('click', function(evt) {
	$listItemImg.removeClass('open');
	$detail.addClass('lock');
	
	setTimeout(() => {
		$detail.removeClass('ready lock open');
	}, 250);
});

$('.controls .zmdi-fast-rewind').on('click', prev);
$('.controls .zmdi-fast-forward').on('click', next);

let slideCount = 6,
	step = 5,
  maxSpan = 100,
  currentSpan = 0,
  currentSlide = 0;

let hammertime = new Hammer(sliderElement);
hammertime.on("panleft panright panstart panend", function(evt) {
  
  if(evt.type == 'panleft') {
    currentSpan += step;
    
    if(currentSpan > maxSpan)
      next();    
  } 
  
  if (evt.type == 'panright') {
    currentSpan -= step;

    if(currentSpan < - (maxSpan+20))
      prev();
  }

  // pull the borders
  if (evt.type == 'panstart' && evt.additionalEvent == 'panleft') {
    let s = currentSlide + 1;
    $('.slide:nth-child('+s+') .thumb').addClass('skewLeft');
  }

  if (evt.type == 'panstart' && evt.additionalEvent == 'panright') {
    let s = currentSlide + 1;
    $('.slide:nth-child('+s+') .thumb').addClass('skewRight');
  }

  if (evt.type == 'panend') {
    $('.thumb').removeClass('skewLeft skewRight');
    currentSpan = 0;
  }

});


function next() {
  let slide = parseInt(positionElement.getAttribute('data-pos'))
      newSlide = (slide + 1 > (slideCount - 1))? slide : slide + 1;
  positionElement.setAttribute('data-pos', newSlide);
  currentSlide = newSlide;
  currentSpan = 0;
  _player.changeTrack(currentSlide, true);

  // sync the selected list item with the current detail item
  $listItemImg
    .removeClass('open')
    .eq(currentSlide)
    .addClass('open');
}

function prev() {
  let slide = parseInt(positionElement.getAttribute('data-pos'))
      newSlide = (slide - 1 < 0)? slide : slide - 1;
  positionElement.setAttribute('data-pos', newSlide);
  currentSlide = newSlide;
  currentSpan = 0;
  _player.changeTrack(currentSlide, true);

  // sync the selected list item with the current detail item
  $listItemImg
    .removeClass('open')
    .eq(currentSlide)
    .addClass('open');
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}