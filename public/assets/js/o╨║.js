!function (d, id, did, st, title, description, image) {
  var js = d.createElement("script");
  js.src = "https://connect.ok.ru/connect.js";
  js.onload = js.onreadystatechange = function () {
    if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
      if (!this.executed) {
        this.executed = true;
        setTimeout(function () {
          OK.CONNECT.insertShareWidget(id,did,st, title, description, image);
        }, 0);
      }
    }};
  d.documentElement.appendChild(js);
}(document,"ok_shareWidget","https://todayme.ru",'{"sz":30,"st":"oval","ck":1}',"sdfsdfsdf","Так, так… Ты, значит, приводишь себя в форму под руководством тренеров #ЯСЕГОДНЯ уже целую неделю, а твои друзья так ничего про это и не знают?! Не надо так! Пожалей товарищей!:bow:  У нас есть крутейшие лайфхаки, как качать булки, хоть сидя в пробке. Расскажи про них друзьям, а мы увеличим время приема твоего экзамена. Можешь присылать нам Видео до конца воскресенья! Как тебе идейка?:wink:  :zap:    Начинать заниматься спортом можно буквально не вставая с кровати! Как ты обычно это делаешь? Встаешь с помощью легкого отталкивания от матраца? 🤸:skin-tone-2:‍  ","");
