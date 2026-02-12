// =========================================
//  ADMIN CONSOLE (Easter Egg)
// =========================================

function initConsole() {
    // --- VIRTUAL FILE SYSTEM ---
    const vfs = {
        '/': {
            type: 'dir',
            children: {
                'home': {
                    type: 'dir',
                    children: {
                        'brieuc': {
                            type: 'dir',
                            children: {
                                'cv.pdf': { type: 'file', content: '[BINARY DATA] Use "cv" command to download.' },
                                'todo.txt': { type: 'file', content: '- Finish Portfolio\n- Learn Kubernetes\n- Sleep (optional)' },
                                'projects': {
                                    type: 'dir',
                                    children: {
                                        'portfolio': { type: 'dir', children: {} },
                                        'homelab.md': { type: 'file', content: '# My Homelab\nRaspberry Pi 4 (Pi-hole, VPN)\nNAS Synology (Plex)' }
                                    }
                                },
                                'secrets': {
                                    type: 'dir',
                                    children: {
                                        'password.txt': { type: 'file', content: 'admin:admin (Do not share!)' },
                                        'classified.txt': { type: 'file', content: '--- TOP SECRET COMMANDS ---\n\nmake me a sandwich   -> Try with sudo\nmatrix               -> Wake up Neo\nhack                 -> NSA simulation\nmusic                -> Lo-Fi Vibes\ncoffee               -> Caffeine boost\n\n[END OF FILE]' }
                                    }
                                }
                            }
                        },
                        'guest': { type: 'dir', children: {} }
                    }
                },
                'var': { type: 'dir', children: { 'www': { type: 'dir', children: {} } } },
                'etc': { type: 'dir', children: { 'hosts': { type: 'file', content: '127.0.0.1 localhost' } } },
                'bin': { type: 'dir', children: {} }
            }
        }
    };

    let currentPath = ['/', 'home', 'brieuc'];
    let commandHistory = [];
    let historyIndex = -1;
    let currentUser = 'admin';
    let isGameRunning = false;

    // Helper: Get node from path
    const resolvePath = (pathArr) => {
        let current = vfs['/'];
        if (pathArr.length === 1 && pathArr[0] === '/') return current;

        // Start from 1 because 0 is root
        for (let i = 1; i < pathArr.length; i++) {
            if (current.children && current.children[pathArr[i]]) {
                current = current.children[pathArr[i]];
            } else {
                return null;
            }
        }
        return current;
    };

    // Helper: Format Path string
    const getPathString = () => {
        if (currentPath.length === 1) return '/';
        return '/' + currentPath.slice(1).join('/');
    };

    // 1. Inject HTML
    const consoleHTML = `
    <div id="consoleTrigger" class="console-trigger" title="Open Admin Console">>_</div>
    <div id="consoleOverlay" class="console-overlay">
      <div class="console-window">
        <div class="console-header">
          <span>admin@brieuc-portfolio:~</span>
          <button id="closeConsole" style="background:none;border:none;color:#888;cursor:pointer;">[x]</button>
        </div>
        <div class="console-body" id="consoleBody">
          <div class="console-output">
            <div>Welcome to BrieucOS v1.0.0 LTS</div>
            <div>Type <span class="info">'help'</span> to see available commands.</div>
            <br>
          </div>
          <div class="console-input-line">
            <span class="console-prompt" id="promptPath">admin@brieuc:~/home/brieuc$</span>
            <input type="text" id="consoleInput" class="console-input" autocomplete="off" spellcheck="false">
          </div>
        </div>
      </div>
    </div>
  `;
    document.body.insertAdjacentHTML('beforeend', consoleHTML);

    // 2. DOM Elements
    const trigger = document.getElementById('consoleTrigger');
    const overlay = document.getElementById('consoleOverlay');
    const closeBtn = document.getElementById('closeConsole');
    const input = document.getElementById('consoleInput');
    const output = document.querySelector('.console-output');
    const body = document.getElementById('consoleBody');
    const promptSpan = document.getElementById('promptPath');
    const prompt = document.querySelector('.console-input-line');

    // Update Prompt
    const updatePrompt = () => {
        let displayPath = getPathString();
        if (displayPath.startsWith('/home/brieuc')) {
            displayPath = displayPath.replace('/home/brieuc', '~');
        }
        promptSpan.textContent = `admin@brieuc:${displayPath}$`;
    };
    updatePrompt();

    // 3. Functions
    const print = (text, type = '') => {
        const div = document.createElement('div');
        if (type) div.className = type;
        div.innerHTML = text;
        output.appendChild(div);
        body.scrollTop = body.scrollHeight;
    };

    const triggerBSOD = () => {
        print('WARNING: DESTRUCTIVE COMMAND DETECTED.', 'error');
        setTimeout(() => print('Deleting /var/www/html...', 'error'), 500);
        setTimeout(() => print('Deleting /home/brieuc...', 'error'), 1000);
        setTimeout(() => print('Deleting /etc/hosts...', 'error'), 1500);
        setTimeout(() => print('KERNEL PANIC: INIT KILLED.', 'error'), 2000);
        setTimeout(() => {
            document.body.innerHTML = '<div style="background:#0078D7;color:white;height:100vh;display:flex;align-items:center;justify-content:center;font-family:Segoe UI, sans-serif;font-size:2rem;flex-direction:column;text-align:center;">' +
                '<div style="font-size:8rem;margin-bottom:20px;">:(</div>' +
                '<div style="font-size:1.5rem;max-width:800px;">Your PC ran into a problem and needs to restart. We\'re just collecting some error info, and then we\'ll restart for you.</div>' +
                '<div style="font-size:1rem;margin-top:40px;">0% complete</div>' +
                '</div>';
        }, 3000);
        setTimeout(() => location.reload(), 7000);
    };

    // Helper: Matrix Rain
    let matrixInterval;
    const initMatrix = () => {
        // Remove existing if any
        const old = document.querySelector('.matrix-canvas');
        if (old) old.remove();

        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-canvas';
        canvas.width = document.getElementById('consoleBody').offsetWidth;
        canvas.height = document.getElementById('consoleBody').offsetHeight;
        document.getElementById('consoleBody').prepend(canvas);

        const ctx = canvas.getContext('2d');
        const cols = Math.floor(canvas.width / 20);
        const ypos = Array(cols).fill(0);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (matrixInterval) clearInterval(matrixInterval);
        matrixInterval = setInterval(() => {
            ctx.fillStyle = '#0001';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0f0';
            ctx.font = '15pt monospace';

            ypos.forEach((y, i) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = i * 20;
                ctx.fillText(text, x, y);
                if (y > 100 + Math.random() * 10000) ypos[i] = 0;
                else ypos[i] = y + 20;
            });
        }, 50);
    };

    const virtualFiles = {
        'about.txt': 'Portfolio initialized. User: Brieuc. Role: Developer.',
        'projects.md': '# My Projects\n1. Portfolio (You are here)\n2. E-commerce Platform\n3. AI Chatbot',
        'contact.json': '{\n  "email": "contact@brieuc.fr",\n  "linkedin": "linkedin.com/in/brieuc"\n}',
        'secrets.log': 'ACCESS DENIED. Encrypted.',
        'skills.yml': '- React\n- Node.js\n- TypeScript\n- Python'
    };

    // Phase 7 State
    const startTime = Date.now();
    let aliases = {};

    // --- DATA ---
    const helpMap = {
        '--- 📂 FILESYSTEM ---': [
            ['cat <file>', 'Lire un fichier'],
            ['cd <dir>', 'Changer répertoire'],
            ['ls', 'Lister fichiers'],
            ['mkdir', 'Créer répertoire'],
            ['pwd', 'Répertoire courant'],
            ['rm', 'Supprimer fichier']
        ],
        '--- 👤 PORTFOLIO ---': [
            ['contact', 'Formulaire contact'],
            ['credits', 'Crédits du site'],
            ['cv', 'Télécharger CV'],
            ['email', 'Adresse email'],
            ['projects', 'Voir projets'],
            ['social', 'Réseaux sociaux'],
            ['whoami', 'Qui suis-je']
        ],
        '--- 🛠️ OUTILS ---': [
            ['alias <k>=<v>', 'Définir alias'],
            ['echo <txt>', 'Afficher texte'],
            ['help', 'Liste commandes'],
            ['history', 'Historique'],
            ['man <cmd>', 'Manuel'],
            ['password <len>', 'Générer mdp']
        ],
        '--- 🖥️ SYSTÈME ---': [
            ['clear', 'Effacer écran'],
            ['date', 'Date actuelle'],
            ['df', 'Espace disque'],
            ['exit', 'Fermer console'],
            ['free', 'Mémoire dispo'],
            ['hostname', 'Nom machine'],
            ['htop', 'Moniteur CPU/RAM'],
            ['neofetch', 'Info système'],
            ['reboot', 'Redémarrer'],
            ['shutdown', 'Arrêter'],
            ['stats', 'Stats session'],
            ['sudo su', 'Accès root'],
            ['sysinfo', 'Infos navigateur'],
            ['theme', 'Thème couleur'],
            ['top', 'Processus actifs'],
            ['uname', 'Info OS'],
            ['uptime', 'Durée session']
        ],
        '--- 🌐 RÉSEAU ---': [
            ['curl <url>', 'Requête HTTP'],
            ['ifconfig', 'Config réseau'],
            ['ipconfig', 'Config IP (Win)'],
            ['nmap <host>', 'Scan de ports'],
            ['nslookup <dom>', 'Résolution DNS'],
            ['ping <host>', 'Test latence'],
            ['ssh <host>', 'Connexion SSH'],
            ['traceroute <h>', 'Tracer route'],
            ['whois <dom>', 'Info domaine']
        ],
        '--- 🔐 SÉCURITÉ ---': [
            ['encrypt <txt>', 'Chiffrement César'],
            ['firewall', 'Règles iptables'],
            ['hashme <txt>', 'Hash SHA-256']
        ],
        '--- 🎮 JEUX ---': [
            ['invaders', 'Space Invaders'],
            ['minesweeper', 'Démineur'],
            ['pong', 'Pong vs IA'],
            ['snake', 'Snake'],
            ['tetris', 'Tetris'],
            ['tictactoe', 'Morpion vs IA'],
            ['twofortyeight', '2048'],
            ['wordle', 'Wordle']
        ],
        '--- 🥚 EASTER EGGS ---': [
            ['banner', 'Logo ASCII'],
            ['gui', 'Interface graphique'],
            ['hack', 'Simuler piratage'],
            ['make', 'Compiler...'],
            ['matrix', 'Pluie Matrix'],
            ['vim', 'Éditeur texte']
        ]
    };

    const manuals = {
        'alias': 'Définir ou afficher les alias. Usage: alias <nom>=<cmd>',
        'banner': 'Afficher le logo ASCII du portfolio.',
        'cat': 'Afficher le contenu d\'un fichier. Usage: cat <fichier>',
        'cd': 'Changer de répertoire. Usage: cd <dir>',
        'clear': 'Effacer l\'écran du terminal.',
        'contact': 'Ouvrir le formulaire de contact.',
        'credits': 'Afficher les crédits du projet.',
        'curl': 'Effectuer une requête HTTP. Usage: curl <url>',
        'cv': 'Télécharger le CV au format PDF.',
        'date': 'Afficher la date et l\'heure actuelles.',
        'df': 'Afficher l\'utilisation de l\'espace disque.',
        'echo': 'Afficher du texte. Usage: echo <texte>',
        'email': 'Afficher l\'adresse email de l\'auteur.',
        'encrypt': 'Chiffrer un texte avec le chiffre de César. Usage: encrypt <texte>',
        'exit': 'Fermer la session terminal.',
        'firewall': 'Afficher les règles iptables du pare-feu.',
        'free': 'Afficher l\'utilisation de la mémoire.',
        'gui': 'Tenter de lancer l\'interface graphique.',
        'hack': 'Simuler une attaque sur les serveurs NSA.',
        'hashme': 'Générer un hash SHA-256 d\'un texte. Usage: hashme <texte>',
        'help': 'Afficher la liste des commandes disponibles.',
        'history': 'Afficher l\'historique des commandes.',
        'hostname': 'Afficher le nom de la machine.',
        'ifconfig': 'Afficher la configuration réseau des interfaces.',
        'invaders': 'Jouer à Space Invaders.',
        'ipconfig': 'Afficher la configuration IP (Windows).',
        'ls': 'Lister le contenu du répertoire.',
        'make': 'Compiler des cibles (ou des sandwiches). Usage: make [cible]',
        'man': 'Afficher le manuel d\'une commande. Usage: man <cmd>',
        'matrix': 'Activer l\'effet de pluie numérique Matrix.',
        'minesweeper': 'Jouer au Démineur. Révéler les cases et flagger les mines !',
        'neofetch': 'Afficher les informations système.',
        'nmap': 'Scanner les ports d\'un hôte. Usage: nmap <host>',
        'nslookup': 'Résolution DNS d\'un domaine. Usage: nslookup <domain>',
        'password': 'Générer un mot de passe sécurisé. Usage: password <longueur>',
        'ping': 'Envoyer des paquets ICMP. Usage: ping <host>',
        'pong': 'Jouer à Pong contre l\'IA. W/S ou ↑/↓ pour bouger.',
        'projects': 'Naviguer vers la page projets.',
        'pwd': 'Afficher le répertoire de travail courant.',
        'reboot': 'Redémarrer le système.',
        'shutdown': 'Arrêter le système.',
        'snake': 'Jouer au Snake.',
        'social': 'Afficher les liens des réseaux sociaux.',
        'ssh': 'Simuler une connexion SSH. Usage: ssh <host>',
        'stats': 'Afficher les statistiques de la session.',
        'sudo': 'Exécuter une commande en tant qu\'autre utilisateur.',
        'sysinfo': 'Afficher les infos du navigateur et du système.',
        'tetris': 'Jouer à Tetris. Tourner et empiler les blocs !',
        'theme': 'Changer le thème de couleur. Usage: theme <nom>',
        'tictactoe': 'Jouer au Morpion contre l\'IA.',
        'top': 'Afficher les processus actifs.',
        'traceroute': 'Tracer la route vers un hôte. Usage: traceroute <host>',
        'twofortyeight': 'Jouer à 2048. Fusionner les tuiles !',
        'uname': 'Afficher les informations de l\'OS.',
        'uptime': 'Durée de fonctionnement de la session.',
        'vim': 'Éditeur de texte (bonne chance pour en sortir).',
        'whoami': 'Afficher l\'utilisateur courant.',
        'whois': 'Interroger la base de données de noms de domaine.',
        'wordle': 'Jouer à Wordle. Deviner le mot en 6 essais !'
    };

    // --- BIND GLOBAL SOUND EVENTS ---
    if (input) {
        input.addEventListener('keydown', () => playSound('key'));
    }
    const soundTrigger = document.getElementById('consoleTrigger');
    if (soundTrigger) {
        soundTrigger.addEventListener('click', () => playSound('startup'));
    }

    // --- AUDIO SYSTEM ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const playSound = (type) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        switch (type) {
            case 'key': // Mechanical Click
                osc.type = 'square';
                osc.frequency.setValueAtTime(200 + Math.random() * 50, now);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case 'startup': // Power Up
                osc.type = 'sine';
                osc.frequency.setValueAtTime(80, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'eat': // Snake Eat (High Blip)
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'die': // Crash (Low Noise)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(10, now + 0.3);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'shoot': // Laser
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            case 'hit': // Explosion
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
        }
    };

    // --- GAMES & HELPERS ---
    const startSnake = () => {
        print('🐍 Snake — Arrow keys to move. Press Enter to abort.', 'success');
        isGameRunning = true;
        prompt.style.display = 'none';

        const sCanvas = document.createElement('canvas');
        sCanvas.width = 300; sCanvas.height = 340;
        sCanvas.style.border = '2px solid #0f0';
        sCanvas.style.marginTop = '10px';
        sCanvas.style.background = '#0a0a0a';
        sCanvas.style.borderRadius = '4px';
        output.appendChild(sCanvas);
        body.scrollTop = body.scrollHeight;
        const sCtx = sCanvas.getContext('2d');

        let snake = [{ x: 10, y: 10 }];
        let dx = 1, dy = 0;
        let food = { x: 15, y: 15 };
        let score = 0;
        let highScore = parseInt(localStorage.getItem('snakeHigh') || '0');
        const tile = 15;
        const cols = sCanvas.width / tile;
        const rows = 20;
        let speed = 100;
        let frame = 0;
        let gameInterval;

        const spawnFood = () => {
            let pos;
            do {
                pos = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
            } while (snake.some(s => s.x === pos.x && s.y === pos.y));
            food = pos;
        };

        const drawSnake = () => {
            frame++;
            sCtx.fillStyle = '#0a0a0a';
            sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);

            // Grid
            sCtx.strokeStyle = '#111';
            sCtx.lineWidth = 0.5;
            for (let x = 0; x <= cols; x++) {
                sCtx.beginPath(); sCtx.moveTo(x * tile, 0); sCtx.lineTo(x * tile, rows * tile); sCtx.stroke();
            }
            for (let y = 0; y <= rows; y++) {
                sCtx.beginPath(); sCtx.moveTo(0, y * tile); sCtx.lineTo(sCanvas.width, y * tile); sCtx.stroke();
            }

            // Food (pulse)
            const pulse = Math.sin(frame * 0.15) * 3;
            sCtx.fillStyle = '#ff3333';
            sCtx.shadowColor = '#ff0000';
            sCtx.shadowBlur = 8 + pulse;
            sCtx.beginPath();
            sCtx.arc(food.x * tile + tile / 2, food.y * tile + tile / 2, tile / 2 - 2 + pulse * 0.3, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.shadowBlur = 0;

            // Body
            snake.forEach((p, i) => {
                if (i === 0) {
                    const grad = sCtx.createRadialGradient(p.x * tile + tile / 2, p.y * tile + tile / 2, 2, p.x * tile + tile / 2, p.y * tile + tile / 2, tile / 2);
                    grad.addColorStop(0, '#4eff4e');
                    grad.addColorStop(1, '#00cc00');
                    sCtx.fillStyle = grad;
                } else {
                    sCtx.fillStyle = `hsl(120, 100%, ${Math.max(40, 100 - i * 3)}%)`;
                }
                const r = 3, sx = p.x * tile + 1, sy = p.y * tile + 1, sw = tile - 2, sh = tile - 2;
                sCtx.beginPath();
                sCtx.moveTo(sx + r, sy);
                sCtx.arcTo(sx + sw, sy, sx + sw, sy + sh, r);
                sCtx.arcTo(sx + sw, sy + sh, sx, sy + sh, r);
                sCtx.arcTo(sx, sy + sh, sx, sy, r);
                sCtx.arcTo(sx, sy, sx + sw, sy, r);
                sCtx.fill();
            });

            // Move
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score++;
                playSound('eat');
                spawnFood();
                clearInterval(gameInterval);
                speed = Math.max(50, 100 - score * 2);
                gameInterval = setInterval(drawSnake, speed);
            } else {
                snake.pop();
            }

            // Collisions
            const hitWall = head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
            const hitSelf = snake.slice(1).some(s => s.x === head.x && s.y === head.y);
            if (hitWall || hitSelf) {
                playSound('die');
                clearInterval(gameInterval);
                document.removeEventListener('keydown', keyDownEvent);
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('snakeHigh', String(highScore));
                    print(`🏆 NEW HIGH SCORE! ${score}`, 'success');
                } else {
                    print(`Game Over — Score: ${score} | Best: ${highScore}`, 'error');
                }
                sCanvas.remove();
                isGameRunning = false;
                prompt.style.display = 'flex';
                input.focus();
                return;
            }

            // HUD
            sCtx.fillStyle = '#111';
            sCtx.fillRect(0, rows * tile, sCanvas.width, 40);
            sCtx.fillStyle = '#0f0';
            sCtx.font = 'bold 11px monospace';
            sCtx.fillText(`SCORE: ${score}`, 10, rows * tile + 18);
            sCtx.fillText(`SPEED: ${Math.round((200 - speed) / 1.5)}%`, 110, rows * tile + 18);
            sCtx.fillStyle = '#ff0';
            sCtx.fillText(`BEST: ${highScore}`, 220, rows * tile + 18);
        };

        const keyDownEvent = (e) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowLeft' && dx !== 1) { dx = -1; dy = 0; }
            if (e.key === 'ArrowUp' && dy !== 1) { dx = 0; dy = -1; }
            if (e.key === 'ArrowRight' && dx !== -1) { dx = 1; dy = 0; }
            if (e.key === 'ArrowDown' && dy !== -1) { dx = 0; dy = 1; }
        };
        document.addEventListener('keydown', keyDownEvent);
        gameInterval = setInterval(drawSnake, speed);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                clearInterval(gameInterval);
                document.removeEventListener('keydown', keyDownEvent);
                sCanvas.remove();
                print('Game aborted.', 'warn');
                isGameRunning = false;
                prompt.style.display = 'flex';
                input.focus();
            }
        }, { once: true });
    };

    const startInvaders = () => {
        print('👾 Space Invaders — ← → to move, Space to shoot, Enter to abort.', 'success');
        isGameRunning = true;
        prompt.style.display = 'none';

        const iCanvas = document.createElement('canvas');
        iCanvas.width = 300; iCanvas.height = 340;
        iCanvas.style.border = '2px solid #0f0';
        iCanvas.style.marginTop = '10px';
        iCanvas.style.background = '#000';
        iCanvas.style.borderRadius = '4px';
        output.appendChild(iCanvas);
        body.scrollTop = body.scrollHeight;
        const iCtx = iCanvas.getContext('2d');

        let iScore = 0;
        let lives = 3;
        let level = 1;
        let player = { x: 135, y: 280, w: 30, h: 10 };
        let bullets = [];
        let enemyBullets = [];
        let particles = [];
        let enemies = [];
        let dx = 1.5;
        let frame = 0;
        let gameRunning = true;

        const stars = Array.from({ length: 40 }, () => ({
            x: Math.random() * 300, y: Math.random() * 300,
            s: Math.random() * 1.5 + 0.5, b: Math.random()
        }));

        const spawnWave = () => {
            enemies = [];
            const rows = Math.min(3 + Math.floor(level / 2), 5);
            const cols = Math.min(6 + Math.floor(level / 3), 8);
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    enemies.push({
                        x: 15 + c * 35, y: 30 + r * 28, w: 20, h: 20, alive: true,
                        type: r === 0 ? 2 : r < 2 ? 1 : 0
                    });
                }
            }
            dx = (1.5 + level * 0.3) * (dx > 0 ? 1 : -1);
        };
        spawnWave();

        const addExplosion = (x, y, color) => {
            for (let i = 0; i < 8; i++) {
                particles.push({
                    x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                    life: 20, color
                });
            }
        };

        const drawInvaders = () => {
            if (!gameRunning) return;
            frame++;
            iCtx.fillStyle = '#000';
            iCtx.fillRect(0, 0, 300, 340);

            // Stars
            stars.forEach(s => {
                const twinkle = Math.sin(frame * 0.05 + s.b * 10) * 0.4 + 0.6;
                iCtx.fillStyle = `rgba(255,255,255,${twinkle})`;
                iCtx.fillRect(s.x, s.y, s.s, s.s);
            });

            // Player ship
            iCtx.fillStyle = lives > 1 ? '#0f0' : '#ff0';
            iCtx.beginPath();
            iCtx.moveTo(player.x + 15, player.y - 5);
            iCtx.lineTo(player.x + 30, player.y + 10);
            iCtx.lineTo(player.x, player.y + 10);
            iCtx.closePath();
            iCtx.fill();
            iCtx.fillRect(player.x + 5, player.y + 10, 20, 3);

            // Player bullets
            iCtx.fillStyle = '#0ff';
            bullets = bullets.filter(b => {
                b.y -= 6;
                if (b.y < 0) return false;
                iCtx.fillRect(b.x, b.y, 2, 8);
                return true;
            });

            // Enemy bullets
            iCtx.fillStyle = '#f44';
            enemyBullets = enemyBullets.filter(b => {
                b.y += 3;
                if (b.y > 300) return false;
                iCtx.fillRect(b.x, b.y, 2, 6);
                if (b.x > player.x && b.x < player.x + player.w && b.y > player.y && b.y < player.y + player.h + 10) {
                    lives--;
                    addExplosion(player.x + 15, player.y, '#0f0');
                    playSound('die');
                    if (lives <= 0) { finishGame(false); return false; }
                    return false;
                }
                return true;
            });

            const aliveEnemies = enemies.filter(e => e.alive);

            // Enemy shooting
            if (frame % (Math.max(30, 60 - level * 5)) === 0 && aliveEnemies.length > 0) {
                const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                enemyBullets.push({ x: shooter.x + 10, y: shooter.y + 20 });
            }

            // Win check
            if (aliveEnemies.length === 0) {
                level++;
                print(`Wave ${level} incoming!`, 'info');
                spawnWave();
                return;
            }

            // Draw enemies
            let edge = false;
            const colors = ['#e44', '#e80', '#ee0'];
            enemies.forEach(e => {
                if (!e.alive) return;
                iCtx.fillStyle = colors[e.type] || '#e44';
                const open = Math.floor(frame / 15) % 2 === 0;
                iCtx.fillRect(e.x + 3, e.y, 14, 5);
                iCtx.fillRect(e.x, e.y + 5, 20, 8);
                if (open) {
                    iCtx.fillRect(e.x, e.y + 13, 5, 5);
                    iCtx.fillRect(e.x + 15, e.y + 13, 5, 5);
                } else {
                    iCtx.fillRect(e.x + 2, e.y + 13, 7, 5);
                    iCtx.fillRect(e.x + 11, e.y + 13, 7, 5);
                }

                bullets.forEach((b, bi) => {
                    if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
                        e.alive = false;
                        bullets.splice(bi, 1);
                        iScore += (e.type + 1) * 10;
                        playSound('hit');
                        addExplosion(e.x + 10, e.y + 10, colors[e.type]);
                    }
                });

                e.x += dx;
                if (e.x + e.w > 295 || e.x < 5) edge = true;
                if (e.y + e.h > player.y) { finishGame(false); return; }
            });

            if (edge) {
                dx = -dx;
                enemies.forEach(e => { if (e.alive) e.y += 8; });
            }

            // Particles
            particles = particles.filter(p => {
                p.x += p.vx; p.y += p.vy; p.life--;
                iCtx.fillStyle = p.color;
                iCtx.globalAlpha = p.life / 20;
                iCtx.fillRect(p.x, p.y, 2, 2);
                iCtx.globalAlpha = 1;
                return p.life > 0;
            });

            // HUD
            iCtx.fillStyle = '#111';
            iCtx.fillRect(0, 300, 300, 40);
            iCtx.font = 'bold 11px monospace';
            iCtx.fillStyle = '#0f0';
            iCtx.fillText(`SCORE: ${iScore}`, 10, 318);
            iCtx.fillStyle = '#f44';
            iCtx.fillText(`LIVES: ${'\u2665'.repeat(lives)}`, 115, 318);
            iCtx.fillStyle = '#0ff';
            iCtx.fillText(`WAVE: ${level}`, 240, 318);
        };

        const iKeyEvents = (e) => {
            if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowLeft' && player.x > 0) player.x -= 12;
            if (e.key === 'ArrowRight' && player.x < 265) player.x += 12;
            if (e.key === ' ') {
                bullets.push({ x: player.x + 14, y: player.y - 10 });
                playSound('shoot');
            }
        };
        document.addEventListener('keydown', iKeyEvents);
        const invInt = setInterval(drawInvaders, 33);

        const finishGame = (win) => {
            gameRunning = false;
            clearInterval(invInt);
            document.removeEventListener('keydown', iKeyEvents);
            iCanvas.remove();
            if (win) {
                print(`🏆 VICTORY! Score: ${iScore} | Waves cleared: ${level}`, 'success');
            } else {
                print(`💀 GAME OVER — Score: ${iScore} | Wave: ${level}`, 'error');
            }
            isGameRunning = false;
            prompt.style.display = 'flex';
            input.focus();
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                gameRunning = false;
                clearInterval(invInt);
                document.removeEventListener('keydown', iKeyEvents);
                iCanvas.remove();
                print('Game Aborted.', 'warn');
                isGameRunning = false;
                prompt.style.display = 'flex';
                input.focus();
            }
        }, { once: true });
    };

    const startHack = () => {
        print('Initiating brute-force attack on NSA servers...', 'warn');
        let hCount = 0;
        const hInt = setInterval(() => {
            if (hCount > 20) {
                clearInterval(hInt);
                print('ACCESS DENIED. Connection terminated by host.', 'error');
            } else {
                print(`[${Math.random().toString(16).substr(2, 8)}] Uploading payload... ${hCount * 5}%`, 'info');
                const output = document.querySelector('.console-output');
                output.scrollTop = output.scrollHeight;
                hCount++;
            }
        }, 150);
    };

    // --- TETRIS ---
    const startTetris = () => {
        print('TETRIS — Arrow keys to move/rotate, Down to drop. ESC to quit.', 'info');
        const W = 10, H = 20;
        const PIECES = [
            [[1, 1, 1, 1]],
            [[1, 1], [1, 1]],
            [[0, 1, 0], [1, 1, 1]],
            [[1, 0, 0], [1, 1, 1]],
            [[0, 0, 1], [1, 1, 1]],
            [[1, 1, 0], [0, 1, 1]],
            [[0, 1, 1], [1, 1, 0]]
        ];
        const COLORS = ['cyan', 'yellow', 'purple', 'blue', 'orange', 'green', 'red'];
        let board = Array.from({ length: H }, () => Array(W).fill(0));
        let score = 0, gameOver = false;
        let piece, pieceX, pieceY, pieceIdx;

        const newPiece = () => {
            pieceIdx = Math.floor(Math.random() * PIECES.length);
            piece = PIECES[pieceIdx].map(r => [...r]);
            pieceX = Math.floor((W - piece[0].length) / 2);
            pieceY = 0;
            if (collides(piece, pieceX, pieceY)) { gameOver = true; }
        };
        const collides = (p, px, py) => {
            for (let y = 0; y < p.length; y++)for (let x = 0; x < p[y].length; x++) {
                if (p[y][x] && (px + x < 0 || px + x >= W || py + y >= H || board[py + y][px + x])) return true;
            } return false;
        };
        const merge = () => {
            for (let y = 0; y < piece.length; y++)for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x]) board[pieceY + y][pieceX + x] = pieceIdx + 1;
            }
        };
        const clearLines = () => {
            let cleared = 0;
            for (let y = H - 1; y >= 0; y--) {
                if (board[y].every(c => c)) { board.splice(y, 1); board.unshift(Array(W).fill(0)); cleared++; y++; }
            }
            if (cleared) score += cleared * 100;
        };
        const rotate = () => {
            const r = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
            if (!collides(r, pieceX, pieceY)) piece = r;
        };
        const draw = () => {
            let display = board.map(r => [...r]);
            for (let y = 0; y < piece.length; y++)for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x] && pieceY + y >= 0) display[pieceY + y][pieceX + x] = pieceIdx + 1;
            }
            const lines = display.map(r => '│' + r.map(c => c ? '██' : '··').join('') + '│');
            const top = '┌' + '──'.repeat(W) + '┐';
            const bot = '└' + '──'.repeat(W) + '┘';
            output.innerHTML = '';
            print(`TETRIS  Score: ${score}`, 'warn');
            print(top, 'pre');
            lines.forEach(l => print(l, 'pre'));
            print(bot, 'pre');
            print('← → ↓ move  |  ↑ rotate  |  ESC quit', 'info');
        };

        newPiece(); draw();
        const tick = setInterval(() => {
            if (gameOver) { clearInterval(tick); document.removeEventListener('keydown', tKey); print(`GAME OVER! Score: ${score}`, 'error'); return; }
            if (!collides(piece, pieceX, pieceY + 1)) { pieceY++; }
            else { merge(); clearLines(); newPiece(); }
            draw();
        }, 500);

        const tKey = (e) => {
            if (gameOver) return;
            if (e.key === 'Escape') { clearInterval(tick); document.removeEventListener('keydown', tKey); output.innerHTML = ''; print('Tetris ended.', 'warn'); return; }
            e.preventDefault();
            if (e.key === 'ArrowLeft' && !collides(piece, pieceX - 1, pieceY)) pieceX--;
            else if (e.key === 'ArrowRight' && !collides(piece, pieceX + 1, pieceY)) pieceX++;
            else if (e.key === 'ArrowDown' && !collides(piece, pieceX, pieceY + 1)) pieceY++;
            else if (e.key === 'ArrowUp') rotate();
            draw();
        };
        document.addEventListener('keydown', tKey);
    };

    // --- PONG ---
    const startPong = () => {
        print('PONG — W/S or ↑/↓ to move. First to 5 wins. ESC to quit.', 'info');
        const W = 40, H = 15;
        let pY = Math.floor(H / 2) - 1, aiY = Math.floor(H / 2) - 1;
        let bx = Math.floor(W / 2), by = Math.floor(H / 2);
        let dx = 1, dy = 1;
        let pScore = 0, aiScore = 0, done = false;
        const padH = 3;

        const draw = () => {
            output.innerHTML = '';
            print(`  YOU: ${pScore}  |  AI: ${aiScore}`, 'warn');
            let grid = Array.from({ length: H }, () => Array(W).fill(' '));
            for (let i = 0; i < padH; i++) { if (pY + i < H) grid[pY + i][1] = '█'; if (aiY + i < H) grid[aiY + i][W - 2] = '█'; }
            if (by >= 0 && by < H && bx >= 0 && bx < W) grid[by][bx] = '●';
            const top = '┌' + '─'.repeat(W) + '┐';
            const bot = '└' + '─'.repeat(W) + '┘';
            print(top, 'pre');
            grid.forEach(r => print('│' + r.join('') + '│', 'pre'));
            print(bot, 'pre');
            print('W/S or ↑/↓ move  |  ESC quit', 'info');
        };

        const tick = setInterval(() => {
            if (done) return;
            // AI
            const aiCenter = aiY + Math.floor(padH / 2);
            if (aiCenter < by && aiY + padH < H) aiY++;
            else if (aiCenter > by && aiY > 0) aiY--;
            // Ball
            bx += dx; by += dy;
            if (by <= 0 || by >= H - 1) dy = -dy;
            // Paddle collision
            if (bx <= 2 && by >= pY && by < pY + padH) { dx = 1; playSound('eat'); }
            if (bx >= W - 3 && by >= aiY && by < aiY + padH) { dx = -1; playSound('eat'); }
            // Score
            if (bx <= 0) { aiScore++; bx = Math.floor(W / 2); by = Math.floor(H / 2); dx = 1; playSound('die'); }
            if (bx >= W - 1) { pScore++; bx = Math.floor(W / 2); by = Math.floor(H / 2); dx = -1; playSound('die'); }
            if (pScore >= 5 || aiScore >= 5) {
                done = true; clearInterval(tick); document.removeEventListener('keydown', pKey);
                draw();
                print(pScore >= 5 ? '🎉 YOU WIN!' : 'AI wins. Better luck next time.', pScore >= 5 ? 'success' : 'error');
                return;
            }
            draw();
        }, 120);

        const pKey = (e) => {
            if (e.key === 'Escape') { done = true; clearInterval(tick); document.removeEventListener('keydown', pKey); output.innerHTML = ''; print('Pong ended.', 'warn'); return; }
            e.preventDefault();
            if ((e.key === 'w' || e.key === 'ArrowUp') && pY > 0) pY--;
            if ((e.key === 's' || e.key === 'ArrowDown') && pY + padH < H) pY++;
        };
        document.addEventListener('keydown', pKey);
        draw();
    };

    // --- 2048 ---
    const start2048 = () => {
        print('2048 — Arrow keys to slide tiles. ESC to quit.', 'info');
        let grid = Array.from({ length: 4 }, () => Array(4).fill(0));
        let score2048 = 0, done = false;

        const addTile = () => {
            const empty = [];
            for (let y = 0; y < 4; y++)for (let x = 0; x < 4; x++)if (!grid[y][x]) empty.push([y, x]);
            if (empty.length) { const [ry, rx] = empty[Math.floor(Math.random() * empty.length)]; grid[ry][rx] = Math.random() < 0.9 ? 2 : 4; }
        };
        const slide = (row) => {
            let a = row.filter(x => x);
            for (let i = 0; i < a.length - 1; i++) { if (a[i] === a[i + 1]) { a[i] *= 2; score2048 += a[i]; a.splice(i + 1, 1); } }
            while (a.length < 4) a.push(0);
            return a;
        };
        const move = (dir) => {
            let moved = false;
            const old = JSON.stringify(grid);
            if (dir === 'left') grid = grid.map(r => slide(r));
            else if (dir === 'right') grid = grid.map(r => slide([...r].reverse()).reverse());
            else if (dir === 'up') {
                for (let x = 0; x < 4; x++) { let col = grid.map(r => r[x]); col = slide(col); for (let y = 0; y < 4; y++)grid[y][x] = col[y]; }
            } else if (dir === 'down') {
                for (let x = 0; x < 4; x++) { let col = grid.map(r => r[x]).reverse(); col = slide(col).reverse(); for (let y = 0; y < 4; y++)grid[y][x] = col[y]; }
            }
            if (JSON.stringify(grid) !== old) { moved = true; addTile(); }
            return moved;
        };
        const canMove = () => {
            for (let y = 0; y < 4; y++)for (let x = 0; x < 4; x++) {
                if (!grid[y][x]) return true;
                if (x < 3 && grid[y][x] === grid[y][x + 1]) return true;
                if (y < 3 && grid[y][x] === grid[y + 1][x]) return true;
            } return false;
        };
        const draw = () => {
            output.innerHTML = '';
            print(`2048  Score: ${score2048}`, 'warn');
            const sep = '┌──────┬──────┬──────┬──────┐';
            const mid = '├──────┼──────┼──────┼──────┤';
            const bot = '└──────┴──────┴──────┴──────┘';
            print(sep, 'pre');
            grid.forEach((row, i) => {
                const line = '│' + row.map(v => v ? (v + '').padStart(4, ' ').padEnd(6, ' ') : ' ·  · ').join('│') + '│';
                print(line, 'pre');
                if (i < 3) print(mid, 'pre');
            });
            print(bot, 'pre');
            print('Arrow keys to slide  |  ESC quit', 'info');
        };

        addTile(); addTile(); draw();
        const tfKey = (e) => {
            if (done) return;
            if (e.key === 'Escape') { done = true; document.removeEventListener('keydown', tfKey); output.innerHTML = ''; print('2048 ended.', 'warn'); return; }
            let dir = null;
            if (e.key === 'ArrowLeft') dir = 'left';
            else if (e.key === 'ArrowRight') dir = 'right';
            else if (e.key === 'ArrowUp') dir = 'up';
            else if (e.key === 'ArrowDown') dir = 'down';
            if (dir) {
                e.preventDefault(); move(dir); draw();
                // Check win
                for (let y = 0; y < 4; y++)for (let x = 0; x < 4; x++) {
                    if (grid[y][x] === 2048) { done = true; document.removeEventListener('keydown', tfKey); print('🎉 YOU REACHED 2048!', 'success'); return; }
                }
                if (!canMove()) { done = true; document.removeEventListener('keydown', tfKey); print(`Game Over! Final Score: ${score2048}`, 'error'); }
            }
        };
        document.addEventListener('keydown', tfKey);
    };

    // --- MINESWEEPER ---
    const startMinesweeper = () => {
        print('MINESWEEPER — Type: "r X Y" to reveal, "f X Y" to flag. "mq" to quit.', 'info');
        const W = 8, H = 8, MINES = 10;
        let board = Array.from({ length: H }, () => Array(W).fill(0));
        let revealed = Array.from({ length: H }, () => Array(W).fill(false));
        let flagged = Array.from({ length: H }, () => Array(W).fill(false));
        let gameActive = true, firstMove = true;

        const placeMines = (safeY, safeX) => {
            let placed = 0;
            while (placed < MINES) {
                const y = Math.floor(Math.random() * H), x = Math.floor(Math.random() * W);
                if (board[y][x] !== -1 && !(Math.abs(y - safeY) <= 1 && Math.abs(x - safeX) <= 1)) {
                    board[y][x] = -1; placed++;
                }
            }
            for (let y = 0; y < H; y++)for (let x = 0; x < W; x++) {
                if (board[y][x] === -1) continue;
                let c = 0;
                for (let dy = -1; dy <= 1; dy++)for (let dx = -1; dx <= 1; dx++) {
                    const ny = y + dy, nx = x + dx;
                    if (ny >= 0 && ny < H && nx >= 0 && nx < W && board[ny][nx] === -1) c++;
                }
                board[y][x] = c;
            }
        };
        const reveal = (y, x) => {
            if (y < 0 || y >= H || x < 0 || x >= W || revealed[y][x] || flagged[y][x]) return;
            revealed[y][x] = true;
            if (board[y][x] === 0) {
                for (let dy = -1; dy <= 1; dy++)for (let dx = -1; dx <= 1; dx++)reveal(y + dy, x + dx);
            }
        };
        const checkWin = () => {
            for (let y = 0; y < H; y++)for (let x = 0; x < W; x++) {
                if (board[y][x] !== -1 && !revealed[y][x]) return false;
            } return true;
        };
        const draw = () => {
            output.innerHTML = '';
            const numColors = ['', 'color:#00f', 'color:#0a0', 'color:#f00', 'color:#008', 'color:#800', 'color:#088', 'color:#000', 'color:#888'];
            let header = '   ';
            for (let x = 0; x < W; x++)header += ` ${x} `;
            print(header, 'pre');
            print('  ┌' + '───'.repeat(W) + '┐', 'pre');
            for (let y = 0; y < H; y++) {
                let row = `${y} │`;
                for (let x = 0; x < W; x++) {
                    if (flagged[y][x]) row += ' 🚩';
                    else if (!revealed[y][x]) row += ' ░░';
                    else if (board[y][x] === -1) row += ' 💣';
                    else if (board[y][x] === 0) row += '   ';
                    else row += ` <span style="${numColors[board[y][x]]}">${board[y][x]}</span> `;
                }
                row += '│';
                print(row, 'pre');
            }
            print('  └' + '───'.repeat(W) + '┘', 'pre');
            const flags = flagged.flat().filter(f => f).length;
            print(`Mines: ${MINES}  Flags: ${flags}  |  "r X Y" reveal  "f X Y" flag  "mq" quit`, 'info');
        };

        draw();
        // Override executeCommand temporarily for minesweeper input
        const origExec = executeCommand;
        const msHandler = (command) => {
            if (!gameActive) { executeCommand = origExec; origExec(command); return; }
            const args = command.trim().split(/\s+/);
            const cmdLine = document.createElement('div');
            cmdLine.className = 'console-input-line';
            cmdLine.innerHTML = `<span class="console-prompt">${document.getElementById('promptPath').innerText}</span> <span style="color:#fff">${command}</span>`;
            output.appendChild(cmdLine);
            if (args[0] === 'mq') { gameActive = false; executeCommand = origExec; output.innerHTML = ''; print('Minesweeper ended.', 'warn'); return; }
            if ((args[0] === 'r' || args[0] === 'f') && args.length === 3) {
                const x = parseInt(args[1]), y = parseInt(args[2]);
                if (isNaN(x) || isNaN(y) || x < 0 || x >= W || y < 0 || y >= H) { print('Invalid coords.', 'error'); return; }
                if (args[0] === 'f') { flagged[y][x] = !flagged[y][x]; draw(); return; }
                if (args[0] === 'r') {
                    if (firstMove) { placeMines(y, x); firstMove = false; }
                    if (board[y][x] === -1) {
                        revealed[y][x] = true; gameActive = false; executeCommand = origExec;
                        // Reveal all mines
                        for (let ry = 0; ry < H; ry++)for (let rx = 0; rx < W; rx++)if (board[ry][rx] === -1) revealed[ry][rx] = true;
                        draw(); print('💥 BOOM! Game Over.', 'error'); playSound('die'); return;
                    }
                    reveal(y, x);
                    if (checkWin()) { gameActive = false; executeCommand = origExec; draw(); print('🎉 YOU WIN! All safe tiles revealed!', 'success'); playSound('eat'); return; }
                    draw();
                }
            } else { print('Commands: "r X Y" to reveal, "f X Y" to flag, "mq" to quit', 'warn'); }
        };
        executeCommand = msHandler;
    };

    // --- TIC-TAC-TOE ---
    const startTicTacToe = () => {
        print('TIC-TAC-TOE — You are X. Type position 1-9. "tq" to quit.', 'info');
        let board = ['', '', '', '', '', '', '', '', ''];
        let gameActive = true;
        const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        const draw = () => {
            const c = (i) => board[i] || `<span style="color:#555">${i + 1}</span>`;
            print('', 'pre');
            print(` ${c(0)} │ ${c(1)} │ ${c(2)} `, 'pre');
            print('───┼───┼───', 'pre');
            print(` ${c(3)} │ ${c(4)} │ ${c(5)} `, 'pre');
            print('───┼───┼───', 'pre');
            print(` ${c(6)} │ ${c(7)} │ ${c(8)} `, 'pre');
            print('', 'pre');
        };
        const checkWinner = (b) => {
            for (const [a, bb, cc] of wins) {
                if (b[a] && b[a] === b[bb] && b[a] === b[cc]) return b[a];
            } return null;
        };
        const aiMove = () => {
            // Try to win
            for (let i = 0; i < 9; i++) { if (!board[i]) { board[i] = 'O'; if (checkWinner(board) === 'O') return; board[i] = ''; } }
            // Block player
            for (let i = 0; i < 9; i++) { if (!board[i]) { board[i] = 'X'; if (checkWinner(board) === 'X') { board[i] = 'O'; return; } board[i] = ''; } }
            // Center
            if (!board[4]) { board[4] = 'O'; return; }
            // Corners
            const corners = [0, 2, 6, 8].filter(i => !board[i]);
            if (corners.length) { board[corners[Math.floor(Math.random() * corners.length)]] = 'O'; return; }
            // Remaining
            const empty = board.map((v, i) => v ? -1 : i).filter(i => i >= 0);
            if (empty.length) board[empty[Math.floor(Math.random() * empty.length)]] = 'O';
        };

        draw();
        const origExec = executeCommand;
        const tttHandler = (command) => {
            if (!gameActive) { executeCommand = origExec; origExec(command); return; }
            const cmdLine = document.createElement('div');
            cmdLine.className = 'console-input-line';
            cmdLine.innerHTML = `<span class="console-prompt">${document.getElementById('promptPath').innerText}</span> <span style="color:#fff">${command}</span>`;
            output.appendChild(cmdLine);
            if (command.trim() === 'tq') { gameActive = false; executeCommand = origExec; output.innerHTML = ''; print('Tic-Tac-Toe ended.', 'warn'); return; }
            const pos = parseInt(command.trim()) - 1;
            if (isNaN(pos) || pos < 0 || pos > 8 || board[pos]) { print('Invalid move. Type 1-9.', 'error'); return; }
            board[pos] = 'X';
            if (checkWinner(board) === 'X') { draw(); print('🎉 YOU WIN!', 'success'); playSound('eat'); gameActive = false; executeCommand = origExec; return; }
            if (board.every(c => c)) { draw(); print('Draw!', 'warn'); gameActive = false; executeCommand = origExec; return; }
            aiMove();
            if (checkWinner(board) === 'O') { draw(); print('AI wins! 🤖', 'error'); playSound('die'); gameActive = false; executeCommand = origExec; return; }
            if (board.every(c => c)) { draw(); print('Draw!', 'warn'); gameActive = false; executeCommand = origExec; return; }
            draw();
        };
        executeCommand = tttHandler;
    };

    // --- WORDLE ---
    const startWordle = () => {
        const WORDS = ['CYBER', 'LINUX', 'ADMIN', 'STACK', 'PROXY', 'DEBUG', 'CLOUD', 'SHELL', 'VIRUS', 'PATCH',
            'ROUTE', 'SPEED', 'INPUT', 'FRAME', 'PIXEL', 'LAYER', 'INDEX', 'TABLE', 'QUERY', 'MODEL',
            'REACT', 'SWIFT', 'FLASK', 'PARSE', 'TOKEN', 'CACHE', 'CRYPT', 'BLOCK', 'DRIVE', 'MOUNT'];
        const target = WORDS[Math.floor(Math.random() * WORDS.length)];
        let guesses = [], gameActive = true, maxGuesses = 6;

        print('WORDLE — Guess the 5-letter word in 6 tries. "wq" to quit.', 'info');
        print('🟩 = correct position  |  🟨 = wrong position  |  ⬛ = not in word', 'info');

        const draw = () => {
            output.innerHTML = '';
            print('WORDLE', 'warn');
            print('');
            guesses.forEach(g => {
                let line = '  ';
                for (let i = 0; i < 5; i++) {
                    if (g[i] === target[i]) line += '🟩';
                    else if (target.includes(g[i])) line += '🟨';
                    else line += '⬛';
                }
                line += '  ' + g.split('').join(' ');
                print(line, 'pre');
            });
            for (let i = guesses.length; i < maxGuesses; i++) {
                print('  ⬜⬜⬜⬜⬜  _ _ _ _ _', 'pre');
            }
            print('');
            print(`Attempt ${guesses.length}/${maxGuesses}  |  Type a 5-letter word  |  "wq" to quit`, 'info');
        };

        draw();
        const origExec = executeCommand;
        const wHandler = (command) => {
            if (!gameActive) { executeCommand = origExec; origExec(command); return; }
            const cmdLine = document.createElement('div');
            cmdLine.className = 'console-input-line';
            cmdLine.innerHTML = `<span class="console-prompt">${document.getElementById('promptPath').innerText}</span> <span style="color:#fff">${command}</span>`;
            output.appendChild(cmdLine);
            if (command.trim().toLowerCase() === 'wq') { gameActive = false; executeCommand = origExec; output.innerHTML = ''; print('Wordle ended.', 'warn'); return; }
            const guess = command.trim().toUpperCase();
            if (guess.length !== 5 || !/^[A-Z]+$/.test(guess)) { print('Enter a valid 5-letter word.', 'error'); return; }
            guesses.push(guess);
            draw();
            if (guess === target) { print('🎉 Brilliant! You got it!', 'success'); playSound('eat'); gameActive = false; executeCommand = origExec; return; }
            if (guesses.length >= maxGuesses) { print(`Game Over! The word was: ${target}`, 'error'); playSound('die'); gameActive = false; executeCommand = origExec; }
        };
        executeCommand = wHandler;
    };

    // --- COMMAND REGISTRY ---
    const COMMANDS = {
        'pwd': () => print('/home/brieuc', 'info'),
        'ls': () => print(Object.keys(virtualFiles).join('   '), 'info'),
        'cd': () => print('Directory navigation restricted (demo mode).', 'warn'),
        'cat': (args) => {
            if (!args[1]) {
                print(' /\\_/\\ ', 'pre');
                print('( o.o )', 'pre');
                print(' > ^ < ', 'pre');
            } else {
                const fileName = args[1];
                if (virtualFiles[fileName]) {
                    const content = virtualFiles[fileName].replace(/\n/g, '<br>');
                    print(content, 'info');
                } else print('cat: ' + fileName + ': No such file or directory', 'error');
            }
        },
        'mkdir': () => print('Permission denied: Read-only file system.', 'error'),
        'help': () => {
            print('Available commands:', 'info');
            print('Type "banner" to see the logo.', 'success');
            // Calculate maxLen for padding
            let maxLen = 0;
            Object.values(helpMap).forEach(cmds => {
                cmds.forEach(([c]) => { if (c.length > maxLen) maxLen = c.length; });
            });
            maxLen += 2;
            for (const [section, commands] of Object.entries(helpMap)) {
                print(section, 'warn');
                commands.forEach(([cmd, desc]) => {
                    let paddedCmd = cmd.padEnd(maxLen, ' ');
                    paddedCmd = paddedCmd.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    print(`${paddedCmd} : ${desc}`);
                });
                print(' ');
            }
        },
        'whoami': () => {
            print('User: Brieuc Métairie', 'success');
            print('Role: Future SysAdmin & Network Expert');
            print('Location: France');
        },
        'social': () => {
            print('-----------------------------', 'info');
            print('LinkedIn: <a href="https://linkedin.com/in/brieuc-metairie" target="_blank" style="color:#00f">linkedin.com/in/brieuc-metairie</a>');
            print('GitHub:   <a href="https://github.com/brieuc-metairie" target="_blank" style="color:#00f">github.com/brieuc-metairie</a>');
            print('Email:    <a href="mailto:metairiebrieuc@gmail.com" style="color:#00f">metairiebrieuc@gmail.com</a>');
            print('-----------------------------', 'info');
        },
        'projects': () => {
            print('Redirecting to /activites.html...', 'warn');
            setTimeout(() => window.location.href = 'activites.html', 800);
        },
        'contact': () => {
            print('Opening secure channel...', 'warn');
            setTimeout(() => {
                overlay.classList.remove('open');
                const modal = document.getElementById('contactModal');
                if (modal) modal.showModal();
            }, 500);
        },
        'cv': () => {
            print('Downloading CV...', 'success');
            const link = document.createElement('a');
            link.href = 'assets/cv.pdf';
            link.download = 'CV_Brieuc_Metairie.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        'theme': (args) => {
            const mode = args[1];
            const consoleWin = document.querySelector('.console-window');
            if (mode === 'retro') {
                consoleWin.classList.add('theme-retro');
                consoleWin.classList.remove('theme-ocean', 'theme-dracula');
                if (matrixInterval) { clearInterval(matrixInterval); document.querySelector('.matrix-canvas')?.remove(); }
                print('Theme set to RETRO.', 'success');
            } else if (mode === 'ocean') {
                consoleWin.classList.add('theme-ocean');
                consoleWin.classList.remove('theme-retro', 'theme-dracula');
                if (matrixInterval) { clearInterval(matrixInterval); document.querySelector('.matrix-canvas')?.remove(); }
                print('Theme set to OCEAN.', 'success');
            } else if (mode === 'dracula') {
                consoleWin.classList.add('theme-dracula');
                consoleWin.classList.remove('theme-retro', 'theme-ocean');
                if (matrixInterval) { clearInterval(matrixInterval); document.querySelector('.matrix-canvas')?.remove(); }
                print('Theme set to DRACULA.', 'success');
            } else if (mode === 'matrix' || mode === 'green') {
                consoleWin.classList.remove('theme-retro', 'theme-ocean', 'theme-dracula');
                consoleWin.classList.add('theme-matrix'); // Add explicit class
                initMatrix();
                print('Theme set to MATRIX.', 'success');
            } else {
                print('Usage: theme <retro|ocean|dracula|matrix>', 'warn');
            }
        },
        'neofetch': (args) => {
            print('            .-/+oossssoo+/-.               brieuc@portfolio', 'pre');
            print('        `:+ssssssssssssssssss+:`           ----------------', 'pre');
            print('      -+ssssssssssssssssssyyssss+-         OS: PortfolioOS Web 1.0', 'pre');
            print('    .ossssssssssssssssssdMMMNysssso.       Host: Browser', 'pre');
            print('   /ssssssssssshdmmNNmmyNMMMMhssssss/      Uptime: Forever', 'pre');
            print('  +ssssssssshmydMMMMMMMNddddyssssssss+     Packages: 1 (npm)', 'pre');
            print(' /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Shell: JS-Shell zsh', 'pre');
            print('.ssssssssdMMMNhsssssssssshNMMMdssssssss.   Resolution: ' + window.innerWidth + 'x' + window.innerHeight, 'pre');
            print('+sssshhhyNMMNyssssssssssssyNMMMysssssss+   Theme: ' + (args[2] || 'Retro'), 'pre');
            print('ossyNMMMNyMMhsssssssssssssshmmmhssssssso   CPU: 100% Brain', 'pre');
        },
        'banner': () => {
            print(' ______       _                   ', 'pre');
            print('|  _  \\     (_)                  ', 'pre');
            print('| |_) |_ __  _  ___  _   _  ___  ', 'pre');
            print('|  _ <| \'__| |/ _ \\| | | |/ __| ', 'pre');
            print('| |_) | |   | |  __/| |_| | (__  ', 'pre');
            print('|____/|_|   |_|\\___| \\__,_|\\___| ', 'pre');
            print('          |__/                 ', 'pre');
        },
        'matrix': () => {
            initMatrix();
            print('Wake up, Neo...', 'success');
        },
        'shutdown': () => {
            print('System halting...', 'error');
            setTimeout(() => {
                let overlay = document.querySelector('.shutdown-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'shutdown-overlay';
                    overlay.innerText = "SYSTEM HALTED";
                    document.body.appendChild(overlay);
                }
                overlay.offsetHeight;
                overlay.classList.add('active');
            }, 1000);
        },
        'reboot': () => {
            print('Rebooting system...', 'warn');
            setTimeout(() => location.reload(), 1000);
        },
        'vim': () => {
            print('You are trapped in a text editor.', 'error');
            print('Press ESC to exit...', 'info');
            setTimeout(() => print('Just kidding. Type :q! to quit.', 'info'), 1500);
        },
        'vi': () => COMMANDS['vim'](),
        ':q!': () => print('Phew! You escaped.', 'success'),
        ':q': () => COMMANDS[':q!'](),
        'sudo': (args) => {
            if (args[1] === 'rm' && args[2] === '-rf' && args[3] === '/') {
                triggerBSOD();
            } else if (args[1] === 'su' || args[1] === '-i') {
                print('Password for brieuc:', 'warn');
                setTimeout(() => {
                    print('******', 'info');
                    setTimeout(() => {
                        print('Switched to user root', 'success');
                        currentUser = 'root';
                        document.getElementById('promptPath').innerText = 'root@brieuc:~#';
                    }, 800);
                }, 1000);
            } else if (args.slice(1).join(' ') === 'make me a sandwich') {
                print('Okay. 🥪', 'success');
            } else {
                print('Permission denied: You are not root.', 'error');
            }
        },
        'su': () => COMMANDS['sudo'](['sudo', 'su']),
        'rm': (args) => {
            if (currentUser === 'root' && args[1] === '-rf' && args[2] === '/') {
                triggerBSOD();
            } else if (currentUser !== 'root') {
                print('Permission denied: You are not root.', 'error');
            } else {
                print('Usage: rm -rf / (Do not try this)', 'warn');
            }
        },
        'history': () => print(commandHistory.map((c, i) => `${i + 1}  ${c}`).join('<br>'), 'info'),
        'ping': (args) => {
            const target = args[1] || 'google.com';
            const fakeIP = Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
            print(`Pinging ${target} [${fakeIP}] with 32 bytes of data:`);
            let pings = 0;
            const pingInterval = setInterval(() => {
                if (pings >= 4) {
                    clearInterval(pingInterval);
                    print(`Ping statistics for ${target}:`, 'info');
                    return;
                }
                const time = Math.floor(Math.random() * 20) + 10;
                print(`Reply from ${fakeIP}: bytes=32 time=${time}ms TTL=115`);
                pings++;
            }, 800);
        },
        'ipconfig': () => {
            print('Windows IP Configuration');
            print('IPv4 Address. . . . . . . . . . . : 192.168.1.42');
        },
        'date': () => print(new Date().toString()),
        'curl': (args) => {
            if (!args[1]) { print('curl: try \'curl <url>\'', 'warn'); }
            else {
                print(`Checking ${args[1]}...`, 'info');
                setTimeout(() => {
                    print('&lt;html&gt;&lt;head&gt;&lt;title&gt;301 Moved Permanently&lt;/title&gt;&lt;/head&gt;&lt;body&gt;&lt;center&gt;&lt;h1&gt;301 Moved Permanently&lt;/h1&gt;&lt;/center&gt;&lt;/body&gt;&lt;/html&gt;', 'success');
                }, 400);
            }
        },
        'whois': (args) => {
            const domain = args[1] || 'brieuc-metairie.fr';
            print('Domain Name: ' + domain.toUpperCase());
            print('Registry Domain ID: 8675309');
            print('Registrar WHOIS Server: whois.google.com');
            print('Registrar URL: http://www.google.com');
            print('Registrar: Google LLC');
        },
        'top': () => {
            print('PID USER      PR  NI  VIRT  RES  SHR S  %CPU %MEM    TIME+ COMMAND', 'pre');
            print('  1 root      20   0  1.2g 123m  45m S   0.0  1.2   0:01.23 init', 'pre');
            print(' 42 brieuc    20   0  8.5g 4.2g 1.1g S  12.4 45.1  12:34.56 chrome', 'pre');
        },
        'htop': () => print('CPU[| 23%] MEM[|| 1.2G]'),
        'snake': () => { if (typeof startSnake === 'function') startSnake(); },
        'invaders': () => { if (typeof startInvaders === 'function') startInvaders(); },
        'hack': () => { if (typeof startHack === 'function') startHack(); },
        'tetris': () => { startTetris(); },
        'pong': () => { startPong(); },
        'twofortyeight': () => { start2048(); },
        '2048': () => { start2048(); },
        'minesweeper': () => { startMinesweeper(); },
        'tictactoe': () => { startTicTacToe(); },
        'wordle': () => { startWordle(); },
        'password': (args) => {
            const len = parseInt(args[1]) || 12;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
            let pwd = '';
            for (let i = 0; i < len; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
            print(`Generated Password: ${pwd}`, 'success');
        },
        'sysinfo': () => {
            print('Browser: ' + navigator.userAgent, 'info');
            print('Language: ' + navigator.language, 'info');
            print('Platform: ' + navigator.platform, 'info');
            print('Cores: ' + (navigator.hardwareConcurrency || 'Unknown'), 'info');
        },
        'gui': () => print('GUI? We don\'t do that here. CLI is life. 🐧', 'success'),
        'stats': () => {
            print('--- SESSION STATS ---', 'warn');
            print(`Commands Run: ${commandHistory.length}`, 'info');
            const uptimeS = Math.floor((Date.now() - startTime) / 1000);
            print(`Uptime: ${Math.floor(uptimeS / 60)}m ${uptimeS % 60}s`, 'info');
        },
        'alias': (args) => {
            if (!args[1]) {
                print('Current Aliases:', 'warn');
                Object.keys(aliases).forEach(k => print(`${k}=${aliases[k]}`, 'info'));
            } else {
                const pair = args.slice(1).join(' ').split('=');
                if (pair.length === 2) {
                    aliases[pair[0].trim()] = pair[1].trim();
                    print(`Alias set: ${pair[0]} -> ${pair[1]}`, 'success');
                } else print('Usage: alias <name>=<command>', 'warn');
            }
        },

        'man': (args) => {
            if (!args[1]) {
                print('What manual page do you want? (Usage: man <command>)', 'warn');
            } else {
                const cmdToFind = args[1];
                if (manuals[cmdToFind]) {
                    print('NAME', 'pre');
                    print(`    ${cmdToFind} - ${manuals[cmdToFind]} `, 'info');
                } else {
                    print(`No manual entry for ${cmdToFind}`, 'error');
                }
            }
        },
        'email': () => print('metairiebrieuc@gmail.com', 'info'),
        'credits': () => {
            print('Portfolio created by Brieuc Métairie.', 'success');
            print('Built with HTML, CSS (Variables), and Vanilla JS.', 'info');
            print('Inspired by retro terminals and modern cyber-security UIs.', 'info');
        },
        'echo': (args) => print(args.slice(1).join(' '), 'info'),
        'clear': () => output.innerHTML = '',
        'exit': () => overlay.classList.remove('open'),


        'make': (args) => {
            if (args.slice(1).join(' ') === 'me a sandwich') {
                print('What? Make it yourself.', 'error');
            } else {
                print('make: *** No targets specified and no makefile found. Stop.', 'error');
            }
        },
        // --- RÉSEAU ---
        'traceroute': (args) => {
            const target = args[1] || 'google.com';
            print(`traceroute to ${target}, 30 hops max, 60 byte packets`, 'info');
            let hop = 0;
            const hops = [
                ['192.168.1.1', 'gateway.local'],
                ['10.0.0.1', 'isp-gw.provider.net'],
                ['172.16.0.1', 'core-rtr-01.provider.net'],
                ['82.65.120.1', 'paris-ix.peering.net'],
                ['216.239.48.163', 'par21s17-in-f14.1e100.net']
            ];
            const trInt = setInterval(() => {
                if (hop >= hops.length) {
                    clearInterval(trInt);
                    const ms = (Math.random() * 15 + 5).toFixed(1);
                    print(`${hop + 1}  ${target} (${args[1] ? '93.184.216.34' : '142.250.178.46'})  ${ms} ms`, 'success');
                    print('Trace complete.', 'info');
                    return;
                }
                const [ip, name] = hops[hop];
                const ms1 = (Math.random() * 20 + 1).toFixed(1);
                const ms2 = (Math.random() * 20 + 1).toFixed(1);
                const ms3 = (Math.random() * 20 + 1).toFixed(1);
                print(`${hop + 1}  ${name} (${ip})  ${ms1} ms  ${ms2} ms  ${ms3} ms`);
                hop++;
            }, 400);
        },
        'nslookup': (args) => {
            const domain = args[1] || 'brieuc-metairie.fr';
            const fakeIP = `${Math.floor(Math.random() * 200) + 20}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            print('Server:    8.8.8.8', 'info');
            print('Address:   8.8.8.8#53', 'info');
            print('');
            print('Non-authoritative answer:');
            print(`Name:    ${domain}`);
            print(`Address: ${fakeIP}`, 'success');
            print(`Name:    ${domain}`);
            print(`Address: 2001:4860:4802:32::${Math.floor(Math.random() * 255).toString(16)}`, 'success');
        },
        'ifconfig': () => {
            print('eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500', 'info');
            print('        inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255');
            print('        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20');
            print('        ether 08:00:27:4e:66:a1  txqueuelen 1000');
            print('        RX packets 128456  bytes 124567890 (118.8 MiB)');
            print('        TX packets 98234   bytes 45678901 (43.5 MiB)');
            print('');
            print('wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500', 'info');
            print('        inet 10.0.0.15  netmask 255.255.255.0  broadcast 10.0.0.255');
            print('        ether 5c:e0:c5:a1:b2:c3  txqueuelen 1000');
            print('');
            print('lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536', 'info');
            print('        inet 127.0.0.1  netmask 255.0.0.0');
        },
        'ssh': (args) => {
            const host = args[1] || 'server.local';
            const user = args[2] || 'brieuc';
            print(`Connecting to ${user}@${host}...`, 'info');
            setTimeout(() => {
                print('The authenticity of host cannot be established.', 'warn');
                print(`ECDSA key fingerprint is SHA256:${Array.from({ length: 43 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[Math.floor(Math.random() * 64)]).join('')}.`);
            }, 500);
            setTimeout(() => {
                print('Are you sure you want to continue connecting? (yes/no)', 'warn');
            }, 1000);
            setTimeout(() => {
                print('Warning: Permanently added host to the list of known hosts.', 'info');
                print(`${user}@${host}\'s password: ********`, 'info');
            }, 1800);
            setTimeout(() => {
                print('Connection refused: Firewall blocked the connection.', 'error');
                print('Tip: This is a simulated SSH session 😉', 'warn');
            }, 2800);
        },
        'nmap': (args) => {
            const target = args[1] || '192.168.1.0/24';
            print(`Starting Nmap 7.94 ( https://nmap.org )`, 'info');
            print(`Scanning ${target}...`, 'warn');
            let step = 0;
            const nmapInt = setInterval(() => {
                step++;
                if (step === 1) {
                    print('');
                    print(`Nmap scan report for ${target}`, 'info');
                    print('Host is up (0.0032s latency).', 'success');
                    print('');
                    print('PORT      STATE    SERVICE', 'pre');
                } else if (step === 2) {
                    print('22/tcp    open     ssh', 'pre');
                    print('80/tcp    open     http', 'pre');
                    print('443/tcp   open     https', 'pre');
                } else if (step === 3) {
                    print('3306/tcp  closed   mysql', 'pre');
                    print('8080/tcp  filtered http-proxy', 'pre');
                    print('8443/tcp  open     https-alt', 'pre');
                } else {
                    clearInterval(nmapInt);
                    print('');
                    print('Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds', 'success');
                }
            }, 600);
        },
        // --- SYSTÈME AVANCÉ ---
        'df': () => {
            print('Filesystem      Size  Used Avail Use% Mounted on', 'pre');
            print('/dev/sda1       120G   78G   36G  69% /', 'pre');
            print('/dev/sda2       500G  234G  241G  49% /home', 'pre');
            print('tmpfs           7.8G  1.2G  6.6G  16% /tmp', 'pre');
            print('/dev/sdb1       1.0T  567G  380G  60% /data', 'pre');
        },
        'free': () => {
            print('               total        used        free      shared  buff/cache   available', 'pre');
            print('Mem:        16384000     8567432     3245120      456789     4571448     7234568', 'pre');
            print('Swap:        4096000      234567     3861433', 'pre');
        },
        'uname': (args) => {
            if (args[1] === '-a') {
                print('PortfolioOS brieuc-portfolio 6.1.0-sio #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux', 'info');
            } else {
                print('PortfolioOS', 'info');
            }
        },
        'hostname': () => {
            print('brieuc-portfolio.local', 'info');
        },
        // --- SÉCURITÉ ---
        'hashme': (args) => {
            const text = args.slice(1).join(' ');
            if (!text) { print('Usage: hashme <texte>', 'warn'); return; }
            // Simulated SHA-256 hash
            let hash = '';
            for (let i = 0; i < 64; i++) {
                const charCode = text.charCodeAt(i % text.length);
                hash += ((charCode * 31 + i * 17 + 0xABCD) % 16).toString(16);
            }
            print(`Input:  "${text}"`, 'info');
            print(`SHA-256: ${hash}`, 'success');
        },
        'firewall': () => {
            print('Chain INPUT (policy DROP)', 'warn');
            print('target     prot  source          destination', 'pre');
            print('ACCEPT     tcp   0.0.0.0/0       0.0.0.0/0      tcp dpt:22', 'pre');
            print('ACCEPT     tcp   0.0.0.0/0       0.0.0.0/0      tcp dpt:80', 'pre');
            print('ACCEPT     tcp   0.0.0.0/0       0.0.0.0/0      tcp dpt:443', 'pre');
            print('DROP       tcp   0.0.0.0/0       0.0.0.0/0      tcp dpt:23', 'pre');
            print('DROP       all   10.0.0.0/8      0.0.0.0/0', 'pre');
            print('');
            print('Chain FORWARD (policy DROP)', 'warn');
            print('target     prot  source          destination', 'pre');
            print('ACCEPT     all   192.168.1.0/24  10.0.0.0/24    state RELATED,ESTABLISHED', 'pre');
            print('');
            print('Chain OUTPUT (policy ACCEPT)', 'warn');
            print('target     prot  source          destination', 'pre');
            print('ACCEPT     all   0.0.0.0/0       0.0.0.0/0', 'pre');
        },
        'encrypt': (args) => {
            const text = args.slice(1).join(' ');
            if (!text) { print('Usage: encrypt <texte>', 'warn'); return; }
            const shift = 13; // ROT13
            const encrypted = text.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift) % 26) + 65);
                if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift) % 26) + 97);
                return c;
            }).join('');
            print(`Algorithme : ROT-${shift} (Chiffre de César)`, 'info');
            print(`Original  : "${text}"`, 'info');
            print(`Chiffré   : "${encrypted}"`, 'success');
            print(`Pour déchiffrer : encrypt ${encrypted}`, 'warn');
        }
    };

    let executeCommand = (command) => {
        const args = command.trim().split(' ');
        let cmd = args[0].toLowerCase();

        // Alias Resolution
        if (aliases[cmd]) {
            const expanded = aliases[cmd].split(' ');
            cmd = expanded[0];
            args.splice(0, 1, ...expanded);
        }

        // Command History
        if (commandHistory[commandHistory.length - 1] !== command && command.trim() !== '') {
            commandHistory.push(command);
        }
        const safeCmd = cmd.replace(/[<>]/g, '');
        if (safeCmd !== '') {
            const cmdLine = document.createElement('div');
            cmdLine.className = 'console-input-line';
            cmdLine.innerHTML = `<span class="console-prompt">${document.getElementById('promptPath').innerText}</span> <span style="color:#fff">${safeCmd} ${args.slice(1).join(' ')}</span>`;
            output.appendChild(cmdLine);
        }

        // Execution
        if (cmd === '') return;

        if (COMMANDS[cmd]) {
            COMMANDS[cmd](args);
        } else {
            print(`Command not found: ${command} `, 'error');
        }
    };
    // 4. Event Listeners
    if (trigger) {
        trigger.addEventListener('click', () => {
            overlay.classList.add('open');
            input.focus();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    }

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeCommand(input.value);
                input.value = '';
                historyIndex = -1; // Reset navigation
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const current = input.value.trim();
                if (!current) return;

                const allCmds = [
                    'alias', 'banner', 'calc', 'cat', 'cd', 'clear', 'contact',
                    'credits', 'currency', 'cv', 'date', 'echo', 'email', 'exit',
                    'game', 'gui', 'hack', 'help', 'history', 'invaders', 'ls', 'man',
                    'matrix', 'neofetch', 'password', 'ping', 'pomodoro', 'projects', 'pwd',
                    'reboot', 'shutdown', 'snake', 'social', 'stats', 'sudo', 'sysinfo',
                    'theme', 'todo', 'top', 'uptime', 'weather', 'whoami', 'whois', 'music'
                ];

                const matches = allCmds.filter(c => c.startsWith(current));
                if (matches.length === 1) {
                    input.value = matches[0] + ' ';
                } else if (matches.length > 1) {
                    print(matches.join('   '), 'info');
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (commandHistory.length > 0) {
                    if (historyIndex === -1) historyIndex = commandHistory.length;
                    if (historyIndex > 0) historyIndex--;
                    input.value = commandHistory[historyIndex];
                } else {
                    // No history
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex !== -1 && historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    input.value = '';
                }
            }
        });

        // Draggable Logic
        const makeDraggable = (elmnt) => {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            const header = elmnt.querySelector('.console-header');
            if (header) {
                header.onmousedown = dragMouseDown;
                header.style.cursor = 'grab';
            } else {
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // Get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // Call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
                header.style.cursor = 'grabbing';
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // Calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // Set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                elmnt.style.transform = 'none'; // Disable center transform once moved
            }

            function closeDragElement() {
                // Stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
                header.style.cursor = 'grab';
            }
        };

        const consoleWin = document.querySelector('.console-window');
        if (consoleWin) makeDraggable(consoleWin);
    }
}

// Auto-init specific to console
document.addEventListener('DOMContentLoaded', initConsole);
