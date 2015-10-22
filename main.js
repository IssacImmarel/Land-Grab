var player, opponent;
var selectedSpace = "0";
var mapArray = [];
var map;

var haveAFarm = false;
var haveAMill = false;
var haveAQuarry = false;
var haveAMine = false;

var farmGoldCost = 0;
var farmLumberCost = 20;
var farmStoneCost = 15;
var LumberMillGoldCost = 0;
var LumberMillStoneCost = 25;
var LumberMillLumberCost = 25;
var QuarryGoldCost = 0;
var QuarryStoneCost = 25;
var QuarryLumberCost = 25;
var MineGoldCost = 10;
var MineLumberCost = 30;
var MineStoneCost = 15;

var farmGoldUpgrade = 0;
var farmLumberUpgrade = 0;
var farmStoneUpgrade = 0;
var LumberMillGoldUpgrade = 0;
var LumberMillStoneUpgrade = 0;
var LumberMillLumberUpgrade = 0;
var QuarryGoldUpgrade = 0;
var QuarryStoneUpgrade = 0;
var QuarryLumberUpgrade = 0;
var MineGoldUpgrade = 0;
var MineLumberUpgrade = 0;
var MineStoneUpgrade = 0;

var newSpace = 0;
var moving = false;
var battleTimeCount = 0;
var battling = false;
var playerFighter = {};
var enemyFighter = {};
var intervalDivisor = 1;
var intervalVariable = 0;
var difficultyMod = .8;
var selectedId;

var tutCont = true;


/** 
OBJECT PROTOTYPES
*/
function resources(lum, sto, gold, totFood, useFood, exp, knightExp, archerExp, mageExp)
{
	this.Lumber = lum;
	this.Stone = sto;
	this.Gold = gold;
	this.UsedFood = useFood;
	this.TotalFood = totFood;
	this.Exp = exp;
	this.KnightExp = knightExp;
	this.ArcherExp = archerExp;
	this.MageExp = mageExp;
	
	this.lumberIncrementer = 0;
	this.stoneIncrementer = 0;
	this.goldIncrementer = 0;
	
	this.lumberMax = 100;
	this.stoneMax = 100;
	this.goldMax = 60;
	
	this.lumberLevel = 0;
	this.stoneLevel = 0;
	this.goldLevel = 0;
}

function unit(owner, cell)
{
	this.isEnemy = owner;
	this.type = "recruit";
	this.name = "";
	
	this.defense = 20;
	this.health = 100;
	this.totalHealth = 100;
	this.attack = 40;
	this.speed = 5;
	this.nextAttack = 0;
	this.currentCell = cell;
	
	this.updateNumbers = function()
	    {
		    if(this.type == "recruit")
			{
				this.defense = 20;
	            this.health = 100;
	            this.totalHealth = 100;
	            this.attack = 40;
	            this.speed = 5;
			}
			if(this.type == "knight")
			{
				this.defense = 40;
	            this.health = 200;
				this.totalHealth = 200;
				this.attack = 60;
				this.speed = 5;
			}
			if(this.type == "archer")
			{
				this.defense = 30;
	            this.health = 150;
				this.totalHealth = 150;
				this.attack = 60;
				this.speed = 3;
			}
			if(this.type == "mage")
			{
				this.defense = 25;
	            this.health = 125;
				this.totalHealth = 125;
				this.attack = 60;
				this.speed = 4;
			}
	    }
	
	
	
	this.attacked = function(attacker)
	    {
		    this.health -= (attacker.attack - this.defense);
			console.log(attacker.attack, this.defense, (attacker.attack - this.defense));
	    }
	
	this.unitString = "";
	this.updateString = function() 
	    {
			var nameString = "<p>Name: " + this.name + "</p>";
		    var attackString = "<p>Attack: " + this.attack + "</p>";
			var defenseString = "<p>Defense: " + this.defense + "</p>";
			var health = "<p>Health: " + this.health + "/" + this.totalHealth + "</p>";
			this.unitString = nameString + health + attackString + defenseString;
	    }
		
	this.modify = function()
	    {
		    this.defense *= difficultyMod;
		    this.health *= difficultyMod;
		    this.totalHealth *= difficultyMod;
		    this.attack *= difficultyMod;
	    }
}

