var player, opponent;
var selectedSpace = "0";
var mapArray = [];
var map;

var newSpace = 0;
var moving = false;
var merging = false;
var battleTimeCount = 0;
var battling = false;

//var playerFighting;
//var enemyFighting;
var intervalDivisor = 1;
var intervalVariable = 0;
var selectedId;

var tutCont = true;


/** 
OBJECT PROTOTYPES
*/
function resources(lum, sto, gold, totFood, useFood, exp, knightExp, archerExp, mageExp, difMod)
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
	this.difficultyMod = difMod;
	
	this.lumberIncrementer = 0;
	this.stoneIncrementer = 0;
	this.goldIncrementer = 0;
	
	this.farmGoldCost = 0;
	this.farmLumberCost = 20;
	this.farmStoneCost = 15;
	this.LumberMillGoldCost = 0;
	this.LumberMillStoneCost = 25;
	this.LumberMillLumberCost = 25;
	this.QuarryGoldCost = 0;
	this.QuarryStoneCost = 25;
	this.QuarryLumberCost = 25;
	this.MineGoldCost = 10;
	this.MineLumberCost = 30;
	this.MineStoneCost = 15;
	this.YardGoldCost = 20;
	this.YardLumberCost = 60;
	this.YardStoneCost = 60;

	this.farmGoldUpgrade = 10;
	this.farmLumberUpgrade = 30;
	this.farmStoneUpgrade = 30;
	this.LumberMillGoldUpgrade = 10;
	this.LumberMillStoneUpgrade = 30;
	this.LumberMillLumberUpgrade = 30;
	this.QuarryGoldUpgrade = 10;
	this.QuarryStoneUpgrade = 30;
	this.QuarryLumberUpgrade = 30;
	this.MineGoldUpgrade = 10;
	this.MineLumberUpgrade = 30;
	this.MineStoneUpgrade = 30;
	
	this.UnitLumberCost = 0;
	this.UnitStoneCost = 0;
	this.UnitGoldCost = 0;
	
	this.UnitLumberUpgrade = 0;
	this.UnitStoneUpgrade = 0;
	this.UnitGoldUpgrade = 0;
	this.UnitExpCost = 0;
	
	this.haveAFarm = false;
	this.haveAMill = false;
	this.haveAQuarry = false;
	this.haveAMine = false;
	this.haveAYard = false;
	
	this.lumberMax = 100;
	this.stoneMax = 100;
	this.goldMax = 60;
	
	this.lumberLevel = 0;
	this.stoneLevel = 0;
	this.goldLevel = 0;
	
	this.Group = new unitGroup();
}

function unitGroup()
{
	this.selectedFighter = {};
	this.battlingFighter = {};
	this.selectedFighterGroup = [];
	this.battlingFighterGroup = [];
}

function unit(owner, cell, who)
{
	this.isEnemy = owner;
	this.type = "recruit";
	this.name = "";
	this.currentKnight = "";
	this.currentArcher = "";
	this.currentMage = "";
	
	this.knightlvl = 0;
	this.archerlvl = 0;
	this.magelvl = 0;
	
	this.defense = 0;
	this.health = 0;
	this.totalHealth = 0;
	this.attack = 0;
	this.speed = 0;
	this.nextAttack = 0;
	
	this.currentExp = 0;
	this.expEarned = 0;
	
	this.currentCell = cell;
	
	this.updateNumbers = function(newType)
	    {
			var addAtk= 0;
			var addDef= 0;
			var addHlt= 0;
			var addSpd = 0;
			var addExpEarned = 0;
			
		    if(newType == "recruit")
			{
				addDef = 20;
	            addHlt = 100;
	            addAtk = 40;
				addExpEarned = 5;
				//addSpd;
	            this.speed = 5;
			}
			if(newType == "Knight")
			{
				addDef = (this.defense / who.difficultyMod * 1.5);
	            addHlt = (this.health / who.difficultyMod * 2);
				addAtk = (this.attack / who.difficultyMod * 1.5);
				addExpEarned = this.expEarned * 1.2;
				//addSpd;
				this.speed = 5;
			}
			if(newType == "Archer")
			{
				addDef = (this.defense / who.difficultyMod * 1.75);
	            addHlt = (this.health / who.difficultyMod * 1.6);
				addAtk = (this.attack / who.difficultyMod * 1.5);
				addExpEarned = this.expEarned * 1.2;
				//addSpd;
				this.speed = 3;
			}
			if(newType == "Mage")
			{
				addDef = (this.defense / who.difficultyMod * 1.25);
	            addHlt = (this.health / who.difficultyMod * 1.25);
				addAtk = (this.attack / who.difficultyMod * 1.75);
				addExpEarned = this.expEarned * 1.2;
				//addSpd;
				this.speed = 4;
			}
			
			this.defense += addDef;
			this.attack += addAtk;
			this.health += addHlt;
			this.totalHealth += addHlt;
			this.expEarned += addExpEarned;
			//this.speed += addSpd;
	    }
	
	
	
	this.attacked = function(attacker)
	    {
		    this.health -= (attacker.attack - this.defense);
	    }
	
	this.unitString = "";
	this.updateString = function() 
	    {
		    var attackString = "<p>Attack: " + this.attack + "</p>";
			var defenseString = "<p>Defense: " + this.defense + "</p>";
			var health = "<p>Health: " + this.health + "/" + this.totalHealth + "</p>";
			var expString = "<p>" + this.currentExp + " exp</p>";
			var knightString = "<p>" + this.currentKnight + "</p>";
			var archerString = "<p>" + this.currentArcher + "</p>";
			var mageString = "<p>" + this.currentMage + "</p>";
			this.unitString = health + attackString + defenseString + expString + knightString + archerString + mageString;
	    }
		
	this.modify = function()
	    {
		    this.defense *= who.difficultyMod;
		    this.health *= who.difficultyMod;
		    this.totalHealth *= who.difficultyMod;
		    this.attack *= who.difficultyMod;
	    }
}

