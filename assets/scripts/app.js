const ATTACK_VALUE = 10;      //hardcoded global variable 

let chosenMaxLife = 100;   //later it will be user input
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function attackHandler () {
    const damage = dealMonsterDamage(ATTACK_VALUE);
    currentMonsterHealth -= damage;
}

attackBtn.addEventListener('click', attackHandler);