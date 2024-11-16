document.addEventListener('DOMContentLoaded', () => {
    const pessoa = document.querySelector('.pessoa');
    const quadrado = document.querySelector('.quadrado');
    const timerElement = document.getElementById('timer');
    const jumpCountElement = document.getElementById('jumpCount');
    const levelElement = document.getElementById('level');
    const levelUpMessage = document.getElementById('levelUpMessage');

    let isJumping = false;
    let isDead = false;
    let timer = 0;
    let jumpCount = 0;
    let level = 1;
    let timerInterval = null;
    let gameSpeed = 3.0;  // Comece com uma velocidade um pouco mais lenta para o quadrado

    // Função de pulo
    const jump = () => {
        if (isJumping || isDead) return;
        isJumping = true;
        jumpCount++;
        jumpCountElement.textContent = `Pulos: ${jumpCount}`;
        pessoa.classList.add('jump');  // Inicia o pulo

        setTimeout(() => {
            pessoa.classList.remove('jump');
            isJumping = false;
        }, 700);  // A duração do pulo pode ser ajustada

        if (jumpCount % 10 === 0) {
            increaseDifficulty();
        }
    };

    const increaseDifficulty = () => {
        level++;
        gameSpeed *= 0.95;  // Diminui um pouco a velocidade do quadrado para equilibrar
        quadrado.style.animationDuration = `${gameSpeed}s`;
        levelElement.textContent = `Nível: ${level}`;
        showLevelUpMessage();
    };

    const showLevelUpMessage = () => {
        levelUpMessage.textContent = "Level Up!";
        levelUpMessage.style.display = 'block';

        setTimeout(() => {
            levelUpMessage.style.display = 'none';
        }, 2000);
    };

    const startTimer = () => {
        timerInterval = setInterval(() => {
            timer++;
            timerElement.textContent = `Tempo: ${timer}s`;
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
    };

    const resetGame = () => {
        clearInterval(timerInterval);
        timer = 0;
        jumpCount = 0;
        level = 1;
        jumpCountElement.textContent = `Pulos: 0`;
        levelElement.textContent = `Nível: 1`;
        gameSpeed = 3.0;  // Redefine a velocidade para um valor inicial mais lento
        quadrado.style.animationDuration = `${gameSpeed}s`;
    };

    const restorePerson = () => {
        pessoa.src = 'pessoa.gif';
        pessoa.style.width = '100px';
        pessoa.style.bottom = '0px';
        pessoa.style.animation = '';
    };

    // Loop de verificação de colisão
    const loop = setInterval(() => {
        if (isJumping || isDead) return;

        const quadradoPosition = quadrado.offsetLeft;
        const pessoaPosition = +window.getComputedStyle(pessoa).bottom.replace('px', '');

        // Verifica se o quadrado colide com o personagem no chão
        if (quadradoPosition < 10 && quadradoPosition > 0 && pessoaPosition <= 80) {
            const quadradoWidth = quadrado.offsetWidth;
            const pessoaWidth = pessoa.offsetWidth;
            const distancia = quadradoPosition + quadradoWidth > 120;

            // Colisão
            if (distancia && pessoaPosition <= 80) {
                isDead = true;
                quadrado.style.animation = 'none';
                quadrado.style.left = `${quadradoPosition}px`;

                pessoa.style.animation = 'none';
                pessoa.style.bottom = `${pessoaPosition}px`;

                pessoa.src = 'tumulo.gif';
                pessoa.style.width = '120px';

                clearInterval(loop);
                stopTimer();

                alert(`Fim de Jogo! Seu tempo foi: ${timer}s e você pulou ${jumpCount} vezes no nível ${level}`);
            }
        }
    }, 10);

    // Ajuste do evento de toque para permitir um tempo de resposta maior
    document.addEventListener('keydown', jump);
    document.addEventListener('touchend', (e) => {
        e.preventDefault();  // Evita comportamento padrão
        jump();  // Chama a função de pulo
    });

    const startGame = () => {
        if (isDead) return;

        resetGame();
        restorePerson();
        startTimer();
        quadrado.style.animation = `game ${gameSpeed}s infinite linear`;  // Reinicia a animação do quadrado
    };

    startGame();
});