function mapCell(theCellId)
{
	this.type = "inactive";
	this.isMountain = false;
	this.isPlayers = false;
	this.isOpponents = false;
	
	this.unitGroup = [];
	
	this.level = 0;
	this.cellInformation = "";
	this.cellId = theCellId;
	
	this.isVisible = false;
	this.isSelected = false;
	this.styleString = "";
	this.cellString = "";
	
	this.updateStyleString = function ()
		{
			var colorString = "background-color: " + cellColor(this);
			if (this.unitGroup.length != 0 || this.unitGroup[0] != undefined) 
			{
				if(this.type != "inactive" || (this.type == "inactive" && this.isPlayers == true))
				{
					colorString += "; background-image: linear-gradient(to top right, deepskyblue, deepskyblue 25%, " + cellColor(this) + " 25%, " + cellColor(this) + " 75%, deepskyblue 75%, deepskyblue)";
					if (playerFighter.currentCell != undefined)
					{
						if(this.unitGroup[0].currentCell == playerFighter.currentCell)colorString += "; background-image: linear-gradient(to top right, white, white 25%, " + cellColor(this) + " 25%, " + cellColor(this) + " 75%, white 75%, white)";
					}
				}
				else
				{
					if (enemyFighter.currentCell != undefined && this.unitGroup[0].currentCell == enemyFighter.currentCell)
					colorString += "; background-image: linear-gradient(to top right, crimson, crimson 25%, " + cellColor(this) + " 25%, " + cellColor(this) + " 75%, crimson 75%, crimson)";
				}
				
			}
			var visibleString = "";
			if (this.isVisible == true || tutCont == true) visibleString = "; visibility: visible";
			var borderString = "";
			if (this.isSelected == true) borderString = "; border: 3px solid white; height: 47px";
			this.styleString = " style='" + colorString + visibleString + borderString + "'";
		}
	this.updateCellString = function()
	    {
		    this.updateStyleString();
			this.cellString = "";
			if (this.cellId[1] == 0) this.cellString += "<tr>";
			var clickString = "";
			if (this.isPlayers == true) clickString = "onclick='selectSpace(\"" + this.cellId + "\")' ";
			if (this.isOpponents == false && this.type == "inactive") clickString = "onclick='selectSpace(\"" + this.cellId + "\")' ";
			this.cellString += "<td id='" + this.cellId + "' " + clickString + this.styleString + ">" + this.cellInformation + "</td>";
			if (this.cellId[1] == 9) this.cellString += "</tr>";
	    }
		//onclick='selectSpace(" + this.cellId + ")' 
		
	this.start = function(type, ownership) {
		this.type = type;
		this.level = 1;
		this.isPlayers = ownership;
		if(this.isPlayers) this.isVisible = true;
		this.cellInformation = "LVL <span>" + this.level + "</span>";
		this.updateStyleString();
		this.updateCellString();
		if (type == "farm") haveAFarm = true;
		if (type == "mill") haveAMill = true;
		if (type == "quarry") haveAQuarry = true;
		if (type == "mine") haveAMine = true;
	}
		
}

/*********************
**********************
**********************
**********************/

/**
BUY AND UPGRADE FUNCTIONS
*/
function upgrade()
{
	if(mapArray[selectedSpace].type == "farm")
	{
	    var upgradeGoldCost = 10;
	    var upgradeStoneCost = 30;
	    var upgradeLumberCost = 30;
	}	
	if(mapArray[selectedSpace].type == "mine")
	{
	    var upgradeGoldCost = 10;
	    var upgradeStoneCost = 30;
	    var upgradeLumberCost = 30;
	}	
	if(mapArray[selectedSpace].type == "mill")
	{
	    var upgradeGoldCost = 10;
	    var upgradeStoneCost = 30;
	    var upgradeLumberCost = 30;
	}	
	if(mapArray[selectedSpace].type == "quarry")
	{
	    var upgradeGoldCost = 10;
	    var upgradeStoneCost = 30;
	    var upgradeLumberCost = 30;
	}	
	
	upgradeGoldCost = upgradeGoldCost * mapArray[selectedSpace].level;
	upgradeStoneCost = upgradeStoneCost * mapArray[selectedSpace].level;
	upgradeLumberCost = upgradeLumberCost * mapArray[selectedSpace].level;
		
		
		
 	if(player.Gold >= upgradeGoldCost && player.Lumber >= upgradeLumberCost && player.Stone >= upgradeStoneCost)
	{
		player.Gold -= upgradeGoldCost;
		player.Lumber -= upgradeLumberCost;
		player.Stone -= upgradeStoneCost;
		mapArray[selectedSpace].level++;
		if(mapArray[selectedSpace].type == "farm") player.TotalFood += Math.round(mapArray[selectedSpace].level * 3);
		if(mapArray[selectedSpace].type == "mill") player.lumberIncrementer += Math.round(mapArray[selectedSpace].level * .6);
		if(mapArray[selectedSpace].type == "mine") player.goldIncrementer += Math.round(mapArray[selectedSpace].level * .4);
		if(mapArray[selectedSpace].type == "quarry") player.stoneIncrementer += Math.round(mapArray[selectedSpace].level * .6);
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		
		if(mapArray[selectedSpace].type == "mill" && mapArray[selectedSpace].level > player.lumberLevel)
		{
            player.lumberLevel++;
			player.lumberMax = Math.floor(player.lumberMax + ((mapArray[selectedSpace].level / 4) * 100));
		}
		if(mapArray[selectedSpace].type == "mine" && mapArray[selectedSpace].level > player.goldLevel)
		{
			player.goldLevel++;
			player.goldMax = Math.floor(player.goldMax + ((mapArray[selectedSpace].level / 4) * 60));
		}
		if(mapArray[selectedSpace].type == "quarry" && mapArray[selectedSpace].level > player.stoneLevel)
		{
			player.stoneLevel++;
			player.stoneMax = Math.floor(player.stoneMax + ((mapArray[selectedSpace].level / 4) * 100));
		}
		
		updateMap();
		update();
	}
}

function buyFarm()
{
	if(mapArray[selectedSpace] == undefined) return alert('HEY, NO CELL SELECTED');
	
	if(mapArray[selectedSpace].type != "inactive") return alert("Can't buy a farm here");
		
 	if(player.Gold >= farmGoldCost && player.Lumber >= farmLumberCost && player.Stone >= farmStoneCost)
	{
		player.Gold -= farmGoldCost;
		player.Lumber -= farmLumberCost;
		player.Stone -= farmStoneCost;
		player.TotalFood += 3;
		mapArray[selectedSpace].type = "farm";
		mapArray[selectedSpace].level = 1;
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		haveAFarm = true;
		mapArray[selectedSpace].isPlayers = true;
		updateMap();
		update();
	}
}

