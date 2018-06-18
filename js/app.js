const numberOfAi = 100;
const priceForAttack = 250;
const priceForDefence = 500;
const priceForSpy = 1000;
const attackAmount = 100;
const defenceAmount = 100;
const defeatAttackDecrease = 25;
const victoryDefenceIncrease = 25;
const spyAmount = 50;
const defencePercentage = 0.25;
const xpForAttack = 10;
const moneyBound = 1000;
const attackBound = 1000;
const defenceBound = 1000;
const spyBound = 1000;
const aiTurnBound = numberOfAi / 10;
const economyMultiplier = 5;

var allPlayers = [];
var rankedPlayers = [];

function Player() {
  this.money = Math.floor(Math.random() * moneyBound);
  this.attack = Math.floor(Math.random() * attackBound);
  this.defence = Math.floor(Math.random() * defenceBound);
  this.name = generateName();
  this.id = Math.random().toString(36).slice(2);
  this.xp = 0;
  this.rank = undefined;
  this.spy = Math.floor(Math.random() * spyBound);
  this.ai = undefined;
  this.economy = 0;

  this.buyAttack = function() {
    if (this.money > priceForAttack) {
      this.attack += attackAmount;
      this.money -= priceForAttack;
    } else {
      if (!this.ai) alert("Not enough money");
    }
    user.updateProfile();
  };

  this.buyDefence = function() {
    if (this.money > priceForDefence) {
      this.defence += defenceAmount;
      this.money -= priceForDefence;
    } else {
      if (!this.ai) alert("Not enough money");
    }
    user.updateProfile();
  };

  this.buySpy = function() {
    if (this.money > priceForSpy) {
      this.spy += spyAmount;
      this.money -= priceForSpy;
    } else {
      if (!this.ai) alert("Not enough money");
    }
    user.updateProfile();
  };

  this.attackPlayer = function(opponent) {
    if (this.attack > opponent.defence) {
      var winPercentage = 1 - opponent.defence / this.attack;
      var winnings = Math.floor(opponent.money * winPercentage);
      //Successful attack
      if (!this.ai) alert("Attack success: " + winnings);
      this.money += winnings;
      opponent.money -= winnings;
      opponent.attack -= defeatAttackDecrease;
      console.log(this.name, " has defeated ", opponent.name);
    } else {
      //Unsuccessful attack
      if (!this.ai) alert("Attack failed");
      var winPercentage = 1 - this.attack / opponent.defence;
      var winnings = Math.floor(
        opponent.money * winPercentage * defencePercentage
      );
      opponent.money += winnings;
      this.money -= winnings;
      opponent.defence += victoryDefenceIncrease;
      console.log(opponent.name, " has defended against ", this.name);
    }
    this.xp += xpForAttack;
  };

  this.updateProfile = function() {
    var userName = document.getElementById("user-name");
    var userXp = document.getElementById("user-xp");
    var userRank = document.getElementById("user-rank");
    var userMoney = document.getElementById("user-money");
    var userAttack = document.getElementById("user-attack");
    var userDefence = document.getElementById("user-defence");
    var userSpy = document.getElementById("user-spy");
    userName.innerHTML = this.name;
    userXp.innerHTML = this.xp;
    userRank.innerHTML = this.rank;
    userMoney.innerHTML = this.money;
    userAttack.innerHTML = this.attack;
    userDefence.innerHTML = this.defence;
    userSpy.innerHTML = this.spy;
  };
}

var user = new Player();
initialiseGame();

function initialiseGame() {
  var attackButton = document.getElementById("attack-btn");
  var attackPurchaseBtn = document.getElementById("attack-purchase-btn");
  var defencePurchaseBtn = document.getElementById("defence-purchase-btn");
  var spyPurchaseBtn = document.getElementById("spy-purchase-btn");
  attackPurchaseBtn.addEventListener("click", function() {
    user.buyAttack();
  });
  defencePurchaseBtn.addEventListener("click", function() {
    user.buyDefence();
  });
  spyPurchaseBtn.addEventListener("click", function() {
    user.buySpy();
  });

  user.name = localStorage.name || prompt("Enter your name");
  localStorage.name = user.name;

  initialiseAi();
  gameTurn();
  window.setInterval(function() {
    aiTakeTurn();
    gameTurn();
  }, 5000);
}

function gameTurn() {
  console.log("TURN");
  user.updateProfile();
  var tableBody = document.getElementById("ai");
  allPlayers.map(function(player) {
    player.money += player.xp * economyMultiplier;
  });
  console.log("Adding multiplier: ", user.xp * economyMultiplier);
  user.money += user.xp * economyMultiplier;
  tableBody.innerHTML = "";
  rankPlayers();
  user.updateProfile();
  displayAllPlayers();
}

function initialiseAi() {
  for (var i = 0; i < numberOfAi; i += 1) {
    var ai = new Player();
    ai.ai = true;
    allPlayers.push(ai);
  }
}