function mapCell(theCellId)
{
	this.type = "inactive";
	this.isMountain = false;
	this.isPlayers = true;
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
			if (this.unitGroup.length != 0 && this.unitGroup[0] != undefined) 
			{
				if(this.type != "inactive" || (this.type == "inactive" && this.isPlayers == true))
				{
					colorString += "; background-image: linear-gradient(to top right, deepskyblue, deepskyblue 25%, " + cellColor(this) + " 25%, " + cellColor(this) + " 75%, deepskyblue 75%, deepskyblue)";
					if (player.Group.selectedFighter.currentCell != undefined)
					{
						if(this.unitGroup[0].currentCell == player.Group.selectedFighter.currentCell)colorString += "; background-image: linear-gradient(to top right, white, white 25%, " + cellColor(this) + " 25%, " + cellColor(this) + " 75%, white 75%, white)";
					}
				}
				else
				{
					colorString += "; background-image: linear-gradient(to top right, #14dcb4, #14dcb4 25%, " + cellColor(this) + " 25%, " + cellColor(this) + " 75%, #14dcb4 75%, #14dcb4)";
					if (opponent.Group.selectedFighter.currentCell != undefined && this.unitGroup[0].currentCell == opponent.Group.selectedFighter.currentCell)
					colorString += "; background-image: linear-gradient(to top right, crimson, crimson 25%, " + cellColor(this) + " 25%, " + cellColor(this) + " 75%, crimson 75%, crimson)";
				}
				
			}
			var visibleString = "";
			if (this.isVisible == true || tutCont == true) visibleString = "; visibility: visible";
			var borderString = "";
			if (this.isSelected == true) borderString = "; border: 3px solid white; height: calc(5.7vh - 8px)";
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
		
	this.start = function(type, ownership, owner) {
		this.type = type;
		this.level = 1;
		this.isPlayers = ownership;
		if(this.isPlayers) this.isVisible = true;
		this.cellInformation = "LVL <span>" + this.level + "</span>";
		this.updateStyleString();
		this.updateCellString();
		if (type == "farm") owner.haveAFarm = true;
		if (type == "mill") owner.haveAMill = true;
		if (type == "quarry") owner.haveAQuarry = true;
		if (type == "mine") owner.haveAMine = true;
	}
		
}

/*********************
**********************
**********************
**********************/