function buyMill()
{
	if(mapArray[selectedSpace] == undefined) return alert('HEY, NO CELL SELECTED');
	
	if(mapArray[selectedSpace].type != "inactive") return alert("Can't buy a Lumber Mill here");
		
 	if(player.Gold >= LumberMillGoldCost && player.Lumber >= LumberMillLumberCost && player.Stone >= LumberMillStoneCost)
	{
		player.Gold -= LumberMillGoldCost;
		player.Lumber -= LumberMillLumberCost;
		player.Stone -= LumberMillStoneCost;
		player.lumberIncrementer += 1;
		mapArray[selectedSpace].type = "mill";
		mapArray[selectedSpace].level = 1;
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		haveAMill = true;
		if (haveAQuarry == true) 
		{
			document.getElementById("farm-button").style.visibility="visible";
			document.getElementById("mine-button").style.visibility="visible";
		}
		mapArray[selectedSpace].isPlayers = true;
		updateMap();
		update();
	}
}

function buyQuarry()
{
	if(mapArray[selectedSpace] == undefined) return alert('HEY, NO CELL SELECTED');
	
	if(mapArray[selectedSpace].type != "inactive") return alert("Can't buy a Quarry here");
		
 	if(player.Gold >= QuarryGoldCost && player.Lumber >= QuarryLumberCost && player.Stone >= QuarryStoneCost)
	{
		player.Gold -= QuarryGoldCost;
		player.Lumber -= QuarryLumberCost;
		player.Stone -= QuarryStoneCost;
		player.stoneIncrementer += 1;
		mapArray[selectedSpace].type = "quarry";
		mapArray[selectedSpace].level = 1;
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		haveAQuarry = true;
		if (haveAMill == true) 
		{
			document.getElementById("farm-button").style.visibility="visible";
			document.getElementById("mine-button").style.visibility="visible";
		}
		mapArray[selectedSpace].isPlayers = true;
		updateMap();
		update();
	}
}

function buyMine()
{
	if(mapArray[selectedSpace] == undefined) return alert('HEY, NO CELL SELECTED');
	
	if(mapArray[selectedSpace].type != "inactive") return alert("Can't buy a Mine here");
		
 	if(player.Gold >= MineGoldCost && player.Lumber >= MineLumberCost && player.Stone >= MineStoneCost)
	{
		player.Gold -= MineGoldCost;
		player.Lumber -= MineLumberCost;
		player.Stone -= MineStoneCost;
		player.goldIncrementer += .5;
		mapArray[selectedSpace].type = "mine";
		mapArray[selectedSpace].level = 1;
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		haveAMine = true;
		mapArray[selectedSpace].isPlayers = true;
		updateMap();
		update();
	}
}

function buyUnit()
{
	if (mapArray[selectedSpace].type == "inactive") return;
	if (player.UsedFood + 3 > player.TotalFood)
	{
	    alert("Not Enough Food To feed him!");
	    return;
	}
	if(mapArray[selectedSpace].unitGroup.length > 0) return alert("Can't buy a unit here!");
	mapArray[selectedSpace].unitGroup.push(new unit(false, selectedSpace));
	player.UsedFood += 3;
	
	var person = prompt("Enter the units name", "Sir Cadagon");
	while(person == null)
	{
		person = prompt("Enter the units name", "Sir Cadagon");
	}
	
	
	var x = mapArray[selectedSpace].unitGroup.length;
	mapArray[selectedSpace].unitGroup[0].name = person;
	mapArray[selectedSpace].unitGroup[0].updateString();
	playerFighter = mapArray[selectedSpace].unitGroup[0];
	updateMap();
}
/*********************
**********************
**********************
**********************/


function createMap()
{
	for (i = 0; i < 100; i++)
	{
		var tmpFirst = Math.floor(i/10);
		var x;
		switch(tmpFirst){
			case 0: x = 'A'; break;
			case 1: x = 'B'; break;
			case 2: x = 'C'; break;
			case 3: x = 'D'; break;
			case 4: x = 'E'; break;
			case 5: x = 'F'; break;
			case 6: x = 'G'; break;
			case 7: x = 'H'; break;
			case 8: x = 'I'; break;
			case 9: x = 'J'; break;
			default: break;
		}
		var y = i % 10;
		var tmpCellId = x + y;
		mapArray[i] = new mapCell(tmpCellId);
	}
}

function selectSpace(id)
{
	var parsedId = id.toString();
	var firstChar = parsedId[0];
	var secondChar = parsedId[1];
	var x;
		switch (firstChar){
		case 'A': x = ""; break;
		case 'B': x = 1; break;
		case 'C': x = 2; break;
		case 'D': x = 3; break;
		case 'E': x = 4; break;
		case 'F': x = 5; break;
		case 'G': x = 6; break;
		case 'H': x = 7; break;
		case 'I': x = 8; break;
		case 'J': x = 9; break;
		default: break;
		}
	var y = (x + secondChar);
	selectedId = parsedId;
	selectedSpace = y;
	if(mapArray[selectedSpace].unitGroup[0] != undefined && mapArray[selectedSpace].unitGroup[0].isEnemy == false) playerFighter = mapArray[selectedSpace].unitGroup[0];
	if(mapArray[selectedSpace].unitGroup[0] != undefined && mapArray[selectedSpace].unitGroup[0].isEnemy == true) enemyFighter = mapArray[selectedSpace].unitGroup[0];
	console.log(enemyFighter);
	updateMap();
}

function cellColor(cell)
{
	if (cell.isOpponents == true) return "red";
	
	if (cell.isPlayers != true) return "black";
	
	if (cell == undefined) return "gray";
	
	if (cell.type == "farm") return  "#FFFF33";
	
	if (cell.type == "inactive") return  "gray";
	
	if (cell.type == "quarry") return "purple";
	
	if (cell.type == "mill") return  "saddlebrown";
	
	if (cell.type == "milYard") return  "green";
	
	if (cell.type == "mine") return  "slategray";
	
	else return "black";
	
}