function displayAllPlayers() {
  var aiList = document.getElementById("ai");
  rankedPlayers.map(function(player, index) {
    var tableRow = document.createElement("tr");
    var tableRank = document.createElement("td");
    var tableName = document.createElement("td");
    var tableMoney = document.createElement("td");
    var tableAttack = document.createElement("td");
    var tableDefence = document.createElement("td");
    var tableSpy = document.createElement("td");
    tableName.setAttribute("id", player.id);
    tableName.classList.add("cursor");
    tableRank.innerHTML = "#" + player.rank;
    if (!player.ai) {
      tableName.innerHTML = player.name + " (Player)";
      tableName.classList.add("green");
      tableAttack.classList.add("orange");
      tableRow.style.backgroundColor = "#1b1b1b";
    } else {
      tableName.innerHTML = player.name + " (AI)";
    }

    if (player.spy >= user.spy && player.id != user.id) {
      tableMoney.innerHTML = "?";
      tableAttack.innerHTML = "?";
      tableDefence.innerHTML = "?";
      tableSpy.innerHTML = "?";
    } else {
      if (player.defence < user.attack) {
        tableDefence.classList.add("green");
      } else {
        tableDefence.classList.add("red");
      }
      tableMoney.innerHTML = "&pound;" + player.money;
      tableAttack.innerHTML = player.attack;
      tableDefence.innerHTML = player.defence;
      tableSpy.innerHTML = player.spy;
    }
    tableRow.appendChild(tableRank);
    tableRow.appendChild(tableName);
    tableRow.appendChild(tableMoney);
    tableRow.appendChild(tableAttack);
    tableRow.appendChild(tableDefence);
    tableRow.appendChild(tableSpy);
    aiList.appendChild(tableRow);
    tableName.addEventListener("click", function() {
      console.log(player.name);
      if (
        window.confirm("Do you wish to attack " + player.name + "?") == true
      ) {
        var opponent = allPlayers.find(function(player) {
          return player.id == tableName.id;
        });
        user.attackPlayer(opponent);
        gameTurn();
      }
    });
  });
}

function rankPlayers() {
  rankedPlayers = bubbleSort(allPlayers.concat([user]));
  rankedPlayers.map(function(player, rank) {
    player.rank = rank + 1;
  });
}

function bubbleSort(list) {
  var tmp;
  list.sort(function(a, b) {
    return (
      (b.attack + b.defence + b.spy) / 3 - (a.attack + a.defence + b.spy) / 3
    );
  });

  return list;
}

function makeAiChoice(ai) {
  var choice = Math.floor(Math.random() * 3);
  if (choice == 0) {
    var playerToAttackId =
      allPlayers[Math.floor(Math.random() * allPlayers.length)].id;
    var playerToAttack = allPlayers.find(function(player) {
      return player.id == playerToAttackId;
    });
    ai.attackPlayer(playerToAttack);
  } else if (choice == 1) {
    ai.buyAttack();
  } else {
    ai.buyDefence();
  }
}

function aiTakeTurn() {
  var aiTakingTurns = getRandomAi();
  aiTakingTurns.forEach(function(ai) {
    makeAiChoice(ai);
  });
}

function getRandomAi() {
  var selectedAi = [];
  for (var i = 0; i <= aiTurnBound; i++) {
    var ai = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    if (ai.ai) {
      selectedAi.push(ai);
    }
  }

  return selectedAi;
}

function generateName() {
  var firstnames = [
    "Zendar",
    "Arthur",
    "Bracker",
    "Charlie",
    "Daniel",
    "Edward",
    "Frederick",
    "Gwainth",
    "Harley",
    "Isaac",
    "Junal",
    "Klep",
    "Levros",
    "Menthi",
    "Nustra",
    "Opaat",
    "Peta",
    "Quentin",
    "Riky",
    "Steve",
    "Thenkor",
    "Uvva",
    "Varmos",
    "Xendon",
    "Yil",
    "Zacharius"
  ];
  var joiners = ["", "the"];
  var lastnames = [
    "Greenwhale",
    "Bluehand",
    "Xenon",
    "Riley",
    "Stevenson",
    "Pratt",
    "Lawrence"
  ];
  var adjectives = [
    "Kind",
    "Terrible",
    "Defiler",
    "Malevolent",
    "Mysterious",
    "Merciful",
    "Destroyer",
    "Cunning",
    "Quick",
    "Stubborn",
    "Ill-advised",
    "Bountiful",
    "Shadow"
  ];
  var firstname = firstnames[Math.floor(Math.random() * firstnames.length)];
  var joiner = joiners[Math.floor(Math.random() * joiners.length)];
  var lastname = lastnames[Math.floor(Math.random() * lastnames.length)];
  var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  if (joiner == "the") {
    lastname = adjective;
  }
  return firstname + " " + joiner + " " + lastname;
}
