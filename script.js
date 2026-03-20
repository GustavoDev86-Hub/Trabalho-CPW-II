// Elementos do DOM existentes
const botoesComprar = document.querySelectorAll('.btn-comprar');
const botoesContratar = document.querySelectorAll('.btn-contratar');
const carrinhoContainer = document.querySelector('.itens-carrinho');
const botaoFinalizar = document.querySelector('.btn-finalizar');
const carrinhoDiv = document.getElementById('carrinho');

// Novos elementos de Autenticação
const modalAuth = document.getElementById('modal-auth');
const btnLoginTrigger = document.getElementById('btn-login-trigger');
const formAuth = document.getElementById('form-auth');
const linkAlternar = document.getElementById('link-alternar-auth');
const userGreeting = document.getElementById('user-greeting');
const btnFecharAuth = document.querySelector('.btn-cancelar-auth');

// Variáveis de Estado
let usuarioLogado = false;
let modoLogin = true; // true = login, false = cadastro
let carrinho = [];
let itemAguardandoConfirmacao = null;

// FUNÇÕES DE INTERFACE (TOAST, POPUP, CARRINHO) 

function setupToast() {
    let existingToast = document.querySelector('.toast');
    if (!existingToast) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        document.body.appendChild(toast);
        return toast;
    }
    return existingToast;
}

function showToast(message) {
    const toast = setupToast();
    toast.textContent = message;
    toast.classList.add('show');
    pulseCarrinho();
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function formatPrice(price) {
    return price.toFixed(2).replace('.', ',');
}

function pulseCarrinho() {
    carrinhoDiv.classList.add('pulse');
    setTimeout(() => {
        carrinhoDiv.classList.remove('pulse');
    }, 300);
}

function atualizarCarrinho() {
    carrinhoContainer.innerHTML = '';
    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = '<p>O carrinho está vazio.</p>';
    }

    let total = 0;
    carrinho.forEach((item, index) => {
        const itemCarrinho = document.createElement('div');
        itemCarrinho.classList.add('item-carrinho');
        itemCarrinho.innerHTML = `
            <span>${item.nome}</span>
            <span class="item-preco">R$ ${formatPrice(item.preco)}</span>
            <button class="btn-remover" data-index="${index}">Remover</button>
        `;
        carrinhoContainer.appendChild(itemCarrinho);
        total += item.preco;
    });

    if (carrinho.length > 0) {
        const totalDiv = document.createElement('div');
        totalDiv.classList.add('total-carrinho');
        totalDiv.innerHTML = `<hr><strong>Total: R$ ${formatPrice(total)}</strong>`;
        carrinhoContainer.appendChild(totalDiv);
    }

    document.querySelectorAll('.btn-remover').forEach(btn => {
        btn.onclick = (e) => {
            const index = e.target.dataset.index;
            carrinho.splice(index, 1);
            atualizarCarrinho();
            showToast('Item removido.');
        };
    });
}

function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinho();
    showToast(`"${nome}" adicionado!`);
}

//LÓGICA DE AUTENTICAÇÃO 

function abrirModalAuth() {
    modalAuth.style.display = 'flex';
}

function fecharModalAuth() {
    modalAuth.style.display = 'none';
}

// Interceptor: Valida se pode realizar a ação
function validarAcesso(acao) {
    if (usuarioLogado) {
        acao();
    } else {
        showToast("Acesse sua conta para comprar.");
        abrirModalAuth();
    }
}

// Alternar entre Login e Cadastro
linkAlternar.addEventListener('click', (e) => {
    e.preventDefault();
    modoLogin = !modoLogin;
    document.getElementById('auth-title').textContent = modoLogin ? 'Entrar no Mundo Pet' : 'Criar Nova Conta';
    document.getElementById('btn-auth-acao').textContent = modoLogin ? 'Entrar' : 'Cadastrar';
    document.getElementById('auth-text').textContent = modoLogin ? 'Não tem uma conta?' : 'Já possui conta?';
    linkAlternar.textContent = modoLogin ? 'Criar Conta' : 'Fazer Login';
});

// Simular Login/Cadastro
formAuth.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    
    usuarioLogado = true;
    userGreeting.textContent = `Olá, ${email.split('@')[0]}!`;
    btnLoginTrigger.style.display = 'none';
    fecharModalAuth();
    showToast("Bem-vindo ao Mundo Pet!");
});

btnLoginTrigger.addEventListener('click', abrirModalAuth);
btnFecharAuth.addEventListener('click', fecharModalAuth);

// --- EVENTOS DE COMPRA E SERVIÇOS ---

botoesComprar.forEach(botao => {
    botao.addEventListener('click', (e) => {
        validarAcesso(() => {
            const produto = e.target.closest('.produto');
            const nome = produto.querySelector('.nome-produto').textContent.trim();
            let precoTexto = produto.querySelector('.preco-produto').textContent;
            const preco = parseFloat(precoTexto.replace('R$', '').trim().replace(',', '.'));

            if (!isNaN(preco)) {
                adicionarAoCarrinho(nome, preco);
                if (!carrinhoDiv.classList.contains('ativo')) carrinhoDiv.classList.add('ativo');
            }
        });
    });
});

// Confirmação de serviço (Popup)
function showConfirmationPopup(nome, preco) {
    const popupFundo = document.querySelector('.popup-fundo');
    const popupMensagem = document.querySelector('.popup-mensagem');
    const btnConfirmar = document.querySelector('.btn-confirmar');
    const btnCancelar = document.querySelector('.btn-cancelar');

    popupMensagem.innerHTML = `Deseja contratar <strong>${nome}</strong> por <strong>R$ ${formatPrice(preco)}</strong>?`;
    
    btnConfirmar.onclick = () => {
        adicionarAoCarrinho(nome, preco);
        popupFundo.style.display = 'none';
    };

    btnCancelar.onclick = () => {
        popupFundo.style.display = 'none';
    };

    popupFundo.style.display = 'flex';
}

botoesContratar.forEach(botao => {
    botao.addEventListener('click', () => {
        validarAcesso(() => {
            const nome = botao.dataset.servico;
            const preco = parseFloat(botao.dataset.preco);
            showConfirmationPopup(nome, preco);
        });
    });
});

// Finalizar
botaoFinalizar.addEventListener('click', () => {
    if (carrinho.length === 0) return showToast('Carrinho vazio!');
    
    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    alert(`🎉 Compra finalizada!\nTotal: R$ ${formatPrice(total)}`);
    carrinho = [];
    atualizarCarrinho();
    carrinhoDiv.classList.remove('ativo');
});

// Toggle Carrinho
carrinhoDiv.addEventListener('click', (event) => {
    if (!event.target.closest('button')) {
        carrinhoDiv.classList.toggle('ativo');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho();
});