function updateIncrement()
{
	player.Lumber *= intervalDivisor;
	player.Lumber += player.lumberIncrementer;
	player.Lumber /= intervalDivisor;
	if (player.Lumber > player.lumberMax) player.Lumber = player.lumberMax;
	
	player.Stone *= intervalDivisor;
	player.Stone += player.stoneIncrementer;
	player.Stone /= intervalDivisor;
	if (player.Stone > player.stoneMax) player.Stone = player.stoneMax;
	
	player.Gold *= intervalDivisor;
	player.Gold += player.goldIncrementer;
	player.Gold /= intervalDivisor;
	if (player.Gold > player.goldMax) player.Gold = player.goldMax;
}

function updateCosts()
{
	if (mapArray[selectedSpace].type == "inactive") 
	{
		
		document.getElementById("buy-button-block").style.display="flex";
		document.getElementById("upgrade-button-block").style.display="none";
		document.getElementById("farm-upgrade-button").style.visibility="hidden";
		document.getElementById("mine-upgrade-button").style.visibility="hidden";
		document.getElementById("mill-upgrade-button").style.visibility="hidden";
		document.getElementById("quarry-upgrade-button").style.visibility="hidden";
	}
	
	if(mapArray[selectedSpace].type == "farm")
	{
	    var upgradeGoldCost = 10;
	    var upgradeStoneCost = 30;
	    var upgradeLumberCost = 30;
		
		
		document.getElementById("buy-button-block").style.display="none";
		document.getElementById("upgrade-button-block").style.display="flex";
		document.getElementById("farm-upgrade-button").style.visibility="visible";
		document.getElementById("mine-upgrade-button").style.visibility="hidden";
		document.getElementById("mill-upgrade-button").style.visibility="hidden";
		document.getElementById("quarry-upgrade-button").style.visibility="hidden";
		document.getElementById("upgrade-farm-cost").style.backgroundColor="#FFFF33";
		document.getElementById("upgrade-farm").style.backgroundColor="#FFFF33";
	}	
	if(mapArray[selectedSpace].type == "mine")
	{
	    var upgradeGoldCost = 10;
	    var upgradeStoneCost = 30;
	    var upgradeLumberCost = 30;
		
		document.getElementById("buy-button-block").style.display="none";
		document.getElementById("upgrade-button-block").style.display="flex";
		document.getElementById("mine-upgrade-button").style.visibility="visible";
		document.getElementById("farm-upgrade-button").style.visibility="hidden";
		document.getElementById("mill-upgrade-button").style.visibility="hidden";
		document.getElementById("quarry-upgrade-button").style.visibility="hidden";
		document.getElementById("upgrade-mine-cost").style.backgroundColor="slategray";
		document.getElementById("upgrade-mine").style.backgroundColor="slategray";
	}	
	if(mapArray[selectedSpace].type == "mill")
	{
	    var upgradeGoldCost = 10;
	    var upgradeStoneCost = 30;
	    var upgradeLumberCost = 30;
		
		document.getElementById("buy-button-block").style.display="none";
		document.getElementById("upgrade-button-block").style.display="flex";
		document.getElementById("mill-upgrade-button").style.visibility="visible";
		document.getElementById("mine-upgrade-button").style.visibility="hidden";
		document.getElementById("farm-upgrade-button").style.visibility="hidden";
		document.getElementById("quarry-upgrade-button").style.visibility="hidden";
		document.getElementById("upgrade-mill-cost").style.backgroundColor="saddlebrown";
		document.getElementById("upgrade-lumber-mill").style.backgroundColor="saddlebrown";
	}	
	if(mapArray[selectedSpace].type == "quarry")
	{
	    var upgradeGoldCost = 10;
	    var upgradeStoneCost = 30;
	    var upgradeLumberCost = 30;
		
		document.getElementById("buy-button-block").style.display="none";
		document.getElementById("upgrade-button-block").style.display="flex";
		document.getElementById("quarry-upgrade-button").style.visibility="visible";
		document.getElementById("mine-upgrade-button").style.visibility="hidden";
		document.getElementById("mill-upgrade-button").style.visibility="hidden";
		document.getElementById("farm-upgrade-button").style.visibility="hidden";
		document.getElementById("upgrade-quarry-cost").style.backgroundColor="purple";
		document.getElementById("upgrade-quarry").style.backgroundColor="purple";
	}	
	
	upgradeGoldCost = upgradeGoldCost * mapArray[selectedSpace].level;
	upgradeStoneCost = upgradeStoneCost * mapArray[selectedSpace].level;
	upgradeLumberCost = upgradeLumberCost * mapArray[selectedSpace].level;
	
	if (player.Lumber < upgradeLumberCost || player.Stone < upgradeStoneCost || player.Gold < upgradeGoldCost)
	{
		
		document.getElementById("upgrade-farm-cost").style.backgroundColor="gray";
		document.getElementById("upgrade-farm").style.backgroundColor="gray";
		document.getElementById("upgrade-mine-cost").style.backgroundColor="gray";
		document.getElementById("upgrade-mine").style.backgroundColor="gray";
		document.getElementById("upgrade-mill-cost").style.backgroundColor="gray";
		document.getElementById("upgrade-lumber-mill").style.backgroundColor="gray";
		document.getElementById("upgrade-quarry-cost").style.backgroundColor="gray";
		document.getElementById("upgrade-quarry").style.backgroundColor="gray";
	}
	
	if (mapArray[selectedSpace].isPlayers != true)
	{
		document.getElementById("buy-farm").style.backgroundColor="gray";
		document.getElementById("buy-farm-cost").style.backgroundColor="gray";
		document.getElementById("buy-farm").style.border="1px solid white";
		document.getElementById("buy-farm-cost").style.border="1px solid white";
		document.getElementById("buy-mine").style.backgroundColor="gray";
		document.getElementById("buy-mine-cost").style.backgroundColor="gray";
		document.getElementById("buy-lumber-mill").style.backgroundColor="gray";
		document.getElementById("buy-mill-cost").style.backgroundColor="gray";
		document.getElementById("buy-quarry").style.backgroundColor="gray";
		document.getElementById("buy-quarry-cost").style.backgroundColor="gray";
	}
	
	if (mapArray[selectedSpace].isPlayers == true)
	{
		document.getElementById("buy-farm").style.backgroundColor="#FFFF33";
		document.getElementById("buy-farm-cost").style.backgroundColor="#FFFF33";
		document.getElementById("buy-farm").style.border="1px solid black";
		document.getElementById("buy-farm-cost").style.border="1px solid black";
		document.getElementById("buy-mine").style.backgroundColor="slategray";
		document.getElementById("buy-mine-cost").style.backgroundColor="slategray";
		document.getElementById("buy-lumber-mill").style.backgroundColor="saddlebrown";
		document.getElementById("buy-mill-cost").style.backgroundColor="saddlebrown";
		document.getElementById("buy-quarry").style.backgroundColor="purple";
		document.getElementById("buy-quarry-cost").style.backgroundColor="purple";
	}
	
	document.getElementById("upgrade-farm-cost").innerHTML = "Lumber: " + upgradeLumberCost + "<br>" + "Stone: " + upgradeStoneCost + "<br>" + "Gold: " + upgradeGoldCost;
	document.getElementById("upgrade-mill-cost").innerHTML = "Lumber: " + upgradeLumberCost + "<br>" + "Stone: " + upgradeStoneCost + "<br>" + "Gold: " + upgradeGoldCost;
	document.getElementById("upgrade-mine-cost").innerHTML = "Lumber: " + upgradeLumberCost + "<br>" + "Stone: " + upgradeStoneCost + "<br>" + "Gold: " + upgradeGoldCost;
	document.getElementById("upgrade-quarry-cost").innerHTML = "Lumber: " + upgradeLumberCost + "<br>" + "Stone: " + upgradeStoneCost + "<br>" + "Gold: " + upgradeGoldCost;
	
}

