// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$.extend($.ui.autocomplete.prototype.options, {
	open: function(event, ui) {
		$(this).autocomplete("widget").css({
            "width": ($(this).width() + "px")
        });
    }
});
$( document ).ready(function() {
  var question = document.getElementById("pr2__question")
  var answer = document.getElementById("pr2__answer")
  var submit = document.getElementById("pr2__submit")
  var table = document.getElementById("table")
  var country_capital_pairs = pairs
  var radios = [document.getElementById("all"), document.getElementById("corOnly"), document.getElementById("incOnly")];
  var buttons = [];
  var all = [];
  var numOfCorr = 0;
  function Entry(country, capital, inp, isCorrect){
    this.country = country;
    this.capital = capital;
    this.isCorrect = isCorrect;
    this.inp = inp;
  }
  answer.focus()
  var k = 2
  function random(min, max){
    var num = min + Math.floor(Math.random() * (max - min + 1));
    return num;
  }
  
  question.innerHTML = country_capital_pairs[random(0, country_capital_pairs.length)].country
  function noEntryAdd(){
    var row = table.insertRow(3)
    var c = row.insertCell(0)
    c.colSpan = 3;
    c.innerHTML = "No entry to show";
    c.setAttribute('style', 'text-align: center;');
    k++;
  }
  noEntryAdd();
  submit.onclick = function(){
    if (all.length == 0 && radios[0].checked){
      table.deleteRow(3)
      k--;
    }
    if (numOfCorr == 0 && radios[1].checked){
      table.deleteRow(3)
      k--;
    }
    if (all.length - numOfCorr == 0 && radios[2].checked){
      table.deleteRow(3)
      k--;
    }

    var corAns;
    for (var i = 0; i < country_capital_pairs.length; i++){
      if (country_capital_pairs[i].country == question.innerHTML){
        corAns = country_capital_pairs[i].capital
        break
      }
    }
    if (corAns.toLowerCase() == answer.value.toLowerCase()){
      numOfCorr++;
      all.push(new Entry(question.innerHTML, corAns, answer.value, true));
      if (radios[2].checked){
        radios[0].checked = true;
        core(radios[0]);
      }
      else insertCor(question.innerHTML, corAns);
    } 
    else{
      all.push(new Entry(question.innerHTML, corAns, answer.value, false));
      if (radios[1].checked){
        radios[0].checked = true;
        core(radios[0]);
      }else insertinCor(question.innerHTML, corAns, answer.value);
    }
    var ctry = country_capital_pairs[random(0, country_capital_pairs.length - 1)].country
    question.innerHTML = ctry
    answer.value = ""
    answer.focus() 
  }
  
  let flag = false;
  $('#pr2__answer').autocomplete({
    minLength: 2,
    source: function (request, response) {
      response($.map(country_capital_pairs, function (value, key) {
        var name = value.capital.toLowerCase();
				
				if (name.includes(request.term.toLowerCase())) {				
					return {
						label: value.capital,
						value: value.capital
					}
				} else {
					return null;
				}
       }));
    },
    select: function (event, ui){
      $('#pr2__answer').val(ui.item.label);
      flag = true;
      submit.click();
      return false;
    }
  });
  for (var i = 0; i < radios.length; i++){
    radios[i].onchange = function() {
      core(this);
    }

  }

  
  function deleteEntry(btn){
    var pos = Number.parseInt(btn.id);
    console.log("position: " + pos);
    console.log("length: " + all.length)
    table.deleteRow(3 + pos);
    var realPos = 0;
    var sofar = pos;
    if (radios[0].checked){
      realPos = pos;
      if (all[realPos].isCorrect) numOfCorr--;
    }
    else if (radios[1].checked){
      for (var j = 0; j < all.length; j++){
        if (all[j].isCorrect){
          sofar--;
        }if (sofar < 0){
          realPos = j;
          break;
        }
      }
      numOfCorr--; 
    }else{
      for (var j = 0; j < all.length; j++){
        if (!all[j].isCorrect){
          sofar--;
        }if (sofar < 0){
          realPos = j;
          break;
        }
      }
    }
    k--;
    if (k == 2){
      noEntryAdd();
    }
    for (var i = pos; i < buttons.length - 1; i++){
      buttons[i] = buttons[i + 1]
      buttons[i].id = i
    }buttons.pop();
    for (var i = realPos; i < all.length - 1; i++){
      all[i] = all[i + 1]
    }all.pop();
  }
  function core(x){
    while (k != 2){
      table.deleteRow(k);
      k = k - 1;
    }
    buttons = []
    if (x.id == "all"){
      if (all.length == 0){
        noEntryAdd()
      }
      for (var j = 0; j < all.length; j++){
        if (all[j].isCorrect){
          insertCor(all[j].country, all[j].capital);
        }else{
          insertinCor(all[j].country, all[j].capital, all[j].inp);
        }
      }
    }else if (x.id == "corOnly"){
      if (numOfCorr == 0){
        noEntryAdd();
      }
      for (var j = 0; j < all.length; j++){
        if (all[j].isCorrect){
          insertCor(all[j].country, all[j].capital);
        }
      }
    }else{
      if (all.length - numOfCorr == 0){
        noEntryAdd();
      }
      for (var j = 0; j < all.length; j++){
        if (!all[j].isCorrect){
          insertinCor(all[j].country, all[j].capital, all[j].inp);
        }
      }
    }
  }
  function insertCor(country, capital) {
    k++;
    var row = table.insertRow(k)
    row.className = "correct";
    row.insertCell(0).innerHTML = country;
    row.insertCell(1).innerHTML = capital;
    var c = row.insertCell(2);
    c.innerHTML = '<i class="fa fa-check"></i>';
    var btn = document.createElement("BUTTON");
    btn.innerText = "Delete";
    btn.id = k - 3;
    buttons.push(btn);
    btn.onclick = function() {
      console.log(btn.id);
      deleteEntry(this);
    }
    c.appendChild(btn);

  }
  function insertinCor(country, capital, inp){
    k++;
    var row = table.insertRow(k)
    row.className = "incorrect"
    row.insertCell(0).innerHTML = country;
    var incCell = row.insertCell(1);
    incCell.innerHTML = inp;
    incCell.id = "incCity";
    var btn = document.createElement("BUTTON");
    btn.innerText = "Delete";
    btn.id = k - 3
    buttons.push(btn);
    btn.onclick = function() {
      console.log(btn.id)
      deleteEntry(this);
    }
    var c = row.insertCell(2);
    c.innerHTML = capital;
    c.appendChild(btn);
  }
  answer.addEventListener("keydown", function(event) {
    if (event.keyCode === 13 && !flag){
      submit.click()
      $('#pr2__answer').autocomplete("close");
    }flag = false;
  })

});