/**
BUY AND UPGRADE FUNCTIONS
*/
function upgrade(owner)
{
	if(mapArray[selectedSpace].type == "farm")
	{
	    var upgradeGoldCost = owner.farmGoldUpgrade;
	    var upgradeStoneCost = owner.farmStoneUpgrade;
	    var upgradeLumberCost = owner.farmLumberUpgrade;
	}	
	if(mapArray[selectedSpace].type == "mine")
	{
	    var upgradeGoldCost = owner.MineGoldUpgrade;
	    var upgradeStoneCost = owner.MineStoneUpgrade;
	    var upgradeLumberCost = owner.MineLumberUpgrade;
	}	
	if(mapArray[selectedSpace].type == "mill")
	{
	    var upgradeGoldCost = owner.LumberMillGoldUpgrade;
	    var upgradeStoneCost = owner.LumberMillStoneUpgrade;
	    var upgradeLumberCost = owner.LumberMillLumberUpgrade;
	}	
	if(mapArray[selectedSpace].type == "quarry")
	{
	    var upgradeGoldCost = owner.QuarryGoldUpgrade;
	    var upgradeStoneCost = owner.QuarryStoneUpgrade;
	    var upgradeLumberCost = owner.QuarryLumberUpgrade;
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

function buyFarm(owner)
{
	if(mapArray[selectedSpace].type != "inactive") return alert("Can't buy a farm here");
	if(mapArray[selectedSpace].isPlayers == false) return;
		
 	if(player.Gold >= owner.farmGoldCost && player.Lumber >= owner.farmLumberCost && player.Stone >= owner.farmStoneCost)
	{
		player.Gold -= owner.farmGoldCost;
		player.Lumber -= owner.farmLumberCost;
		player.Stone -= owner.farmStoneCost;
		player.TotalFood += 3;
		mapArray[selectedSpace].type = "farm";
		mapArray[selectedSpace].level = 1;
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		owner.haveAFarm = true;
		mapArray[selectedSpace].isPlayers = true;
		updateMap();
		update();
	}
}

function buyMill(owner)
{
	if(mapArray[selectedSpace] == undefined) return alert('HEY, NO CELL SELECTED');
	
	if(mapArray[selectedSpace].type != "inactive") return alert("Can't buy a Lumber Mill here");
	if(mapArray[selectedSpace].isPlayers == false) return;
		
 	if(player.Gold >= owner.LumberMillGoldCost && player.Lumber >= owner.LumberMillLumberCost && player.Stone >= owner.LumberMillStoneCost)
	{
		player.Gold -= owner.LumberMillGoldCost;
		player.Lumber -= owner.LumberMillLumberCost;
		player.Stone -= owner.LumberMillStoneCost;
		player.lumberIncrementer += 1;
		mapArray[selectedSpace].type = "mill";
		mapArray[selectedSpace].level = 1;
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		owner.haveAMill = true;
		if (owner.haveAQuarry == true) 
		{
			document.getElementById("farm-button").style.visibility="visible";
			document.getElementById("mine-button").style.visibility="visible";
		}
		mapArray[selectedSpace].isPlayers = true;
		updateMap();
		update();
	}
}

function buyQuarry(owner)
{
	if(mapArray[selectedSpace] == undefined) return alert('HEY, NO CELL SELECTED');
	
	if(mapArray[selectedSpace].type != "inactive") return alert("Can't buy a Quarry here");
	if(mapArray[selectedSpace].isPlayers == false) return;
		
 	if(player.Gold >= owner.QuarryGoldCost && player.Lumber >= owner.QuarryLumberCost && player.Stone >= owner.QuarryStoneCost)
	{
		player.Gold -= owner.QuarryGoldCost;
		player.Lumber -= owner.QuarryLumberCost;
		player.Stone -= owner.QuarryStoneCost;
		player.stoneIncrementer += 1;
		mapArray[selectedSpace].type = "quarry";
		mapArray[selectedSpace].level = 1;
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		owner.haveAQuarry = true;
		if (owner.haveAMill == true) 
		{
			document.getElementById("farm-button").style.visibility="visible";
			document.getElementById("mine-button").style.visibility="visible";
		}
		mapArray[selectedSpace].isPlayers = true;
		updateMap();
		update();
	}
}

function buyMine(owner)
{
	if(mapArray[selectedSpace] == undefined) return alert('HEY, NO CELL SELECTED');
	
	if(mapArray[selectedSpace].type != "inactive") return alert("Can't buy a Mine here");
	if(mapArray[selectedSpace].isPlayers == false) return;
		
 	if(player.Gold >= owner.MineGoldCost && player.Lumber >= owner.MineLumberCost && player.Stone >= owner.MineStoneCost)
	{
		player.Gold -= owner.MineGoldCost;
		player.Lumber -= owner.MineLumberCost;
		player.Stone -= owner.MineStoneCost;
		player.goldIncrementer += .5;
		mapArray[selectedSpace].type = "mine";
		mapArray[selectedSpace].level = 1;
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		owner.haveAMine = true;
		mapArray[selectedSpace].isPlayers = true;
		updateMap();
		update();
	}
}

function buyYard(owner)
{
	if(mapArray[selectedSpace] == undefined) return alert('HEY, NO CELL SELECTED');
	
	if(mapArray[selectedSpace].type != "inactive") return alert("Can't buy an Academy here");
	if(mapArray[selectedSpace].isPlayers == false) return;
		
 	if(player.Gold >= owner.YardGoldCost && player.Lumber >= owner.YardLumberCost && player.Stone >= owner.YardStoneCost)
	{
		player.Gold -= owner.YardGoldCost;
		player.Lumber -= owner.YardLumberCost;
		player.Stone -= owner.YardStoneCost;
		player.goldIncrementer += .5;
		mapArray[selectedSpace].type = "yard";
		mapArray[selectedSpace].level = 1;
		mapArray[selectedSpace].cellInformation = "LVL <span>" + mapArray[selectedSpace].level + "</span>";
		owner.haveAYard = true;
		mapArray[selectedSpace].isPlayers = true;
		updateMap();
		update();
	}
}

function buyUnit(owner)
{
	if (mapArray[selectedSpace].type == "inactive") return alert("You don't own this space here. Build a structure before buying units.");
	if (mapArray[selectedSpace].unitGroup.length == 3) return alert("Can't buy a unit here!");
	if (player.Lumber < player.UnitLumberCost || player.Stone < player.UnitStoneCost || player.Gold < player.UnitGoldCost) return alert("Not enough resources for that!");
	if (player.UsedFood + 3 > player.TotalFood)
	{
	    alert("Not Enough Food To feed him!");
	    return;
	}
	
	player.Lumber -= player.UnitLumberCost;
	player.Stone -= player.UnitStoneCost;
	player.Gold -= player.UnitGoldCost;
	
	mapArray[selectedSpace].unitGroup.push(new unit(false, selectedSpace, player));
	player.UsedFood += 3;
	
	var person = prompt("Enter the units name", "Ender");
	while(person == null)
	{
		person = prompt("Enter the units name", "Ender");
	}
	
	
	var x = mapArray[selectedSpace].unitGroup.length;
	mapArray[selectedSpace].unitGroup[x-1].name = person;
	mapArray[selectedSpace].unitGroup[x-1].updateNumbers("recruit");
	mapArray[selectedSpace].unitGroup[x-1].updateString();
	player.Group.selectedFighterGroup = mapArray[selectedSpace].unitGroup;
	player.Group.selectedFighter = player.Group.selectedFighterGroup[0];
	updateMap();
}

function upgradeUnit(owner, newType, baseType,level)
{
	var modUpgradeLumber = Math.round(owner.UnitLumberUpgrade * (1.8)^level);
	var modUpgradeStone = Math.round(owner.UnitStoneUpgrade * (1.8)^level);
	var modUpgradeGold = Math.round(owner.UnitGoldUpgrade * (2.0)^level);
	var modUpgradeExp = Math.round(owner.UnitExpCost * (2.0)^level);
	var typeExp;
	if (baseType == 'knight') typeExp = owner.KnightExp;
	if (baseType == 'archer') typeExp = owner.ArcherExp;
	if (baseType == 'mage') typeExp = owner.MageExp;
	
	if (owner.Lumber < modUpgradeLumber || owner.Stone < modUpgradeStone || owner.Gold < modUpgradeGold) return alert("Not enough resources for that!");
	if (owner.Group.selectedFighter.currentExp + typeExp < modUpgradeExp) return alert("Not enough experience. Kill more or train more.");
	
	owner.Lumber -= modUpgradeLumber;
	owner.Stone -= modUpgradeStone;
	owner.Gold -= modUpgradeGold;
	
	if (modUpgradeExp <= owner.Group.selectedFighter.currentExp) owner.Group.selectedFighter.currentExp -= modUpgradeExp;
	else
	{
		modUpgradeExp -= owner.Group.selectedFighter.currentExp;
		if(baseType == 'knight') owner.KnightExp -= modUpgradeExp;
		if(baseType == 'archer') owner.ArcherExp -= modUpgradeExp;
		if(baseType == 'mage') owner.MageExp -= modUpgradeExp;
		owner.Group.selectedFighter.currentExp = 0;
	}
	
	if (baseType == 'knight')
	{
		owner.Group.selectedFighter.currentKnight = newType;
		owner.Group.selectedFighter.updateNumbers(newType);
		owner.Group.selectedFighter.updateString();
		owner.Group.selectedFighter.knightlvl++;
	}
	if (baseType == 'archer')
	{
		owner.Group.selectedFighter.currentArcher = newType;
		owner.Group.selectedFighter.updateNumbers(newType);
		owner.Group.selectedFighter.updateString();
		owner.Group.selectedFighter.archerlvl++;
	}
	if (baseType == 'mage')
	{
		owner.Group.selectedFighter.currentMage = newType;
		owner.Group.selectedFighter.updateNumbers(newType);
		owner.Group.selectedFighter.updateString();
		owner.Group.selectedFighter.magelvl++;
	}
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
		var x = 'Z';
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
	selectedId = id.toString();
	var firstChar = selectedId[0];
	var secondChar = selectedId[1];
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
	selectedSpace = y;
	if(mapArray[selectedSpace].unitGroup[0] != undefined && mapArray[selectedSpace].unitGroup[0].isEnemy == false) 
	{
		player.Group.selectedFighterGroup = mapArray[selectedSpace].unitGroup;
		player.Group.selectedFighter = player.Group.selectedFighterGroup[0];
		console.log(player.Group);
	}
	if(mapArray[selectedSpace].unitGroup[0] != undefined && mapArray[selectedSpace].unitGroup[0].isEnemy == true)
	{
		opponent.Group.selectedFighterGroup = mapArray[selectedSpace].unitGroup;
		opponent.Group.selectedFighter = opponent.Group.selectedFighterGroup[0];
	}
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
	
	if (cell.type == "yard") return  "green";
	
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

function updateCosts(owner)
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
	    var upgradeGoldCost = owner.farmGoldUpgrade;
	    var upgradeStoneCost = owner.farmStoneUpgrade;
	    var upgradeLumberCost = owner.farmLumberUpgrade;
		
		
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
	    var upgradeGoldCost = owner.MineGoldUpgrade;
	    var upgradeStoneCost = owner.MineStoneUpgrade;
	    var upgradeLumberCost = owner.MineLumberUpgrade;
		
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
	    var upgradeGoldCost = owner.LumberMillGoldUpgrade;
	    var upgradeStoneCost = owner.LumberMillStoneUpgrade;
	    var upgradeLumberCost = owner.LumberMillLumberUpgrade;
		
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
	    var upgradeGoldCost = owner.QuarryGoldUpgrade;
	    var upgradeStoneCost = owner.QuarryStoneUpgrade;
	    var upgradeLumberCost = owner.QuarryLumberUpgrade;
		
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
		document.getElementById("buy-farm-cost").style.borderTop="0px";
		document.getElementById("buy-mine").style.backgroundColor="gray";
		document.getElementById("buy-mine-cost").style.backgroundColor="gray";
		document.getElementById("buy-lumber-mill").style.backgroundColor="gray";
		document.getElementById("buy-mill-cost").style.backgroundColor="gray";
		document.getElementById("buy-quarry").style.backgroundColor="gray";
		document.getElementById("buy-quarry-cost").style.backgroundColor="gray";
		document.getElementById("buy-yard").style.backgroundColor="gray";
		document.getElementById("buy-yard-cost").style.backgroundColor="gray";
	}
	
	if (mapArray[selectedSpace].isPlayers == true)
	{
		document.getElementById("buy-farm").style.backgroundColor="#FFFF33";
		document.getElementById("buy-farm-cost").style.backgroundColor="#FFFF33";
		document.getElementById("buy-farm").style.border="1px solid black";
		document.getElementById("buy-farm-cost").style.border="1px solid black";
		document.getElementById("buy-farm-cost").style.borderTop="0px";
		document.getElementById("buy-mine").style.backgroundColor="slategray";
		document.getElementById("buy-mine-cost").style.backgroundColor="slategray";
		document.getElementById("buy-lumber-mill").style.backgroundColor="saddlebrown";
		document.getElementById("buy-mill-cost").style.backgroundColor="saddlebrown";
		document.getElementById("buy-quarry").style.backgroundColor="purple";
		document.getElementById("buy-quarry-cost").style.backgroundColor="purple";
		document.getElementById("buy-yard").style.backgroundColor="forestgreen";
		document.getElementById("buy-yard-cost").style.backgroundColor="forestgreen";
	}
	
	
	document.getElementById("buy-recruit-cost").innerHTML = "Lumber: " + player.UnitLumberCost + "<br>" + "Stone: " + player.UnitStoneCost + "<br>" + "Gold: " + player.UnitGoldCost;
	document.getElementById("buy-knight-cost").innerHTML = "Lumber: " + player.UnitLumberCost + "<br>" + "Stone: " + player.UnitStoneCost + "<br>" + "Gold: " + player.UnitGoldCost;
	document.getElementById("buy-archer-cost").innerHTML = "Lumber: " + player.UnitLumberCost + "<br>" + "Stone: " + player.UnitStoneCost + "<br>" + "Gold: " + player.UnitGoldCost;
	document.getElementById("buy-mage-cost").innerHTML = "Lumber: " + player.UnitLumberCost + "<br>" + "Stone: " + player.UnitStoneCost + "<br>" + "Gold: " + player.UnitGoldCost;
	
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
				updateCards(i);
				
			}
			else 
			{
				mapArray[i].isSelected = false;
			}
			mapArray[i].updateCellString();
			mapString = mapString + mapArray[i].cellString;
	}
	updateCosts(player);
	return document.getElementById('game-table').innerHTML =  mapString;	
}