function updateMap()
{
	updateVisibility();
	var mapString = "";
	for ( i = 0; i < 100; i++)
	{
			if (i == selectedSpace) 
			{
				mapArray[i].isSelected = true;
				if(mapArray[i].unitGroup[0] != undefined)
                {
					if(mapArray[i].unitGroup[0].isEnemy == false)
					{
					    document.getElementById('player-unit').innerHTML = mapArray[i].unitGroup[0].unitString;
					    document.getElementById('player-unit').style.visibility="visible";
						document.getElementById('battle-button').style.visibility="visible";
						document.getElementById('move-button').style.visibility="visible";
					}
					else{
						document.getElementById('enemy-unit').innerHTML = mapArray[i].unitGroup[0].unitString;
					    document.getElementById('enemy-unit').style.visibility="visible";
					}
				}
			}
			else 
			{
				mapArray[i].isSelected = false;
			}
			mapArray[i].updateCellString();
			mapString = mapString + mapArray[i].cellString;
	}
	updateCosts();
	return document.getElementById('game-table').innerHTML =  mapString;	
}

function update()
{
	if(tutCont != true) updateIncrement();
	updateCosts();
	
    var lumberPer = player.Lumber / player.lumberMax;
	var stonePer = player.Stone / player.stoneMax;
	var goldPer = player.Gold / player.goldMax;
	var colorval = 180;
	
	if (lumberPer <= .9) document.getElementById("lumber-resource").style.backgroundColor= "rgb(" + colorval + ",0,0)";
	if (lumberPer <= .75) document.getElementById("lumber-resource").style.backgroundColor="rgb("+ colorval + "," + colorval + ",0)";
	if (lumberPer <= .5) document.getElementById("lumber-resource").style.backgroundColor="rgb(0," + colorval + ",0)";
	
	if (stonePer <= .9) document.getElementById("stone-resource").style.backgroundColor="rgb(" + colorval + ",0,0)";
	if (stonePer <= .75) document.getElementById("stone-resource").style.backgroundColor="rgb("+ colorval + "," + colorval + ",0)";
	if (stonePer <= .5) document.getElementById("stone-resource").style.backgroundColor="rgb(0," + colorval + ",0)";
	
	if (goldPer <= .9) document.getElementById("gold-resource").style.backgroundColor="rgb(" + colorval + ",0,0)";
	if (goldPer <= .75) document.getElementById("gold-resource").style.backgroundColor="rgb("+ colorval + "," + colorval + ",0)";
	if (goldPer <= .5) document.getElementById("gold-resource").style.backgroundColor="rgb(0," + colorval + ",0)";
	
	if (lumberPer <= 1) document.getElementById("lumber-resource").style.backgroundImage= "linear-gradient(to right, rgb(" + colorval + ",0,0), rgb(" + colorval + ",0,0) " + lumberPer * 100 + "%, rgb(125,125,165) " + lumberPer * 100 +"%, rgb(125,125,165))";
	if (lumberPer <= .75) document.getElementById("lumber-resource").style.backgroundImage="linear-gradient(to right, rgb("+ colorval + "," + colorval + ",0), rgb("+ colorval + "," + colorval + ",0) " + lumberPer * 100 + "%, rgb(125,125,165) " + lumberPer * 100 +"%, rgb(125,125,165))";
	if (lumberPer <= .5) document.getElementById("lumber-resource").style.backgroundImage="linear-gradient(to right, rgb(0," + colorval + ",0), rgb(0," + colorval + ",0) " + lumberPer * 100 + "%, rgb(125,125,165) " + lumberPer * 100 +"%, rgb(125,125,165))";
	
	if (stonePer <= 1) document.getElementById("stone-resource").style.backgroundImage="linear-gradient(to right, rgb(" + colorval + ",0,0), rgb(" + colorval + ",0,0) " + stonePer * 100 + "%, rgb(125,125,165) " + stonePer * 100 +"%, rgb(125,125,165))";
	if (stonePer <= .75) document.getElementById("stone-resource").style.backgroundImage="linear-gradient(to right, rgb("+ colorval + "," + colorval + ",0), rgb("+ colorval + "," + colorval + ",0) " + stonePer * 100 + "%, rgb(125,125,165) " + stonePer * 100 +"%, rgb(125,125,165))";
	if (stonePer <= .5) document.getElementById("stone-resource").style.backgroundImage="linear-gradient(to right, rgb(0," + colorval + ",0), rgb(0," + colorval + ",0) " + stonePer * 100 + "%, rgb(125,125,165) " + stonePer * 100 +"%, rgb(125,125,165))";
	
	if (goldPer <= 1) document.getElementById("gold-resource").style.backgroundImage="linear-gradient(to right, rgb(" + colorval + ",0,0), rgb(" + colorval + ",0,0) " + goldPer * 100 + "%, rgb(125,125,165) " + goldPer * 100 +"%, rgb(125,125,165))";
	if (goldPer <= .75) document.getElementById("gold-resource").style.backgroundImage="linear-gradient(to right, rgb("+ colorval + "," + colorval + ",0), rgb("+ colorval + "," + colorval + ",0) " + goldPer * 100 + "%, rgb(125,125,165) " + goldPer * 100 +"%, rgb(125,125,165))";
	if (goldPer <= .5) document.getElementById("gold-resource").style.backgroundImage="linear-gradient(to right, rgb(0," + colorval + ",0), rgb(0," + colorval + ",0) " + goldPer * 100 + "%, rgb(125,125,165) " + goldPer * 100 +"%, rgb(125,125,165))";
	
	document.getElementById("lumber-value").innerHTML = player.Lumber.toFixed(0) + "  +" + player.lumberIncrementer;
	if (player.Lumber >= player.lumberMax || player.lumberIncrementer == 0) document.getElementById("lumber-value").innerHTML = player.Lumber.toFixed(0);
	document.getElementById("stone-value").innerHTML = player.Stone.toFixed(0)+ "  +" + player.stoneIncrementer;
	if (player.Stone >= player.stoneMax || player.stoneIncrementer == 0) document.getElementById("stone-value").innerHTML = player.Stone.toFixed(0);
	document.getElementById("gold-value").innerHTML = player.Gold.toFixed(0)+ "  +" + player.goldIncrementer;
	if (player.Gold >= player.goldMax || player.goldIncrementer == 0) document.getElementById("gold-value").innerHTML = player.Gold.toFixed(0);
	document.getElementById("food-use-value").innerHTML = player.UsedFood;
	document.getElementById("food-total-value").innerHTML = player.TotalFood;
	
	
	updateBattles();
	updateMove();
}

