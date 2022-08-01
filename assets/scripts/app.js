const ATTACK_VALUE = 10; //hardcoded global variable
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK"; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; //MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

// const enteredValue = parseInt(prompt("Maximum life for you and the monster.", "100"));
//const enteredValue = prompt("Maximum life for you and the monster.", "100");
//or use parseInt with variable

let battleLog = [];
let lastLoggedEntry;   //for loop controling

function getMaxLifeValues() {
    const enteredValue = prompt("Maximum life for you and the monster.", "100");
    
    const parsedValue = parseInt(enteredValue); //later it will be user input  [can be written as: +enteredValue]
    //check if the user entered a number (not NaN, not zero and not negative)
    if (isNaN(parsedValue) || parsedValue <= 0) {
      throw { message: 'Invalid user input, not a number!' };
    }
    return parsedValue;
  }

let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValues(); //if will be NaN or <=0, then catch
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert('You enetered something wrong, default value of 100 was used.');//optional
} 

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logentry = {
    //object logentry
    //can be done in this way
    event: ev, //just change logentry.target in each block
    value: val, //leave in this view for readability
    finalMonsterHEALTH: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logentry.target = "MONSTER";
      break; //if this case has been handled, no other shouldn't
    //otherwise other case would be executed as well
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logentry = {
        event: ev,
        value: val,
        target: "MONSTER",
        finalMonsterHEALTH: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logentry = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalMonsterHEALTH: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logentry = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalMonsterHEALTH: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logentry = {
        event: ev,
        value: val,
        finalMonsterHEALTH: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
      default:
      logentry = {};
  }
  // if (ev === LOG_EVENT_PLAYER_ATTACK) {
  //   logentry.target = "MONSTER";
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logentry = {
  //     event: ev,
  //     value: val,
  //     target: "MONSTER",
  //     finalMonsterHEALTH: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logentry = {
  //     event: ev,
  //     value: val,
  //     target: "PLAYER",
  //     finalMonsterHEALTH: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
  //   logentry = {
  //     event: ev,
  //     value: val,
  //     target: "PLAYER",
  //     finalMonsterHEALTH: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (ev === LOG_EVENT_GAME_OVER) {
  //   logentry = {
  //     event: ev,
  //     value: val,
  //     finalMonsterHEALTH: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // }
  battleLog.push(logentry); //instead of write it in each block
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    //when the monster hit us
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    //hasBonusLife, it'll check does it true?
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert("You would be dead, but the bonus life saved you!");
    setPlayerHealth(initialPlayerHealth); //update the player health bar
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER_WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost...");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER_WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("It's a draw.");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  //if mode === MODE_ATTACK then ATTACK_VALUE else STRONG_ATTACK_VALUE
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  //let maxDamage;
  //let logEvent;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage; //also write a log, after we reduce the monster's health
  writeToLog(
    //which event write to log, based on the mode we have here
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more then your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += HEAL_VALUE;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  for (let i = 0; i < 3; i++) {
    console.log('-----------');
  }
  let j = 3;
  do {
    console.log(j);
    j++;
  } while (j < 3);
  // for (i = 5; i > 0;) {
  // i--;
  // console.log(i);
  // }
  //for (i = 0; i < battleLog.length; i++) {  //battleLog.length - array length
  //console.log(battleLog[i]); //battleLog[i] - took an element with number 'i'
  //-----------
  //let i = 0;
  //this loop uses for arrays
  //for (const logEntry of battleLog) { //'logEntry' instead of 'i' (can be any)
    //we go though the all elements of the aray battlelog and output it
    //logEntry is an object
  //  console.log(logEntry);
  //  console.log(i);
  //  i++;
  let i = 0;
    for (const logEntry of battleLog) {
      if ((!lastLoggedEntry && lastLoggedEntry !==0) || lastLoggedEntry < i) {
        console.log(`#${i}`);
        for (const key in logEntry) {   //logEntry is an object
          // console.log(key);
          // console.log(logEntry[key]);
          console.log(`${key} => ${logEntry[key]}`);
        }
        lastLoggedEntry = i;
        break;
      }
    i++;
    }
  }
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
