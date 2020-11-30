var overlay;
var time=60;
var s;
var audio;
audio = new Audio();
audio.src = 'music/game.mp3';
var audioTimer;
var audioScore;
button.onclick = function start(){
  overlay = document.querySelector('.overlay');
  button.style.display='none';
  overlay.style.display='none';
  s=0;
  audio.play();
  audio.volume = 0.3;
  audio.loop = true;
  startGame();
};

function startGame(){
  var game,excel,main,score,deadline,flagEnd=true,boomInterval;
  var level=[];
  var blockSize=50;
  var arr=[];
  var firstClick = false;
  var blockT=["excel0","excel1","excel2","excel3","excel4","excel5","excel6"];
  var blockRows = 10;
  var blockCols = 10;
  s=0;

//  ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ УРОВНЯ(ИЗНАЧАЛЬНО НЕ МОЖЕТ БЫТЬ 3 ИЛИ БОЛЬШЕ БЛОКОВ ИДУЩИХ ПОДРЯД)

    function generateGame(){
      var blockType, flag, flag1, flag2;
      for(var i=0;i<blockRows;i++){
        level[i]=[];
        for(var g=0;g<blockCols;g++){
          flag=true;
             while(flag){
               blockType = Math.floor(blockT.length * Math.random());
               // ПРОВЕРКА В СТРОКЕ
               if(g >= 2){
                 flag1 = (blockType === level[i][g - 1]) && (blockType === level[i][g - 2]);
               }
               else {
                 flag1 = false;
               }
               // ПРОВЕРКА В СТОЛБЦЕ
               if(i >= 2){
                 flag2 = (blockType === level[i - 1][g]) && (blockType === level[i - 2][g]);
               }
               else {
                 flag2 = false;
               }
               // ПОКА FLAG-TRUE, ГЕНЕРИРУЕМ БЛОК ДРУГОГО ЦВЕТА
               flag = flag1 || flag2;
             }
             level[i].push(blockType);
        }
      }
      return level;
    };

    // ФУНКЦИЯ ПРОРИСОВКИ УРОВНЯ

    function drawGame() {
      var blockType,k=0;
      for(var i=0;i<blockRows;i++) {
        for (var g=0;g<blockCols;g++) {
          // СОЗДАЕМ НОВЫЙ ЭЛЕМЕНТ DIV
          excel = document.createElement('div');
          // ДОБАВЛЯЕМ КЛАСС EXCEL
          excel.classList.add('excel');
          // ИЗВЛЕКАЕМ ЦВЕТ ДЛЯ БЛОКА
          blockType = level[i][g];
          // ДОБАВЛЯЕМ КЛАСС, КОТОРЫЙ ОКРАШИВАЕТ БЛОК
          excel.classList.add('excel'+blockType);
          // ВСТАВЛЯЕМ В game
          game.appendChild(excel);
        }
      }
      return;
    };

    // ФУНКЦИЯ ЗАДАНИЯ КООРДИНАТ КАЖДОМУ БЛОКУ

    function coordinates(){
      // ПОИСК excel В ДОКУМЕНТЕ
      excel = document.getElementsByClassName('excel');
      var k=0;
      // ДОБАВЛЯЕМ АТТРИБУТЫ ДЛЯ КАЖДОГО БЛОКА
      for(var y=0;y<blockRows;y++){
        for(var x=0;x<blockCols;x++){
          excel[k].setAttribute('posX',x);
          excel[k].setAttribute('posY',y);
          k++;
        }
      }
    };

    // ФУНКЦИЯ ДЛЯ ПРОВЕРКИ ИДУШИХ ПОДРЯД 3 И БОЛЕЕ БЛОКОВ

    function checkGame(){
      var block,block2,x,y,t1,t2;
      for(var y=0;y<blockRows;y++) {
        for (var x=0;x<blockCols;x++) {
          // ПРОВЕРКА ПО СТРОКЕ
          if (x <= blockCols-3) {
            count = 1;
            arr = [[x, y]];
            // ПОИСК БЛОКА ПО АТТРИБУТАМ
            block = document.querySelector(`[posX="${x}"][posY="${y}"]`);
            block2 = document.querySelector(`[posX="${x-(-count)}"][posY="${y}"]`);
            // ОПРЕДЕЛЕНИЕ ЦВЕТА
            t1 = block.classList[1];
            t2 = block2.classList[1];
            // ПОКА НЕ ДОШЛИ ДО КОНЦА СТРОКИ И ЦВЕТА СОСЕДНИХ БЛОКОВ ОДИНАКОВЫЕ
            while ((x + count < blockCols) && (t1 === t2)) {
              arr.push([x + count, y]);
              count++;
              block2 = document.querySelector(`[posX="${x-(-count)}"][posY="${y}"]`);
              if((x+count)!=blockCols){
                t2 = block2.classList[1];
              }
            }
            // ВОЗВРАЩАЕМ МАССИВ ПОДРЯД ИДУЩИХ БЛОКОВ, ЕСЛИ ИХ БОЛЬШЕ ТРЕХ
            if (count >= 3) {
              x+=count-3;
              return arr;
            }
          }
          // ПРОВЕРКА ПО СТОЛБЦУ
          if (y <= blockRows-3) {
            count = 1;
            arr = [[x, y]];
            // ПОИСК БЛОКА ПО АТТРИБУТАМ
            block = document.querySelector(`[posX="${x}"][posY="${y}"]`);
            block2 = document.querySelector(`[posX="${x}"][posY="${y-(-count)}"]`);
            t1 = block.classList[1];
            t2 = block2.classList[1];
            // ПОКА НЕ ДОШЛИ ДО КОНЦА СТОЛБЦА И ЦВЕТА СОСЕДНИХ БЛОКОВ ОДИНАКОВЫЕ
            while ((y + count < blockRows) && (t1 === t2)) {
              arr.push([x, y + count]);
              count++;
              block2 = document.querySelector(`[posX="${x}"][posY="${y-(-count)}"]`);
              if((y+count)!=blockRows){
                t2 = block2.classList[1];
              }
            }
            // ВОЗВРАЩАЕМ МАССИВ ПОДРЯД ИДУЩИХ БЛОКОВ, ЕСЛИ ИХ БОЛЬШЕ ТРЕХ
            if (count >= 3) {
              y+=count-3;
              return arr;
            }
        }
      }
    }
    return false;
  };

  // ФУНКЦИЯ ДЛЯ УДАЛЕНИЕ ПОДРЯД ИДУЩИХ БЛОКОВ

    function boom() {
      var arr, size,block,t1, k=5;
      // ОТКЛЮЧАЕМ ОБРАБОТКУ СОБЫТИЯ ПО КЛИКУ МЫШИ
      document.removeEventListener("click", onClick);
      // ПОУЛЧАЕМ МАССИВ ПОДРЯД ИДУЩИХ БЛОКОВ
      arr = checkGame();
      // ЕСЛИ МАССИВ ПУСТ, ТО ПРОДОЛЖАЕМ ИГРУ
      if (!arr) {
        document.addEventListener("click", onClick);
        return;
      }
	  audioScore = new Audio();
	  audioScore.src = 'music/score.mp3';
	  audioScore.play();
    audioScore.volume = 1;
      // ДОБАВЛЯЕМ ОЧКИ
      s += arr.length;
      document.getElementsByClassName("score")[0].innerHTML = "Score:   " + s;
      // УБИРАЕМ ЦВЕТ КАЖДОМУ ЭЛЕМЕНТУ ИЗ МАССИВА
      boomInterval = setInterval(function() {
          if(k==5){
            document.removeEventListener("click", onClick);
            k--;
            arr.forEach(function(b) {
              block = document.querySelector(`[posX="${b[0]}"][posY="${b[1]}"]`);
              t1 = block.classList[1];
              block.classList.remove(t1);
              block.classList.add("excelBoom");
              return;
            });
          }
          else if(k>0){
            k--;
          }
          else {
            document.addEventListener("click", onClick);
            clearInterval(boomInterval);
            return GameDown();
          }
      }, 70);
      return;
    };

    // ФУНКЦИЯ, КОТОРАЯ ОПУСКАЕТ БЛОКИ ВНИЗ

    function GameDown() {
      var flag, blockType, blockType2,block,block2,t2;
      flag = true;
      while (flag) {
        flag = false;
        for(var y=0;y<blockRows;y++) {
          for (var x=0;x<blockCols;x++) {
            block = document.querySelector(`[posX="${x}"][posY="${y}"]`);
            // ЕСЛИ НАХОДИМ УДАЛЕННЫЙ БЛОК
            if (block.classList.contains("excelBoom")) {
              flag = true;
              // ЕСЛИ НЕ САМЫЙ ВЕРХНИЙ БЛОК, ТО СДВИГАЕМ ВНИЗ
              if (y > 0) {
                block2 = document.querySelector(`[posX="${x}"][posY="${y-1}"]`);
                t2 = block2.classList[1];
                block.classList.remove("excelBoom");
                block.classList.add(t2);
                block2.classList.remove(t2);
                block2.classList.add("excelBoom");
              }
              // СОЗДАЕМ НОВЫЙ СЛУЧАЙНЫЙ БЛОК
              else {
                blockType= Math.floor(blockT.length * Math.random());
                block.classList.remove("excelBoom");
                block.classList.add("excel"+blockType);
              }
            }
          }
        }
      }
      // ПРОВЕРЯЕМ, ЕСТЬ ЛИ ПОСЛЕ СОЗДАНИЯ НОВЫХ БЛОКОВ, НОВЫЕ ПОДРЯД ИДУЩИЕ БЛОКИ
      return boom();
    };

    // ФУНКЦИЯ ДЛЯ ОБРАБОТКИ ДЕЙТСВИЙ ИГРОКА ВО ВРЕМЯ ИГРЫ

    function onClick(e){
      var cx, cy, block,block2,block3,count,t1,t2;
      var flag, flag1, flag2, check,cellElement,tar;
      // cellElement-блок, на который кликнул игрок
      cellElement=e.target;
      // ИСКЛЮЧАЕМ ОБРАБОТКУ ЭЛЕМЕНТА, ЕСЛИ ИГРОК НЕ КЛИКНУЛ НА БЛОК
      if(cellElement.classList[0]=="excel"){
        cx = cellElement.getAttribute('posX');
        cy = cellElement.getAttribute('posY');
        block = document.querySelector(`[posX="${cx}"][posY="${cy}"]`);
        if (cx < 0 || cx > blockCols || cy < 0 || cy > blockRows) {
            return;
        }
        // ВЫДЕЛЯЕМ БЛОК, ЕСЛИ ЭТО ПЕРВЫЙ КЛИК
        if(!firstClick){
          block.classList.add('active');
          firstClick = [cx, cy];
        }
        else{
            flag1 = firstClick[0] === cx && Math.abs(firstClick[1] - cy) === 1;
            flag2 = firstClick[1] === cy && Math.abs(firstClick[0] - cx) === 1;
            flag = flag1 || flag2;
            block2 = document.querySelector(`[posX="${firstClick[0]}"][posY="${firstClick[1]}"]`);
            // ЕСЛИ НЕ СОСЕДНИЕ БЛОКИ
            if (!flag) {
              block2.classList.remove('active');
              firstClick = false;
            }
            else {
              // МЕНЯЕМ МЕСТАМИ БЛОКИ
              block2.classList.remove('active');
              t1=block.classList[1];
              t2 = block2.classList[1];
              block.classList.remove(t1);
              block.classList.add(t2);
              block2.classList.remove(t2);
              block2.classList.add(t1);
              check = checkGame();
              // ЕСЛИ НАШЛОСЬ ТРИ ИЛИ БОЛЕЕ ПОДРЯД ИДУЩИХ БЛОКОВ
              if (check) {
                firstClick = false;
                boom();
                return;
              }
              // ОБРАТНО МЕНЯЕМ БЛОКИ МЕСТАМИ
              else {
                block.classList.remove(t2);
                block.classList.add(t1);
                block2.classList.remove(t1);
                block2.classList.add(t2);
                firstClick = false;
              }
          }
        }
      }
    };

    // ФУНКЦИЯ ДЛЯ ОТСЛЕЖИВАНИЯ ОСТАВШЕГОСЯ ВРЕМЕНИ

    function getTimeRemaining(endtime) {
      var t = Date.parse(endtime) - Date.parse(new Date());
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor(t / 1000 / 60);
	  if(seconds==10){
		  audio.volume = 0.2;
		  audioTimer = new Audio();
		  audioTimer.src = 'music/timer.mp3';
		  audioTimer.play();
		  audioTimer.loop = true;
      audioTimer.volume = 0.7;
	  }
      return {
        total: t,
        minutes: minutes,
        seconds: seconds
      };
    };

    // ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ТАЙМЕРА

    function initializeClock(id, endtime) {
    var mas=[];
    var clock = document.getElementById(id);
    var minutesSpan = clock.querySelector(".minutes");
    var secondsSpan = clock.querySelector(".seconds");
    // ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ТАЙМЕРА
      function updateClock() {
        var t = getTimeRemaining(endtime);
        if (t.total < 0) {
			    audioTimer.pause();
          clearInterval(timeinterval);
          clearInterval(boomInterval);
          printRecords(records(true));
          document.removeEventListener("click", onClick);
          overlay.style.display='block';
          button.style.display='block';
          document.getElementsByClassName('game')[0].remove();
		      audio.pause();
          return true;
        }
        minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
        secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
      }
    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
  };

  // ФУНКЦИЯ ДЛЯ СОЗДАНИЯ ТАБЛИЦЫ РЕКОРДОВ

  function records(flag){
    var player,a,k=0,info,b,b1,ind,f,flag2=true,index,nick;
    var arr2=[];
    var arrScore = [];
      // ФУНКЦИЯ ДЛЯ СОРТИРОВКИ МАССИВА ПО УБЫВАНИЮ ОЧКОВ
      function sortArr(){
        var fl;
        for(var j=0;j<localStorage.length;j++){
          fl=true;
          for(var i=0;i<localStorage.length-1;i++){
            if(arr2[i].score<arr2[i+1].score){
              fl=false;
              [arr2[i],arr2[i+1]]=[arr2[i+1],arr2[i]];
            }
          }
          if(fl){
            return;
          }
        }
      };
      // ФУНКЦИЯ ВВОДА ИМЕНИ ИГРОКА
      function inputNamePlayer(){
        player = prompt("Поздравляем, ваш результат попал в таблицу рекордов! Как вас зовут?");
        if(player!=null){
          nick = player.split(" ");
        }
        else {
          return;
        }
        if(nick.length>1){
          while(nick.length>1){
            player = prompt("Необходимо ввести только ваше имя! Например \"Илья\" ");
            if(player!=null){
              nick = player.split(" ");
            }
            else {
              break;
            }
          }
        }
      };
      // ФУНКЦИЯ ДЛЯ ЗАПОЛНЕНИЯ МАССИВА ИГРОКОВ ИЗ LOCAL STORAGE
      function arrPlayers(){
        for(var i=0;i<localStorage.length;i++){
          index=localStorage.key(i);
          a=localStorage.getItem(index);
          info = a.split(" ");
          arr2.push({name:info[0],score:parseInt(info[1])});
        }
      };
      // ЗАПОЛНЯЕМ МАССИВ ЭЛЕМЕНТАМИ ИЗ LOCAL STORAGE
      arrPlayers();
      // СОРТИРУЕМ МАССИВ ПО УБЫВАНИЮ ОЧКОВ
      sortArr();
      // (FALSE-ПРИ ЗАПУСКЕ ИГРЕ ДЛЯ ОТОБРАЖЕНИЯ ТАБЛИЦЫ РЕКОРДОВ; TRUE-ДЛЯ ПРОВЕРКИ ПОПАЛ ЛИ РЕЗУЛЬТАТ В ТАБЛИЦУ ИЛИ ДЛЯ ВНЕСЕНИЯ ИЗМЕНЕНИЙ В ТАБЛИЦУ РЕКОРДОВ )
      if(flag){
        // МАКСИМАЛЬНОЕ ЧИСЛО РЕКОРДСМЕНОВ - 5
        if(localStorage.length<5){
          arr2=[];
          inputNamePlayer();
          if(player!=null){
            localStorage.setItem(player,player+" "+s);
          }
          arrPlayers();
          sortArr();
        }
        // ВНОСИМ ИЗМЕНЕНИЯ В  ТАБЛИЦУ, ЕСЛИ РЕЗУЛЬТАТ ИГРОКА ОКАЗАЛСЯ БОЛЬШЕ, ЧЕМ У КОГО-ТО ИЗ ТАБЛИЦЫ РЕКОРДОВ
        else if(s>arr2[localStorage.length-1].score){
          arr2=[];
          arrPlayers();
          sortArr();
          inputNamePlayer();
          if(player!=null){
            // МОЖЕТ БЫТЬ ТАК, ЧТО ИГРОК, НАПРИМЕР, СО ВТОРОЙ ПОПЫТКИ УЛУЧШИЛ СВОЙ РЕЗУЛЬТАТ, ТО ИДЕТ ПЕРЕЗАПИСЬ ЕГО РЕЗУЛЬТАТА
            for(var i=0;i<arr2.length;i++){
              if(player==arr2[i].name){
                if(s>arr2[i].score){
                  arr2[i].score=s;
                  localStorage.setItem(player, player+" "+s);
                  flag2 = false;
                }
                flag2 = false;
              }
            }
            if(flag2){
              ind = arr2[localStorage.length-1].name;
              delete localStorage[ind];
              localStorage.setItem(player, player+" "+s);
              arr2=[];
              arrPlayers();
            }
            sortArr();
          }
        }
        // ЕСЛИ ВСЕ МЕСТА В ТАБЛИЦЕ ЗАНЯТЫ И РЕЗУЛЬТАТ МЕНЬШЕ, ЧЕМ У ДРУГИХ ИГРОКОВ
        else {
          alert("Ваш результат не попал в таблицу рекордов");
        }
      }
      return arr2;
    };

    // ВЫВОД ТАБЛИЦЫ РЕКОРДОВ

    function printRecords(ar){
      for(var i=0;i<ar.length;i++){
          document.getElementById('a'+ (i +1)).innerHTML = ar[i].name +" "+ar[i].score;
      }
      return;
    };
    // Создание нового элемента
    game = document.createElement('div');
    // Добавление класса
    game.classList.add('game');
    // Генерация уровня
    generateGame();
    // Прорисовка
    drawGame();
    // Поиск main в документе
    main = document.getElementsByClassName('main')[0];
    // Вставка в main
    main.appendChild(game);
    // Задаем координаты блокам
    coordinates();
    // Вывод таблицы рекордов
    printRecords(records(false));
    // Вывод очков
    document.getElementsByClassName('score')[0].innerHTML ="Score:   " +  s;
    // Задаем время на таймере
    deadline = new Date(Date.parse(new Date()) + time * 1000);
    // Таймер
    initializeClock("countdown", deadline);
    // При клике вызываем функцию, которая обрабатывает действие игрока
    document.addEventListener("click", onClick);
};