function initializePrices()
{
	document.getElementById("buy-farm-cost").innerHTML = "Lumber: " + farmLumberCost + "<br>" + "Stone: " + farmStoneCost + "<br>" + "Gold: " + farmGoldCost;
	document.getElementById("buy-mill-cost").innerHTML = "Lumber: " + LumberMillLumberCost + "<br>" + "Stone: " + LumberMillStoneCost + "<br>" + "Gold: " + LumberMillGoldCost;
	document.getElementById("buy-mine-cost").innerHTML = "Lumber: " + MineLumberCost + "<br>" + "Stone: " + MineStoneCost + "<br>" + "Gold: " + MineGoldCost;
	document.getElementById("buy-quarry-cost").innerHTML = "Lumber: " + QuarryLumberCost + "<br>" + "Stone: " + QuarryStoneCost + "<br>" + "Gold: " + QuarryGoldCost;
	
	document.getElementById("upgrade-farm-cost").innerHTML = "Lumber: " + farmLumberUpgrade + "<br>" + "Stone: " + farmStoneUpgrade + "<br>" + "Gold: " + farmGoldUpgrade;
	document.getElementById("upgrade-mill-cost").innerHTML = "Lumber: " + LumberMillLumberUpgrade + "<br>" + "Stone: " + LumberMillStoneUpgrade + "<br>" + "Gold: " + LumberMillGoldUpgrade;
	document.getElementById("upgrade-mine-cost").innerHTML = "Lumber: " + MineLumberUpgrade + "<br>" + "Stone: " + MineStoneUpgrade + "<br>" + "Gold: " + MineGoldUpgrade;
	document.getElementById("upgrade-quarry-cost").innerHTML = "Lumber: " + QuarryLumberUpgrade + "<br>" + "Stone: " + QuarryStoneUpgrade + "<br>" + "Gold: " + QuarryGoldUpgrade;
}

function initialize()
{
	player = new resources(50, 50, 10, 3, 0, 5, 0, 0, 0);
	player.lumberIncrementer = 1;
	player.stoneIncrementer = 1;
	player.goldIncrementer = .5;
	opponent = new resources(50,50,10,3,0,5,0,0,0);
	opponent.lumberIncrementer = 1;
	opponent.stoneIncrementer = 1;
	opponent.goldIncrementer = .5;
	update();
	initializePrices();
	updateMap();
	tutorial(1);
	
	//beginGame();
	
}

function beginGame()
{
	setTimeout(function ()
	{
        intervalVariable = window.setInterval(function()
	        {
	        update();


            }, 1000 / intervalDivisor );
	}, 1000);
}

