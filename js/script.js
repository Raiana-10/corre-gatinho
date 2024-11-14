document.addEventListener('DOMContentLoaded', () => {
    const pessoa = document.querySelector('.pessoa');
    const quadrado = document.querySelector('.quadrado');
    const timerElement = document.getElementById('timer');  // Referência para o cronômetro
    const jumpCountElement = document.getElementById('jumpCount');  // Elemento para mostrar a contagem de pulos
    const levelElement = document.getElementById('level');  // Elemento para mostrar o nível do jogo
    const levelUpMessage = document.getElementById('levelUpMessage');  // Elemento para a mensagem "Level Up!"

    let isJumping = false;  // Variável para verificar se o boneco está pulando
    let isDead = false;  // Variável para verificar se o boneco morreu
    let timer = 0;  // Variável para o tempo
    let jumpCount = 0;  // Variável para contar os pulos
    let level = 1;  // Nível do jogo
    let timerInterval = null;  // Armazena o ID do intervalo
    let gameSpeed = 2.0;  // Velocidade inicial ajustada (um pouco mais rápida)

    // Função para iniciar o pulo
    const jump = () => {
        if (isJumping || isDead) return; // Não permite pular se o boneco já está no ar ou morto
        isJumping = true;  // Marca que o boneco está pulando

        jumpCount++;  // Incrementa a contagem de pulos
        jumpCountElement.textContent = `Pulos: ${jumpCount}`;  // Atualiza a exibição da contagem de pulos

        pessoa.classList.add('jump');  // Inicia a animação de pulo

        // Depois que o pulo terminar, o boneco volta ao chão
        setTimeout(() => {
            pessoa.classList.remove('jump');
            isJumping = false;  // Marca que o boneco não está mais pulando
        }, 700);  // O tempo do pulo (700ms)

        // Aumenta a dificuldade a cada 10 pulos
        if (jumpCount % 10 === 0) {
            increaseDifficulty();
        }
    };

    // Função para aumentar a dificuldade do jogo
    const increaseDifficulty = () => {
        level++;  // Aumenta o nível
        gameSpeed *= 0.95;  // Aumenta a velocidade do quadrado (diminui o tempo da animação)

        // Aplica a nova velocidade ao quadrado
        quadrado.style.animationDuration = `${gameSpeed}s`;

        // Atualiza o nível do jogo na interface
        levelElement.textContent = `Nível: ${level}`;

        // Exibe a mensagem "Level Up!"
        showLevelUpMessage();

        console.log(`Nível ${level} alcançado! Velocidade do quadrado: ${gameSpeed.toFixed(2)}s`);
    };

    // Função para mostrar a mensagem "Level Up!"
    const showLevelUpMessage = () => {
        levelUpMessage.textContent = "Level Up!";  // Define o texto da mensagem
        levelUpMessage.style.display = 'block';  // Torna a mensagem visível

        // Esconde a mensagem após 2 segundos
        setTimeout(() => {
            levelUpMessage.style.display = 'none';  // Torna a mensagem invisível novamente
        }, 2000);
    };

    // Função para iniciar o cronômetro
    const startTimer = () => {
        timerInterval = setInterval(() => {
            timer++;  // Incrementa o tempo a cada segundo
            timerElement.textContent = `Tempo: ${timer}s`;  // Atualiza a exibição do cronômetro
        }, 1000);  // 1 segundo
    };

    // Função para parar o cronômetro
    const stopTimer = () => {
        clearInterval(timerInterval);  // Para o cronômetro
    };

    // Função para reiniciar o cronômetro e a contagem de pulos
    const resetGame = () => {
        clearInterval(timerInterval);  // Limpa o intervalo
        timer = 0;  // Reseta o tempo para 0
        jumpCount = 0;  // Reseta a contagem de pulos para 0
        level = 1;  // Reseta o nível para 1
        jumpCountElement.textContent = `Pulos: 0`;  // Reseta o display de contagem de pulos
        levelElement.textContent = `Nível: 1`;  // Reseta o display do nível
        gameSpeed = 2.0;  // Reseta a velocidade do quadrado para o valor ajustado
        quadrado.style.animationDuration = `${gameSpeed}s`;  // Aplica a velocidade inicial ao quadrado
    };

    // Função para restaurar o personagem ao estado inicial
    const restorePerson = () => {
        pessoa.src = 'pessoa.gif';  // Restaura a imagem original do personagem
        pessoa.style.width = '100px';  // Ajusta o tamanho do personagem (se necessário)
        pessoa.style.bottom = '0px';  // Coloca o personagem de volta no chão
        pessoa.style.animation = '';  // Remove qualquer animação anterior
    };

    // Loop para verificar colisões enquanto o quadrado se move
    const loop = setInterval(() => {
        if (isJumping || isDead) return;  // Não verifica colisão enquanto o boneco está pulando ou morto

        const quadradoPosition = quadrado.offsetLeft;
        const pessoaPosition = +window.getComputedStyle(pessoa).bottom.replace('px', '');

        // Verifica se o quadrado está na posição de colisão e o boneco está no chão
        if (quadradoPosition < 120 && quadradoPosition > 0 && pessoaPosition <= 80) {
            // Adiciona uma verificação extra para garantir que a colisão é registrada corretamente
            const quadradoWidth = quadrado.offsetWidth;
            const pessoaWidth = pessoa.offsetWidth;
            const distancia = quadradoPosition + quadradoWidth > 120;

            if (distancia && pessoaPosition <= 80) {
                isDead = true;  // Marca que o boneco morreu
                quadrado.style.animation = 'none';
                quadrado.style.left = `${quadradoPosition}px`;  // Mantém a posição atual do quadrado

                pessoa.style.animation = 'none';
                pessoa.style.bottom = `${pessoaPosition}px`;  // Mantém a posição atual do boneco

                pessoa.src = 'tumulo.gif';  // Muda o sprite do boneco para o túmulo (morte)
                pessoa.style.width = '120px';  // Ajusta o tamanho do boneco

                clearInterval(loop);  // Para o loop de colisão
                stopTimer();  // Para o cronômetro

                alert(`Fim de Jogo! Seu tempo foi: ${timer}s e você pulou ${jumpCount} vezes no nível ${level}`);  // Exibe o tempo final, a quantidade de pulos e o nível
            }
        }
    }, 10);

    // Adiciona os eventos de teclado e toque para iniciar o pulo
    document.addEventListener('keydown', jump);
    document.addEventListener('touchstart', (e) => {
        e.preventDefault();  // Previne o comportamento padrão do toque
        jump();
    });

    // Iniciar o jogo
    const startGame = () => {
        if (isDead) return;  // Não inicia o jogo novamente se o personagem morreu

        resetGame();  // Reseta o cronômetro e a contagem de pulos antes de iniciar o jogo
        restorePerson();  // Restaura a imagem e o estado do personagem
        startTimer();  // Inicia o cronômetro

        // Reinicia o quadrado e a pessoa para o início do jogo
        quadrado.style.animation = `game ${gameSpeed}s infinite linear`;  // Reinicia a animação do quadrado
    };

    // Iniciar o jogo
    startGame();
});