function updateCards(i)
{
	if(mapArray[i].isPlayers == true)
	{
		if(player.Group.selectedFighterGroup.length != 0)
		{
			document.getElementById('player-unit').innerHTML = player.Group.selectedFighterGroup[0].unitString;
			document.getElementById('player-card-1').innerHTML= player.Group.selectedFighterGroup[0].name;
			if (opponent.Group.selectedFighterGroup.length != 0)
			{
				document.getElementById('enemy-unit').innerHTML = opponent.Group.selectedFighterGroup[0].unitString;
				document.getElementById('enemy-card-1').innerHTML= opponent.Group.selectedFighterGroup[0].name;
			}
			else
			{
				document.getElementById('enemy-card-1').style.color="crimson";
			}
			document.getElementById('player-card-1').style.color="white";
			if(player.Group.selectedFighterGroup.length > 2)
			{
				document.getElementById('player-card-2').innerHTML= player.Group.selectedFighterGroup[1].name;
				document.getElementById('player-card-3').innerHTML= player.Group.selectedFighterGroup[2].name;
				document.getElementById('player-card-2').style.color="white";
				document.getElementById('player-card-3').style.color="white";
			}
			else if(player.Group.selectedFighterGroup.length > 1)
			{
				document.getElementById('player-card-2').innerHTML= player.Group.selectedFighterGroup[1].name;
				document.getElementById('player-card-2').style.color="white";
				document.getElementById('player-card-3').style.color="dodgerblue";
			}
			else
			{
				document.getElementById('player-card-2').style.color="dodgerblue";
				document.getElementById('player-card-3').style.color="dodgerblue";
			}
		}
		else
		{
			document.getElementById('player-unit').innerHTML = "";
			document.getElementById('player-card-1').style.color="dodgerblue";
			document.getElementById('player-card-2').style.color="dodgerblue";
			document.getElementById('player-card-3').style.color="dodgerblue";
		}
	}	
	else //if(mapArray[i].isOpponents == true)
	{
		if(opponent.Group.selectedFighterGroup.length != 0)
		{
			document.getElementById('enemy-unit').innerHTML = opponent.Group.selectedFighterGroup[0].unitString;
			document.getElementById('enemy-card-1').innerHTML= opponent.Group.selectedFighterGroup[0].name;
			if(player.Group.selectedFighterGroup.length != 0)
			{
				document.getElementById('player-unit').innerHTML = player.Group.selectedFighterGroup[0].unitString;
				document.getElementById('player-card-1').innerHTML= player.Group.selectedFighterGroup[0].name;
			}
			else
			{
				document.getElementById('player-card-1').style.color="dodgerblue";
			}
			document.getElementById('enemy-card-1').style.color="white";
			document.getElementById('enemy-card-1').style.width="calc(60% - 2px)";
			document.getElementById('enemy-card-2').style.width="calc(20% - 2px)";
			document.getElementById('enemy-card-3').style.width="calc(19% - 2px)";
			if(opponent.Group.selectedFighterGroup.length > 2)
			{
				document.getElementById('enemy-card-2').innerHTML= opponent.Group.selectedFighterGroup[1].name;
				document.getElementById('enemy-card-3').innerHTML= opponent.Group.selectedFighterGroup[2].name;
				document.getElementById('enemy-card-2').style.color="white";
				document.getElementById('enemy-card-3').style.color="white";
			}
			else if(opponent.Group.selectedFighterGroup.length > 1)
			{
				document.getElementById('enemy-card-2').innerHTML= opponent.Group.selectedFighterGroup[1].name;
				document.getElementById('enemy-card-2').style.color="white";
				document.getElementById('enemy-card-3').style.color="crimson";
			}
			else
			{
				document.getElementById('enemy-card-2').style.color="crimson";
				document.getElementById('enemy-card-3').style.color="crimson";
			}
		}
		else
		{
			document.getElementById('enemy-unit').innerHTML = "";
			document.getElementById('enemy-card-1').style.color="crimson";
			document.getElementById('enemy-card-2').style.color="crimson";
			document.getElementById('enemy-card-3').style.color="crimson";
		}
	}
}

