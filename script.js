const carrinhoContainer = document.querySelector('.itens-carrinho');
const botaoFinalizar = document.querySelector('.btn-finalizar');
const carrinhoDiv = document.getElementById('carrinho');
const modalAuth = document.getElementById('modal-auth');
const btnLoginTrigger = document.getElementById('btn-login-trigger');
const formAuth = document.getElementById('form-auth');
const linkAlternar = document.getElementById('link-alternar-auth');
const userGreeting = document.getElementById('user-greeting');
const btnFecharAuth = document.querySelector('.btn-cancelar-auth');

let usuarioLogado = false;
let modoLogin = true; 
let carrinho = [];
let usuariosCadastrados = []; 

// --- UTILITÁRIOS ---
function showToast(message) {
    let toast = document.querySelector('.toast') || document.createElement('div');
    if (!toast.classList.contains('toast')) {
        toast.classList.add('toast');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    carrinhoDiv.classList.add('pulse');
    setTimeout(() => {
        toast.classList.remove('show');
        carrinhoDiv.classList.remove('pulse');
    }, 2000);
}

const formatPrice = (price) => price.toFixed(2).replace('.', ',');

// --- VALIDAÇÕES ---
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    return ((soma * 10) % 11 % 10) === parseInt(cpf.substring(10, 11));
}

function validarLuhn(numero) {
    let nCheck = 0, bEven = false;
    numero = numero.replace(/\D/g, "");
    for (let n = numero.length - 1; n >= 0; n--) {
        let cDigit = numero.charAt(n), nDigit = parseInt(cDigit, 10);
        if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
        nCheck += nDigit;
        bEven = !bEven;
    }
    return (nCheck % 10) === 0 && numero.length >= 13;
}

// --- LÓGICA DO CARRINHO ---
function atualizarCarrinho() {
    carrinhoContainer.innerHTML = '';
    const secaoPagamento = document.getElementById('secao-pagamento');
    
    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = '<p>O carrinho está vazio.</p>';
        if(secaoPagamento) secaoPagamento.style.display = 'none';
    } else {
        if(secaoPagamento) secaoPagamento.style.display = 'block';
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
}

// --- ESCUTADOR GLOBAL (RESOLVE O PROBLEMA DE NÃO ADICIONAR) ---
document.addEventListener('click', (e) => {
    // 1. Clique em Remover
    if (e.target.classList.contains('btn-remover')) {
        carrinho.splice(e.target.dataset.index, 1);
        atualizarCarrinho();
        return;
    }

    // 2. Clique em Comprar (Produtos ou Serviços)
    if (e.target.classList.contains('btn-comprar') || e.target.classList.contains('btn-contratar')) {
        if (!usuarioLogado) return abrirModalAuth();

        let nome, precoTexto;
        
        // Se for produto
        const cardProduto = e.target.closest('.produto');
        if (cardProduto) {
            nome = cardProduto.querySelector('.nome-produto').textContent.trim();
            precoTexto = cardProduto.querySelector('.preco-produto').textContent;
        }

        // Se for serviço (ajustado para as classes do seu vídeo/HTML)
        const cardServico = e.target.closest('.servico-card') || e.target.closest('.servico');
        if (cardServico) {
            nome = cardServico.querySelector('h3')?.textContent.trim() || cardServico.querySelector('.servico-nome')?.textContent.trim();
            precoTexto = cardServico.querySelector('p')?.textContent.trim() || cardServico.querySelector('.servico-preco')?.textContent.trim();
        }

        if (nome && precoTexto) {
            const preco = parseFloat(precoTexto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
            carrinho.push({ nome, preco });
            atualizarCarrinho();
            showToast(`"${nome}" adicionado!`);
            carrinhoDiv.classList.add('ativo');
        }
    }
});

// --- AUTENTICAÇÃO ---
const fecharModalAuth = () => modalAuth.style.display = 'none';
const abrirModalAuth = () => modalAuth.style.display = 'flex';

linkAlternar.addEventListener('click', (e) => {
    e.preventDefault();
    modoLogin = !modoLogin;
    document.getElementById('auth-title').textContent = modoLogin ? 'Entrar' : 'Cadastrar';
    document.getElementById('btn-auth-acao').textContent = modoLogin ? 'Entrar' : 'Cadastrar';
    linkAlternar.textContent = modoLogin ? 'Criar Conta' : 'Fazer Login';
});

formAuth.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const senha = document.getElementById('auth-senha').value.trim();

    if (!modoLogin) {
        usuariosCadastrados.push({ email, senha });
        alert("Conta criada! Faça login.");
        formAuth.reset();
        linkAlternar.click();
    } else {
        const user = usuariosCadastrados.find(u => u.email === email && u.senha === senha);
        if (user) {
            usuarioLogado = true;
            userGreeting.textContent = email.split('@')[0];
            btnLoginTrigger.style.display = 'none';
            fecharModalAuth();
            showToast("Bem-vindo!");
        } else {
            alert("E-mail ou senha incorretos!");
        }
    }
});

// --- FINALIZAÇÃO ---
botaoFinalizar.addEventListener('click', (e) => {
    e.stopPropagation();
    if (carrinho.length === 0) return showToast('Carrinho vazio!');
    const metodo = document.getElementById('metodo-pagamento').value;
    if (!metodo) return alert("Selecione o pagamento!");

    if (metodo === 'Pix') {
        const cpf = document.getElementById('pix-cpf').value;
        if (!validarCPF(cpf)) return alert("CPF Inválido!");
    } else if (metodo === 'Cartão') {
        const num = document.getElementById('cartao-numero').value;
        if (!validarLuhn(num)) return alert("Cartão inválido!");
    }

    alert("🎉 Pagamento confirmado!");
    carrinho = [];
    atualizarCarrinho();
    carrinhoDiv.classList.remove('ativo');
});

function alternarCamposPagamento() {
    const m = document.getElementById('metodo-pagamento').value;
    document.getElementById('campos-pix').style.display = (m === 'Pix') ? 'block' : 'none';
    document.getElementById('campos-cartao').style.display = (m === 'Cartão') ? 'block' : 'none';
}

carrinhoDiv.addEventListener('click', (e) => {
    if (!e.target.closest('input, select, label, .btn-remover, button')) {
        carrinhoDiv.classList.toggle('ativo');
    }
});

btnLoginTrigger.addEventListener('click', abrirModalAuth);
btnFecharAuth.addEventListener('click', fecharModalAuth);
document.addEventListener('DOMContentLoaded', atualizarCarrinho);