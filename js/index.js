// Local data
        let posts = JSON.parse(localStorage.getItem('fuqqzzPosts') || '[]');
        let videos = JSON.parse(localStorage.getItem('fuqqzzVideos') || '[]');
        let keyLink = localStorage.getItem('fuqqzzKeyLink') || 'SEU_LINK_ENCURTADOR_AQUI';
        let keyMode = localStorage.getItem('fuqqzzKeyMode') || 'message';
        let keyMessage = localStorage.getItem('fuqqzzKeyMessage') || 'Em Breve! 📜\n\nAguarde novidades no canal.\nSe inscreva para não perder nenhuma atualização!';
        let channelLink = localStorage.getItem('fuqqzzChannelLink') || 'https://www.youtube.com/@fuqqzz';
        let aboutText = localStorage.getItem('fuqqzzAboutText') || 'Bem-vindo ao FUQQZZ! 🔥\n\nAqui você encontra os melhores scripts e executores para Roblox.\nNão se esqueça de se inscrever no canal para não perder nenhuma novidade!';
        const DEV_PASSWORD = '#z4x5c67';
        let editingPostId = null;
        let isLoggedIn = sessionStorage.getItem('devLoggedIn') === 'true';

        // Live Update System
        let lastUpdateTime = localStorage.getItem('fuqqzzLastUpdate') || Date.now().toString();

        setInterval(() => {
            const currentUpdateTime = localStorage.getItem('fuqqzzLastUpdate');
            if (currentUpdateTime && currentUpdateTime !== lastUpdateTime) {
                lastUpdateTime = currentUpdateTime;
                showUpdateNotification();
            }
        }, 2000);

        function showUpdateNotification() {
            const notification = document.getElementById('updateNotification');
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }

        function reloadPage() {
            location.reload();
        }

        function triggerUpdate() {
            localStorage.setItem('fuqqzzLastUpdate', Date.now().toString());
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'fuqqzzLastUpdate') {
                showUpdateNotification();
            }
        });

        // Atalho secreto: Ctrl + Shift + D
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                checkDevAccess();
            }
            if (e.key === 'Escape') {
                closeDevPanel();
                closeMessage();
            }
        });

        function checkDevAccess() {
            if (!isLoggedIn) {
                document.getElementById('devModal').classList.add('active');
                document.getElementById('devLogin').style.display = 'block';
                document.getElementById('devPanel').style.display = 'none';
                document.getElementById('devEmail').value = '';
                document.getElementById('devPassword').value = '';
                document.getElementById('loginError').style.display = 'none';
                document.getElementById('devEmail').focus();
            } else {
                // Already logged in
                document.getElementById('devModal').classList.add('active');
                document.getElementById('devLogin').style.display = 'none';
                document.getElementById('devPanel').style.display = 'block';
                showDevTab('add');
                updateStats();
                loadSettings();
            }
        }

        function loginDev() {
            const email = document.getElementById('devEmail').value;
            const password = document.getElementById('devPassword').value;
            const errorElement = document.getElementById('loginError');

            if (!email || !password) {
                errorElement.textContent = 'Preencha email e senha!';
                errorElement.style.display = 'block';
                return;
            }

            // Simple password check
            if (password === DEV_PASSWORD) {
                isLoggedIn = true;
                sessionStorage.setItem('devLoggedIn', 'true');
                document.getElementById('devLogin').style.display = 'none';
                document.getElementById('devPanel').style.display = 'block';
                showDevTab('add');
                updateStats();
                loadSettings();
                console.log('Login successful');
            } else {
                errorElement.textContent = 'Senha incorreta!';
                errorElement.style.display = 'block';
            }
        }

        function logout() {
            if (confirm('Deseja sair do painel?')) {
                isLoggedIn = false;
                sessionStorage.removeItem('devLoggedIn');
                closeDevPanel();
                console.log('Logout successful');
            }
        }

        function closeDevPanel() {
            document.getElementById('devModal').classList.remove('active');
        }

        function showTab(tabName) {
            const tabs = document.querySelectorAll('.tab-content');
            const btns = document.querySelectorAll('.tab-btn');
            
            tabs.forEach(tab => tab.classList.remove('active'));
            btns.forEach(btn => btn.classList.remove('active'));
            
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        function showDevTab(tabName) {
            const tabs = document.querySelectorAll('.dev-tab-content');
            const btns = ['devTabAdd', 'devTabVideos', 'devTabManage', 'devTabSettings'];
            
            tabs.forEach(tab => tab.style.display = 'none');
            btns.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.background = 'linear-gradient(45deg, #4a0000, #8b0000)';
            });
            
            document.getElementById('dev' + tabName.charAt(0).toUpperCase() + tabName.slice(1) + 'Tab').style.display = 'block';
            const activeBtn = document.getElementById('devTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
            if (activeBtn) activeBtn.style.background = 'linear-gradient(45deg, #8b0000, #dc143c)';
            
            if (tabName === 'manage') {
                renderManagePosts();
            } else if (tabName === 'settings') {
                updateStats();
            } else if (tabName === 'videos') {
                renderDevVideos();
            }
        }

        function addPost() {
            if (!isLoggedIn) {
                alert('Você precisa estar logado para adicionar posts!');
                return;
            }

            const type = document.getElementById('postType').value;
            const name = document.getElementById('postName').value;
            const desc = document.getElementById('postDesc').value;
            const code = document.getElementById('postCode').value;
            const video = document.getElementById('postVideo').value;

            if (!name || !desc || !code) {
                alert('Preencha todos os campos obrigatórios (Nome, Descrição e Código/Link)!');
                return;
            }

            if (editingPostId) {
                // Edit existing post
                const index = posts.findIndex(p => p.id === editingPostId);
                if (index !== -1) {
                    posts[index] = {
                        id: editingPostId,
                        type: type,
                        name: name,
                        emoji: getRandomEmoji(type),
                        desc: desc,
                        code: code,
                        video: video
                    };
                }
                editingPostId = null;
                alert('✅ Post editado com sucesso!');
            } else {
                // Add new post
                const post = {
                    id: Date.now(),
                    type: type,
                    name: name,
                    emoji: getRandomEmoji(type),
                    desc: desc,
                    code: code,
                    video: video
                };
                posts.push(post);
                alert('✅ Post adicionado com sucesso!');
            }

            localStorage.setItem('fuqqzzPosts', JSON.stringify(posts));
            
            document.getElementById('postName').value = '';
            document.getElementById('postDesc').value = '';
            document.getElementById('postCode').value = '';
            document.getElementById('postVideo').value = '';
            
            renderPosts();
            updateStats();
            triggerUpdate();
        }

        function editPost(id) {
            const post = posts.find(p => p.id === id);
            if (!post) return;

            editingPostId = id;
            document.getElementById('postType').value = post.type;
            document.getElementById('postName').value = post.name;
            document.getElementById('postDesc').value = post.desc;
            document.getElementById('postCode').value = post.code;
            document.getElementById('postVideo').value = post.video || '';

            showDevTab('add');
            alert('Editando post: ' + post.name);
        }

        function deletePost(id) {
            if (confirm('Deseja realmente deletar este post?')) {
                posts = posts.filter(p => p.id !== id);
                localStorage.setItem('fuqqzzPosts', JSON.stringify(posts));
                renderPosts();
                renderManagePosts();
                updateStats();
                triggerUpdate();
            }
        }

        function clearAllPosts() {
            if (confirm('ATENÇÃO: Isso vai deletar TODOS os posts! Tem certeza?')) {
                if (confirm('Última confirmação! Todos os ' + posts.length + ' posts serão deletados permanentemente!')) {
                    posts = [];
                    localStorage.setItem('fuqqzzPosts', JSON.stringify(posts));
                    renderPosts();
                    renderManagePosts();
                    updateStats();
                    triggerUpdate();
                    alert('Todos os posts foram deletados!');
                }
            }
        }

        function renderManagePosts() {
            const filter = document.getElementById('filterType').value;
            const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);
            
            document.getElementById('totalPosts').textContent = filtered.length;

            const list = document.getElementById('managePostsList');
            if (filtered.length === 0) {
                list.innerHTML = '<p style="text-align: center; opacity: 0.6;">Nenhum post encontrado</p>';
            } else {
                list.innerHTML = filtered.map(p => `
                    <div class="manage-post-item">
                        <span class="badge badge-${p.type}">${p.type === 'script' ? '📜 Script' : '⚙️ Executor'}</span>
                        <h4>${p.emoji ? p.emoji + ' ' : ''}${p.name}</h4>
                        <p style="opacity: 0.8; margin: 10px 0;">${p.desc}</p>
                        ${p.video ? `<p style="font-size: 12px; opacity: 0.6;">📺 Vídeo: ${p.video}</p>` : ''}
                        <div style="margin-top: 10px;">
                            <button class="btn" onclick="editPost(${p.id})" style="padding: 8px 15px;">✏️ Editar</button>
                            <button class="btn btn-delete" onclick="deletePost(${p.id})" style="padding: 8px 15px;">🗑️ Deletar</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        function updateStats() {
            const scripts = posts.filter(p => p.type === 'script').length;
            const executors = posts.filter(p => p.type === 'executor').length;
            
            document.getElementById('statsScripts').textContent = scripts;
            document.getElementById('statsExecutors').textContent = executors;
            document.getElementById('statsTotal').textContent = posts.length;
        }

        function toggleKeyMode() {
            const mode = document.getElementById('keyModeSelect').value;
            if (mode === 'message') {
                document.getElementById('keyMessageGroup').style.display = 'block';
                document.getElementById('keyLinkGroup').style.display = 'none';
            } else {
                document.getElementById('keyMessageGroup').style.display = 'none';
                document.getElementById('keyLinkGroup').style.display = 'block';
            }
        }

        function saveKeyMessage() {
            const message = document.getElementById('keyMessageInput').value;
            if (!message) {
                alert('Digite uma mensagem!');
                return;
            }
            keyMessage = message;
            keyMode = 'message';
            localStorage.setItem('fuqqzzKeyMessage', message);
            localStorage.setItem('fuqqzzKeyMode', 'message');
            triggerUpdate();
            alert('Mensagem salva com sucesso!');
        }

        function saveKeyLink() {
            const link = document.getElementById('keyLinkInput').value;
            if (!link) {
                alert('Digite um link válido!');
                return;
            }
            keyLink = link;
            keyMode = 'link';
            localStorage.setItem('fuqqzzKeyLink', link);
            localStorage.setItem('fuqqzzKeyMode', 'link');
            triggerUpdate();
            alert('Link da key salvo com sucesso!');
        }

        function saveChannelLink() {
            const link = document.getElementById('channelLinkInput').value;
            if (!link) {
                alert('Digite um link válido!');
                return;
            }
            channelLink = link;
            localStorage.setItem('fuqqzzChannelLink', link);
            updateChannelInfo();
            triggerUpdate();
            alert('Link do canal salvo com sucesso!');
        }

        function saveAboutText() {
            const text = document.getElementById('aboutTextInput').value;
            if (!text) {
                alert('Digite uma descrição!');
                return;
            }
            aboutText = text;
            localStorage.setItem('fuqqzzAboutText', text);
            updateChannelInfo();
            triggerUpdate();
            alert('Descrição do canal salva com sucesso!');
        }

        function updateChannelInfo() {
            document.getElementById('aboutText').textContent = aboutText;
            document.getElementById('channelButton').href = channelLink;
        }

        function loadSettings() {
            document.getElementById('keyLinkInput').value = keyLink;
            document.getElementById('keyMessageInput').value = keyMessage;
            document.getElementById('keyModeSelect').value = keyMode;
            document.getElementById('channelLinkInput').value = channelLink;
            document.getElementById('aboutTextInput').value = aboutText;
            toggleKeyMode();
        }

        function handleKeyAction() {
            if (keyMode === 'message') {
                showMessage();
            } else {
                window.open(keyLink, '_blank');
            }
        }

        function showMessage() {
            document.getElementById('messageText').textContent = keyMessage;
            document.getElementById('messageModal').classList.add('active');
        }

        function closeMessage() {
            document.getElementById('messageModal').classList.remove('active');
        }

        // Close message on click outside
        document.getElementById('messageModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'messageModal') {
                closeMessage();
            }
        });

        function exportData() {
            const data = {
                posts: posts,
                videos: videos,
                keyLink: keyLink,
                keyMode: keyMode,
                keyMessage: keyMessage,
                channelLink: channelLink,
                aboutText: aboutText,
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fuqqzz-backup-' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            URL.revokeObjectURL(url);
            alert('Backup exportado com sucesso!');
        }

        function importData(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (confirm('Importar dados? Isso vai SUBSTITUIR todos os dados atuais!')) {
                        posts = data.posts || [];
                        videos = data.videos || [];
                        keyLink = data.keyLink || keyLink;
                        keyMode = data.keyMode || keyMode;
                        keyMessage = data.keyMessage || keyMessage;
                        channelLink = data.channelLink || channelLink;
                        aboutText = data.aboutText || aboutText;
                        
                        localStorage.setItem('fuqqzzPosts', JSON.stringify(posts));
                        localStorage.setItem('fuqqzzVideos', JSON.stringify(videos));
                        localStorage.setItem('fuqqzzKeyLink', keyLink);
                        localStorage.setItem('fuqqzzKeyMode', keyMode);
                        localStorage.setItem('fuqqzzKeyMessage', keyMessage);
                        localStorage.setItem('fuqqzzChannelLink', channelLink);
                        localStorage.setItem('fuqqzzAboutText', aboutText);
                        
                        renderPosts();
                        renderVideos();
                        updateStats();
                        loadSettings();
                        updateChannelInfo();
                        triggerUpdate();
                        alert('Dados importados com sucesso!');
                    }
                } catch (err) {
                    alert('Erro ao importar dados: arquivo inválido!');
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        }

        function copyCode(code) {
            navigator.clipboard.writeText(code).then(() => {
                alert('Código copiado!');
            });
        }

        function getRandomEmoji(type) {
            const scriptEmojis = ['🔥', '⚡', '💎', '🎮', '🚀', '⭐', '💫', '✨', '🌟', '💥', '🎯', '🏆', '👑', '🔮', '🎪', '🎨'];
            const executorEmojis = ['⚙️', '🛠️', '🔧', '⚔️', '🗡️', '🛡️', '🎭', '🎪', '🎯', '💻', '🖥️', '📡', '🔌', '⚡', '💡', '🔋'];
            
            const emojis = type === 'script' ? scriptEmojis : executorEmojis;
            return emojis[Math.floor(Math.random() * emojis.length)];
        }

        function getYouTubeVideoId(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        }

        function addVideo() {
            if (!isLoggedIn) {
                alert('Você precisa estar logado para adicionar vídeos!');
                return;
            }

            const url = document.getElementById('videoUrlInput').value.trim();
            if (!url) {
                alert('Cole o link do vídeo!');
                return;
            }

            const videoId = getYouTubeVideoId(url);
            if (!videoId) {
                alert('❌ Link inválido! Use um link do YouTube válido.');
                return;
            }

            // Check if video already exists
            if (videos.some(v => v.id === videoId)) {
                alert('⚠️ Este vídeo já foi adicionado!');
                return;
            }

            const video = {
                id: videoId,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                addedDate: new Date().toISOString()
            };

            videos.unshift(video); // Add to beginning
            localStorage.setItem('fuqqzzVideos', JSON.stringify(videos));
            
            document.getElementById('videoUrlInput').value = '';
            renderVideos();
            renderDevVideos();
            triggerUpdate();
            alert('✅ Vídeo adicionado com sucesso!');
        }

        function deleteVideo(videoId) {
            if (confirm('Deseja deletar este vídeo?')) {
                videos = videos.filter(v => v.id !== videoId);
                localStorage.setItem('fuqqzzVideos', JSON.stringify(videos));
                renderVideos();
                renderDevVideos();
                triggerUpdate();
            }
        }

        function clearAllVideos() {
            if (confirm('ATENÇÃO: Isso vai deletar TODOS os vídeos! Tem certeza?')) {
                if (confirm('Última confirmação! Todos os ' + videos.length + ' vídeos serão deletados!')) {
                    videos = [];
                    localStorage.setItem('fuqqzzVideos', JSON.stringify(videos));
                    renderVideos();
                    renderDevVideos();
                    triggerUpdate();
                    alert('Todos os vídeos foram deletados!');
                }
            }
        }

        function renderVideos() {
            const videosList = document.getElementById('videosList');
            if (videos.length === 0) {
                videosList.innerHTML = '<p style="text-align: center; opacity: 0.6; grid-column: 1/-1;">Nenhum vídeo adicionado ainda</p>';
            } else {
                videosList.innerHTML = videos.map(v => `
                    <div class="video-card" onclick="window.open('${v.url}', '_blank')">
                        <img src="${v.thumbnail}" alt="Thumbnail" class="video-thumbnail" onerror="this.src='https://img.youtube.com/vi/${v.id}/hqdefault.jpg'">
                        <div class="video-info">
                            <div class="video-title">Vídeo do Canal 🎬</div>
                            <div class="video-date">📅 ${new Date(v.addedDate).toLocaleDateString('pt-BR')}</div>
                        </div>
                    </div>
                `).join('');
            }
        }

        function renderDevVideos() {
            const list = document.getElementById('devVideosList');
            document.getElementById('videoCount').textContent = videos.length;
            
            if (videos.length === 0) {
                list.innerHTML = '<p style="text-align: center; opacity: 0.6;">Nenhum vídeo cadastrado</p>';
            } else {
                list.innerHTML = videos.map(v => `
                    <div class="manage-post-item">
                        <img src="${v.thumbnail}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;" onerror="this.src='https://img.youtube.com/vi/${v.id}/hqdefault.jpg'" alt="Thumbnail">
                        <p style="opacity: 0.8;">📅 Adicionado em: ${new Date(v.addedDate).toLocaleDateString('pt-BR')}</p>
                        <p style="opacity: 0.6; font-size: 12px; word-break: break-all; margin-top: 5px;">${v.url}</p>
                        <div style="margin-top: 10px;">
                            <button class="btn" onclick="window.open('${v.url}', '_blank')" style="padding: 8px 15px;">🎬 Ver Vídeo</button>
                            <button class="btn btn-delete" onclick="deleteVideo('${v.id}')" style="padding: 8px 15px;">🗑️ Deletar</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        function renderPosts() {
            const scripts = posts.filter(p => p.type === 'script');
            const executors = posts.filter(p => p.type === 'executor');

            // Render Scripts
            const scriptsList = document.getElementById('scriptsList');
            if (scripts.length === 0) {
                scriptsList.innerHTML = '<p style="text-align: center; opacity: 0.6;">Nenhum script adicionado ainda</p>';
            } else {
                scriptsList.innerHTML = scripts.map(s => {
                    const emoji = s.emoji || getRandomEmoji('script');
                    return `
                    <div class="item">
                        <h4><span class="emoji-icon">${emoji}</span>${s.name}</h4>
                        <p>${s.desc}</p>
                        ${s.video ? `<a href="${s.video}" target="_blank" class="video-link">📺 Ver vídeo</a><br>` : ''}
                        <code>${s.code}</code>
                        <button class="btn" onclick="copyCode(\`${s.code.replace(/`/g, '\\`')}\`)">Copiar Script</button>
                    </div>
                `;
                }).join('');
            }

            // Render Executors
            const executorsList = document.getElementById('executorsList');
            if (executors.length === 0) {
                executorsList.innerHTML = '<p style="text-align: center; opacity: 0.6; grid-column: 1/-1;">Nenhum executor adicionado ainda</p>';
            } else {
                executorsList.innerHTML = executors.map(e => {
                    const emoji = e.emoji || getRandomEmoji('executor');
                    return `
                    <div class="item">
                        <h4><span class="emoji-icon">${emoji}</span>${e.name}</h4>
                        <p>${e.desc}</p>
                        ${e.video ? `<a href="${e.video}" target="_blank" class="video-link">📺 Ver vídeo</a><br>` : ''}
                        <button class="btn" onclick="window.open('${e.code}', '_blank')">Download</button>
                    </div>
                `;
                }).join('');
            }
        }

        // Initial render
        renderPosts();
        renderVideos();
        updateChannelInfo();

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('devModal').classList.remove('active');
            }
        });