function update()
{
	if(tutCont != true) updateIncrement();
	updateCosts(player);
	
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

function initializePrices(owner)
{
	document.getElementById("buy-farm-cost").innerHTML = "Lumber: " + owner.farmLumberCost + "<br>" + "Stone: " + owner.farmStoneCost + "<br>" + "Gold: " + owner.farmGoldCost;
	document.getElementById("buy-mill-cost").innerHTML = "Lumber: " + owner.LumberMillLumberCost + "<br>" + "Stone: " + owner.LumberMillStoneCost + "<br>" + "Gold: " + owner.LumberMillGoldCost;
	document.getElementById("buy-mine-cost").innerHTML = "Lumber: " + owner.MineLumberCost + "<br>" + "Stone: " + owner.MineStoneCost + "<br>" + "Gold: " + owner.MineGoldCost;
	document.getElementById("buy-quarry-cost").innerHTML = "Lumber: " + owner.QuarryLumberCost + "<br>" + "Stone: " + owner.QuarryStoneCost + "<br>" + "Gold: " + owner.QuarryGoldCost;
	document.getElementById("buy-yard-cost").innerHTML = "Lumber: " + owner.YardLumberCost + "<br>" + "Stone: " + owner.YardStoneCost + "<br>" + "Gold: " + owner.YardGoldCost;
	
	document.getElementById("upgrade-farm-cost").innerHTML = "Lumber: " + owner.farmLumberUpgrade + "<br>" + "Stone: " + owner.farmStoneUpgrade + "<br>" + "Gold: " + owner.farmGoldUpgrade;
	document.getElementById("upgrade-mill-cost").innerHTML = "Lumber: " + owner.LumberMillLumberUpgrade + "<br>" + "Stone: " + owner.LumberMillStoneUpgrade + "<br>" + "Gold: " + owner.LumberMillGoldUpgrade;
	document.getElementById("upgrade-mine-cost").innerHTML = "Lumber: " + owner.MineLumberUpgrade + "<br>" + "Stone: " + owner.MineStoneUpgrade + "<br>" + "Gold: " + owner.MineGoldUpgrade;
	document.getElementById("upgrade-quarry-cost").innerHTML = "Lumber: " + owner.QuarryLumberUpgrade + "<br>" + "Stone: " + owner.QuarryStoneUpgrade + "<br>" + "Gold: " + owner.QuarryGoldUpgrade;
}

function initialize()
{
	player = new resources(50, 50, 10, 3, 0, 5, 0, 0, 0, 1); // resources(lum, sto, gold, totFood, useFood, exp, knightExp, archerExp, mageExp, difMod)
	player.lumberIncrementer = 1;
	player.stoneIncrementer = 1;
	player.goldIncrementer = .5;
	opponent = new resources(50,50,10,3,0,5,0,0,0, .9); 
	neutral = new resources(50,50,10,3,0,5,0,0,0, .9);
	opponent.lumberIncrementer = 1;
	opponent.stoneIncrementer = 1;
	opponent.goldIncrementer = .5;
	update();
	initializePrices(player);
	updateMap();
	tutorial(1);
	//setUpStartingSpaces();
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
        enemyUnit.attacked(playerUnit);
		enemyUnit.updateString();
		var fightMessage = playerUnit.name + " just attacked! He did " + (playerUnit.attack - enemyUnit.defense) + " damage.";
		message(fightMessage, "palegreen");
		if(opponent.Group.selectedFighter == enemyUnit) document.getElementById('enemy-unit').innerHTML = enemyUnit.unitString;
	}
	if (enemyUnit.speed - y == enemyUnit.speed) 
	{
		playerUnit.attacked(enemyUnit);
	    playerUnit.updateString();
		var fightMessage = enemyUnit.name + " just attacked! He did " + (enemyUnit.attack - playerUnit.defense) + " damage.";
		message(fightMessage, "indianred");
		if(player.Group.selectedFighter == playerUnit) document.getElementById('player-unit').innerHTML = playerUnit.unitString;
	}
	playerUnit.updateString();
	enemyUnit.updateString();
	
	battleTimeCount++;
	
	if (playerUnit.health <= 0) 
	{
		message("Oh no! " + playerUnit.name + " was killed in battle!", "indianred");
		enemyUnit.currentExp += playerUnit.expEarned;
		enemyUnit.updateString();
		if(player.Group.battlingFighterGroup.length == 1)
		{
			player.Group.battlingFighterGroup.pop();
			player.Group.battlingFighterGroup = [];
			mapArray[playerUnit.currentCell].isPlayers = true;
		}
		if(player.Group.battlingFighterGroup.length == 2)
		{
			player.Group.battlingFighterGroup[0] =  player.Group.battlingFighterGroup[1];
			player.Group.battlingFighterGroup.pop();
			player.Group.selectedFighter = player.Group.selectedFighterGroup[0];
			
		}
		if(player.Group.battlingFighterGroup.length == 3)
		{
			player.Group.battlingFighterGroup[0] =  player.Group.battlingFighterGroup[1];
			player.Group.battlingFighterGroup[1] = player.Group.battlingFighterGroup[2];
			player.Group.battlingFighterGroup.pop();
			player.Group.selectedFighter = player.Group.selectedFighterGroup[0];
		}
		player.Group.selectedFighterGroup = mapArray[playerUnit.currentCell].unitGroup;
		mapArray[playerUnit.currentCell].updateCellString();
		
		document.getElementById('player-unit').innerHTML = "";
		battling = false;
		battleTimeCount = 0;
		selectSpace(selectedId);
		updateCards(playerUnit.currentCell);
		updateMap();
	}
	if (enemyUnit.health <= 0) 
	{
		message("Hoorah! " + enemyUnit.name + " was killed in battle!", "palegreen");
		playerUnit.currentExp += enemyUnit.expEarned;
		playerUnit.updateString();
		if(mapArray[enemyUnit.currentCell].unitGroup.length == 1)
		{
			mapArray[enemyUnit.currentCell].unitGroup.pop();
			mapArray[enemyUnit.currentCell].unitGroup = [];
			mapArray[enemyUnit.currentCell].isPlayers = true;
		}
		if(mapArray[enemyUnit.currentCell].unitGroup.length == 2)
		{
			mapArray[enemyUnit.currentCell].unitGroup[0] =  mapArray[enemyUnit.currentCell].unitGroup[1];
			mapArray[enemyUnit.currentCell].unitGroup.pop();
			enemyFighter = opponent.Group.selectedFighterGroup[0];
		}
		if(mapArray[enemyUnit.currentCell].unitGroup.length == 3)
		{
			mapArray[enemyUnit.currentCell].unitGroup[0] =  mapArray[enemyUnit.currentCell].unitGroup[1];
			mapArray[enemyUnit.currentCell].unitGroup[1] = mapArray[enemyUnit.currentCell].unitGroup[2];
			mapArray[enemyUnit.currentCell].unitGroup.pop();
			enemyFighter = opponent.Group.selectedFighterGroup[0];
		}
		
		opponent.Group.selectedFighterGroup = mapArray[enemyUnit.currentCell].unitGroup;
		mapArray[enemyUnit.currentCell].updateCellString();
		document.getElementById('enemy-unit').innerHTML = "";
		battling = false
		battleTimeCount = 0;
		selectSpace(selectedId);
		updateCards(enemyUnit.currentCell);
		updateMap();
	}
}