function updateVisibility()
{
	for (i = 0; i < 100; i++)
	{
		if (mapArray[i].isVisible == true && mapArray[i].type != "inactive" )
		{
		    if (i % 10 != 0) mapArray[parseInt(i) - 1].isVisible = true;
		    if (i % 10 != 9) mapArray[parseInt(i) + 1].isVisible = true;
		    if (Math.floor(i / 10) != 0) mapArray[parseInt(i) - 10].isVisible = true;
		    if (Math.floor(i / 10) != 9) mapArray[parseInt(i) + 10].isVisible = true;
		}
	}
	
}

function battle(playerUnit, enemyUnit)
{
	var x = battleTimeCount % playerUnit.speed;
	var y = battleTimeCount % enemyUnit.speed;
	
	if (playerUnit.speed - x == playerUnit.speed)
	{		
        mapArray[enemyUnit.currentCell].unitGroup[0].attacked(playerUnit);
		mapArray[enemyUnit.currentCell].unitGroup[0].updateString();
		var fightMessage = playerFighter.name + " just attacked! He did " + (playerFighter.attack - enemyFighter.defense) + " damage.";
		message(fightMessage, "palegreen");
		document.getElementById('player-unit').innerHTML = mapArray[playerUnit.currentCell].unitGroup[0].unitString;
		document.getElementById('enemy-unit').innerHTML = mapArray[enemyUnit.currentCell].unitGroup[0].unitString;
	}
	if (enemyUnit.speed - y == enemyUnit.speed) 
	{
		mapArray[playerUnit.currentCell].unitGroup[0].attacked(enemyUnit);
	    mapArray[playerUnit.currentCell].unitGroup[0].updateString();
		var fightMessage = enemyFighter.name + " just attacked! He did " + (enemyFighter.attack - playerFighter.defense) + " damage.";
		message(fightMessage, "indianred");
		document.getElementById('player-unit').innerHTML = mapArray[playerUnit.currentCell].unitGroup[0].unitString;
		document.getElementById('enemy-unit').innerHTML = mapArray[enemyUnit.currentCell].unitGroup[0].unitString;
	}
	mapArray[playerUnit.currentCell].unitGroup[0].updateString();
	mapArray[enemyUnit.currentCell].unitGroup[0].updateString();
	
	battleTimeCount++;
	
	if (mapArray[playerUnit.currentCell].unitGroup[0].health <= 0) 
	{
		message("Oh no! " + mapArray[playerUnit.currentCell].unitGroup[0].name + " was killed in battle!", "indianred");
		mapArray[playerUnit.currentCell].unitGroup = [];
		document.getElementById('player-unit').innerHTML = "";
		document.getElementById('player-unit').style.visibility="hidden";
		battling = false;
		battleTimeCount = 0;
		updateMap();
	}
	if (mapArray[enemyUnit.currentCell].unitGroup[0].health <= 0) 
	{
		message("Hoorah! " + mapArray[enemyUnit.currentCell].unitGroup[0].name + " was killed in battle!", "palegreen");
		mapArray[enemyUnit.currentCell].unitGroup = [];
		mapArray[enemyUnit.currentCell].isPlayers = true;
		mapArray[enemyUnit.currentCell].updateCellString();
		document.getElementById('enemy-unit').innerHTML = "";
		document.getElementById('enemy-unit').style.visibility="hidden";
		battling = false
		battleTimeCount = 0;
		updateMap();
	}
}

function updateBattles()
{
	if(battling == true)
	{
	    battle(playerFighter, enemyFighter);
	}
}

function startBattle()
{
	if(playerFighter != undefined && enemyFighter != undefined)
	{
	    if ((playerFighter.currentCell == enemyFighter.currentCell - 1) || (playerFighter.currentCell == enemyFighter.currentCell - 10) || (playerFighter.currentCell == enemyFighter.currentCell + 1) || (playerFighter.currentCell == enemyFighter.currentCell + 10))
	    {
		    battling = true;
			moving = false;
	    }
		else alert("Enemy is too far away");
	}
	else alert("No units to fight");
}

function moveUnit(newSpace)
{
	var start = playerFighter.currentCell;
	if (start > newSpace)
	{
		if (Math.floor(start / 10) - Math.floor(newSpace / 10) > 0)
		{
			mapArray[start].unitGroup = [];
			mapArray[start].updateCellString();
			start -= 10;
			mapArray[start].unitGroup.push(playerFighter);
			playerFighter.currentCell = start;
			mapArray[start].updateCellString();
		}
		else if (start - newSpace > 0)
		{
			mapArray[start].unitGroup = [];
			mapArray[start].updateCellString();
			start -= 1;
			mapArray[start].unitGroup.push(playerFighter);
			playerFighter.currentCell = start;
			mapArray[start].updateCellString();
		}
	}
	else if (start < newSpace)
	{
		if (Math.floor(newSpace / 10) - Math.floor(start / 10) > 0)
		{
			mapArray[start].unitGroup = [];
			mapArray[start].updateCellString();
			start = Number(start) + 10;
			console.log(start);
			mapArray[start].unitGroup.push(playerFighter);
			playerFighter.currentCell = start;
			mapArray[start].updateCellString();
		}
		else if (newSpace - start > 0)
		{
			mapArray[start].unitGroup = [];
			mapArray[start].updateCellString();
			start = Number(start) + 1;
			mapArray[start].unitGroup.push(playerFighter);
			playerFighter.currentCell = start;
			mapArray[start].updateCellString();
		}
	}
	if(start == newSpace) 
	{
		moving = false;
		console.log("stopped moving");
	}
	updateMap();
}

function updateMove()
{
	if (moving == true)
	{
		moveUnit(newSpace);
	}
}

function startMove()
{
	if (playerFighter != undefined)
	{
		if (mapArray[selectedSpace].isPlayers == true)
		{
			moving = true;
			newSpace = selectedSpace;
			battling = false;
		    battleTimeCount = 0;
		}
	}
}