function updateBattles()
{
	
	if(battling == true)
	{
	    battle(player.Group.battlingFighter, opponent.Group.battlingFighter);
	}
}

function startBattle()
{
	if(player.Group.selectedFighter != undefined && opponent.Group.selectedFighter != undefined)
	{
	    if ((player.Group.selectedFighter.currentCell == opponent.Group.selectedFighter.currentCell - 1) || (player.Group.selectedFighter.currentCell == opponent.Group.selectedFighter.currentCell - 10) || (player.Group.selectedFighter.currentCell == opponent.Group.selectedFighter.currentCell + 1) || (player.Group.selectedFighter.currentCell == opponent.Group.selectedFighter.currentCell + 10))
	    {
		    battling = true;
			moving = false;
			player.Group.battlingFighter = player.Group.selectedFighter;
			player.Group.battlingFighterGroup = player.Group.selectedFighterGroup;
			opponent.Group.battlingFighter = opponent.Group.selectedFighter;
			opponent.Group.battlingFighterGroup = opponent.Group.selectedFighterGroup;
			
			console.log(player.Group.selectedFighterGroup);
	    }
		else alert("Enemy is too far away");
	}
	else alert("No units to fight");
}

function moveUnit(newSpace)
{
	var start = player.Group.selectedFighter.currentCell;
	if (start > newSpace)
	{
		if (Math.floor(start / 10) - Math.floor(newSpace / 10) > 0)
		{
			mapArray[start].unitGroup.pop();
			mapArray[start].updateCellString();
			start -= 10;
			mapArray[start].unitGroup.push(player.Group.selectedFighter);
			player.Group.selectedFighter.currentCell = start;
			mapArray[start].updateCellString();
		}
		else if (start - newSpace > 0)
		{
			mapArray[start].unitGroup.pop();
			mapArray[start].updateCellString();
			start -= 1;
			mapArray[start].unitGroup.push(player.Group.selectedFighter);
			player.Group.selectedFighter.currentCell = start;
			mapArray[start].updateCellString();
		}
	}
	else if (start < newSpace)
	{
		if (Math.floor(newSpace / 10) - Math.floor(start / 10) > 0)
		{
			mapArray[start].unitGroup.pop();
			mapArray[start].updateCellString();
			start = Number(start) + 10;
			console.log(start);
			mapArray[start].unitGroup.push(player.Group.selectedFighter);
			player.Group.selectedFighter.currentCell = start;
			mapArray[start].updateCellString();
		}
		else if (newSpace - start > 0)
		{
			mapArray[start].unitGroup.pop();
			mapArray[start].updateCellString();
			start = Number(start) + 1;
			mapArray[start].unitGroup.push(player.Group.selectedFighter);
			player.Group.selectedFighter.currentCell = start;
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
	if (player.Group.selectedFighter != undefined)
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
	mapArray[0].start("farm", true, player);
	mapArray[1].start("mill", true, player);
	mapArray[10].start("quarry", true, player);
	mapArray[11].start("mine", true, player);
	
	mapArray[99].start("farm", false, opponent);
	mapArray[98].start("mill", false, opponent);
	mapArray[89].start("quarry", false, opponent);
	mapArray[88].start("mine", false, opponent);
	
	
	mapArray[2].unitGroup.push(new unit(true, 2, neutral));
	mapArray[2].unitGroup[0].name = "Bandit";
	mapArray[2].unitGroup[0].type ="recruit";
	mapArray[2].unitGroup[0].updateNumbers("recruit");
	mapArray[2].unitGroup[0].modify();
	mapArray[2].unitGroup[0].updateString();
	mapArray[2].isPlayers = false;
	
	mapArray[12].unitGroup.push(new unit(true, 12, neutral));
	mapArray[12].unitGroup[0].name = "Bandit";
	mapArray[12].unitGroup[0].type ="recruit";
	mapArray[12].unitGroup[0].updateNumbers("recruit");
	mapArray[12].unitGroup[0].modify();
	mapArray[12].unitGroup[0].updateString();
	mapArray[12].isPlayers = false;
	
	mapArray[21].unitGroup.push(new unit(true, 21, neutral));
	mapArray[21].unitGroup[0].name = "Bandit";
	mapArray[21].unitGroup[0].type ="recruit";
	mapArray[21].unitGroup[0].updateNumbers("recruit");
	mapArray[21].unitGroup[0].modify();
	mapArray[21].unitGroup[0].updateString();
	mapArray[21].isPlayers = false;
	mapArray[21].unitGroup.push(new unit(true, 21, neutral));
	mapArray[21].unitGroup[1].name = "Wizard";
	mapArray[21].unitGroup[1].type ="recruit";
	mapArray[21].unitGroup[1].updateNumbers("recruit");
	mapArray[21].unitGroup[1].modify();
	mapArray[21].unitGroup[1].updateString();
	
	
}

function message(messageString, color)
{
	var elem = document.getElementById('output-bank');
	elem.innerHTML += "<span style='background-color: " + color + "'>" + messageString + "</span><br>";
	elem.scrollTop = elem.scrollHeight;
}

function tutorial(tutNum)
{
	mapArray[selectedSpace].isPlayers = true;
	updateMap();
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
	if(tutNum == 5) tutorialMessage("Capture the board before your enemy does to Win!", "game-table-holder"       , "buy-unit-block", tutNum);
	if(tutNum == 6) tutorialMessage("Good Luck!"                                      , ""                 , "game-table-holder", tutNum);	
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
		document.getElementById('tutorial-block').style.top="26vh";
		document.getElementById('tutorial-block').style.left="60vw";
	}
	if(tutNum == 3)
	{
		document.getElementById('tutorial-block').style.top="14vh";
		document.getElementById('tutorial-block').style.left="35vw";
	}
	if(tutNum == 4)
	{
		document.getElementById('tutorial-block').style.top="39vh";
		document.getElementById('tutorial-block').style.left="61vw";
	}
	if(tutNum == 5)
	{
		document.getElementById('tutorial-block').style.top="14vh";
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
		mapArray[selectedSpace],isPlayers = false;
		tutCont = false;
		setUpStartingSpaces();
		updateMap();
		beginGame();
	}
	
	tutNum = Number(tutNum) + 1;
	var clickString = "javascript: tutorial(" + tutNum + ")";
	document.getElementById("tutorial-button").setAttribute("onclick", clickString);
}

function switchCard(unitNum, owner)
{
	if(owner == player)
	{
		if(owner.Group.selectedFighterGroup.length > unitNum)
		{
			document.getElementById('player-unit').innerHTML = player.Group.selectedFighterGroup[unitNum].unitString;
			if(unitNum == 0)
			{
				document.getElementById('player-card-1').style.borderBottom="0px";
				document.getElementById('player-card-1').style.paddingBottom="1px";
				document.getElementById('player-card-2').style.borderBottom="1px solid white";
				document.getElementById('player-card-2').style.paddingBottom="0px";
				document.getElementById('player-card-3').style.borderBottom="1px solid white";
				document.getElementById('player-card-3').style.paddingBottom="0px";
				
				document.getElementById('player-card-1').style.width="calc(60% - 2px)";
				document.getElementById('player-card-2').style.width="calc(20% - 2px)";
				document.getElementById('player-card-3').style.width="calc(19% - 2px)";
			}
			else if(unitNum == 1)
			{
				document.getElementById('player-card-2').style.borderBottom="0px";
				document.getElementById('player-card-2').style.paddingBottom="1px";
				document.getElementById('player-card-1').style.borderBottom="1px solid white";
				document.getElementById('player-card-1').style.paddingBottom="0px";
				document.getElementById('player-card-3').style.borderBottom="1px solid white";
				document.getElementById('player-card-3').style.paddingBottom="0px";
				
				document.getElementById('player-card-1').style.width="calc(20% - 2px)";
				document.getElementById('player-card-2').style.width="calc(60% - 2px)";
				document.getElementById('player-card-3').style.width="calc(19% - 2px)";
			}
			else if (unitNum == 2)
			{	
				document.getElementById('player-card-3').style.borderBottom="0px";
				document.getElementById('player-card-3').style.paddingBottom="1px";
				document.getElementById('player-card-1').style.borderBottom=" solid white1px";
				document.getElementById('player-card-1').style.paddingBottom="0px";
				document.getElementById('player-card-2').style.borderBottom="1px solid white";
				document.getElementById('player-card-2').style.paddingBottom="0px";
		
				document.getElementById('player-card-1').style.width="calc(19% - 2px)";
				document.getElementById('player-card-2').style.width="calc(20% - 2px)";
				document.getElementById('player-card-3').style.width="calc(60% - 2px)";
			}
		}
	}
	else if(owner == opponent)
	{
		if(opponent.Group.selectedFighterGroup.length > unitNum)
		{
			document.getElementById('enemy-unit').innerHTML = opponent.Group.selectedFighterGroup[unitNum].unitString;
			if(unitNum == 0)
			{
				document.getElementById('enemy-card-1').style.borderBottom="0px";
				document.getElementById('enemy-card-1').style.paddingBottom="1px";
				document.getElementById('enemy-card-2').style.borderBottom="1px solid white";
				document.getElementById('enemy-card-2').style.paddingBottom="0px";
				document.getElementById('enemy-card-3').style.borderBottom="1px solid white";
				document.getElementById('enemy-card-3').style.paddingBottom="0px";
				
				document.getElementById('enemy-card-1').style.width="calc(60% - 2px)";
				document.getElementById('enemy-card-2').style.width="calc(20% - 2px)";
				document.getElementById('enemy-card-3').style.width="calc(19% - 2px)";
			}
			else if(unitNum == 1)
			{
				document.getElementById('enemy-card-2').style.borderBottom="0px";
				document.getElementById('enemy-card-2').style.paddingBottom="1px";
				document.getElementById('enemy-card-1').style.borderBottom="1px solid white";
				document.getElementById('enemy-card-1').style.paddingBottom="0px";
				document.getElementById('enemy-card-3').style.borderBottom="1px solid white";
				document.getElementById('enemy-card-3').style.paddingBottom="0px";
				
				document.getElementById('enemy-card-1').style.width="calc(20% - 2px)";
				document.getElementById('enemy-card-2').style.width="calc(60% - 2px)";
				document.getElementById('enemy-card-3').style.width="calc(19% - 2px)";
			}
			else if (unitNum == 2)
			{	
				document.getElementById('enemy-card-3').style.borderBottom="0px";
				document.getElementById('enemy-card-3').style.paddingBottom="1px";
				document.getElementById('enemy-card-1').style.borderBottom=" solid white1px";
				document.getElementById('enemy-card-1').style.paddingBottom="0px";
				document.getElementById('enemy-card-2').style.borderBottom="1px solid white";
				document.getElementById('enemy-card-2').style.paddingBottom="0px";
		
				document.getElementById('enemy-card-1').style.width="calc(19% - 2px)";
				document.getElementById('enemy-card-2').style.width="calc(20% - 2px)";
				document.getElementById('enemy-card-3').style.width="calc(60% - 2px)";
			}
		}
	}
}