function tooltip(input)
{
	
	var text = "Recruit";
	var elem = document.getElementById("tool-tip");
	if (input == "hide") return elem.style.visibility="hidden";
	var e = event || window.event;
		if (e.pageX || e.pageY) {
			cordx = e.pageX;
			cordy = e.pageY;
		} else if (e.clientX || e.clientY) {
			cordx = e.clientX;
			cordy = e.clientY;
			
		}
		elem.style.left = (cordx + 5) + "px";
		elem.style.top = (cordy) + "px";
		elem.style.visibility="visible";
		elem.style.display="block";
		elem.innerHTML=text;
}

function setUpStartingSpaces()
{
	mapArray[0].start("farm", true);
	mapArray[1].start("mill", true);
	mapArray[10].start("quarry", true);
	mapArray[11].start("mine", true);
	
	mapArray[99].start("farm", false);
	mapArray[98].start("mill", false);
	mapArray[89].start("quarry", false);
	mapArray[88].start("mine", false);
	
	
	mapArray[2].unitGroup.push(new unit(true, 2));
	mapArray[2].unitGroup[0].name = "Bandit";
	mapArray[2].unitGroup[0].type ="recruit";
	mapArray[2].unitGroup[0].updateNumbers();
	mapArray[2].unitGroup[0].modify();
	mapArray[2].unitGroup[0].updateString();
	
	mapArray[12].unitGroup.push(new unit(true, 12));
	mapArray[12].unitGroup[0].name = "Bandit";
	mapArray[12].unitGroup[0].type ="recruit";
	mapArray[12].unitGroup[0].updateNumbers();
	mapArray[12].unitGroup[0].modify();
	mapArray[12].unitGroup[0].updateString();
	
	
}

function message(messageString, color)
{
	var elem = document.getElementById('output-bank');
	elem.innerHTML += "<span style='background-color: " + color + "'>" + messageString + "</span><br>";
	elem.scrollTop = elem.scrollHeight;
}

function tutorial(tutNum)
{
	if(tutNum == 1) tutorialMessage("Let's get started grabbing some land!"           , ""                 , "" , tutNum);
	if(tutNum == 2)
	{
		var messageString = "Build structures to collect resources.<ul>" +
							"<li style='font-size: .6em; text-align: left'>Mill: Lumber</li>" +
							"<li style='font-size: .6em; text-align: left'>Quarry: Stone</li>" + 
							"<li style='font-size: .6em; text-align: left'>Mine: Gold</li>" +
							"<li style='font-size: .6em; text-align: left'>Farm: Food</li>" +
							"</ul>";
		tutorialMessage(messageString         , "buy-button-block" , "" , tutNum);
	}
	if(tutNum == 3) 
	{
		var messageString = "Collect resources to build units.<ul>" +
							"<li style='font-size: .6em'>The number next to your total is amount earned per second</li>" +
							"<li style='font-size: .6em'>The color changes to red as you get closer to filling your Stock Piles</li>" +
							"<li style='font-size: .6em'>The total amount you can store is determined by the single highlest level of building you have for that resource</li>" +
							"</ul>";
		
		tutorialMessage(messageString               , "resource-table"   , "buy-button-block" , tutNum);
	}
	if(tutNum == 4) tutorialMessage("Build Units to capture more land!"               , "buy-unit-block"   , "resource-table", tutNum);
	if(tutNum == 5) tutorialMessage("Capture the board before your enemy does to Win!", "game-table"       , "buy-unit-block", tutNum);
	if(tutNum == 6) tutorialMessage("Good Luck!"                                      , ""                 , "game-table", tutNum);	
	if(tutNum == 7) tutorialMessage("", "game-table", "" , tutNum);
}

function tutorialMessage(message, highlightedID, previousID, tutNum)
{
	if(tutNum == 1)
	{
		document.getElementById('mask').style.display="block";
		document.getElementById('tutorial-block').style.display="block";
		document.getElementById('tutorial-text').style.display="block";
		document.getElementById('tutorial-button').style.display="block";
	}
	if(tutNum == 2)
	{
		document.getElementById('tutorial-block').style.top="25vh";
		document.getElementById('tutorial-block').style.left="60vw";
	}
	if(tutNum == 3)
	{
		document.getElementById('tutorial-block').style.top="13vh";
		document.getElementById('tutorial-block').style.left="35vw";
	}
	if(tutNum == 4)
	{
		document.getElementById('tutorial-block').style.top="40vh";
		document.getElementById('tutorial-block').style.left="61vw";
	}
	if(tutNum == 5)
	{
		document.getElementById('tutorial-block').style.top="12vh";
		document.getElementById('tutorial-block').style.left="56vw";
		document.getElementById(highlightedID).style.border="1px solid white";
	}
	if(tutNum == 6)
	{
		document.getElementById('tutorial-block').style.top="25vh";
		document.getElementById('tutorial-block').style.left="35vw";
		document.getElementById(previousID).style.border="0px none white";
	}
	
	if(previousID != "")document.getElementById(previousID).style.zIndex="0";
	document.getElementById('tutorial-text').innerHTML = message;
	if(highlightedID != "")document.getElementById(highlightedID).style.zIndex="100";
	
	if (tutNum == 7)
	{
		document.getElementById('tutorial-block').style.display="none";
		document.getElementById('tutorial-text').style.display="none";
		document.getElementById('tutorial-button').style.display="none";
		document.getElementById('mask').style.display="none";
		tutCont = false;
		setUpStartingSpaces();
		updateMap();
		beginGame();
	}
	
	tutNum = Number(tutNum) + 1;
	var clickString = "javascript: tutorial(" + tutNum + ")";
	document.getElementById("tutorial-button").setAttribute("onclick", clickString);
}


