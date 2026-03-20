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
let usuariosCadastrados = []; // "Banco de dados" local

// --- FUNÇÕES DE INTERFACE (TOAST, FORMATAÇÃO) ---

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

    document.querySelectorAll('.btn-remover').forEach(btn => {
        btn.onclick = (e) => {
            const index = e.target.dataset.index;
            carrinho.splice(index, 1);
            atualizarCarrinho();
        };
    });
}

function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinho();
    showToast(`"${nome}" adicionado!`);
}

// --- LÓGICA DE PAGAMENTO (MOSTRAR/ESCONDER CAMPOS) ---

function alternarCamposPagamento() {
    const metodo = document.getElementById('metodo-pagamento').value;
    const divPix = document.getElementById('campos-pix');
    const divCartao = document.getElementById('campos-cartao');

    if(divPix) divPix.style.display = (metodo === 'Pix') ? 'block' : 'none';
    if(divCartao) divCartao.style.display = (metodo === 'Cartão') ? 'block' : 'none';
}

// --- LÓGICA DE AUTENTICAÇÃO ---

function abrirModalAuth() {
    modalAuth.style.display = 'flex';
}

function fecharModalAuth() {
    modalAuth.style.display = 'none';
}

function validarAcesso(acao) {
    if (usuarioLogado) {
        acao();
    } else {
        showToast("Acesse sua conta para comprar.");
        abrirModalAuth();
    }
}

linkAlternar.addEventListener('click', (e) => {
    e.preventDefault();
    modoLogin = !modoLogin;
    document.getElementById('auth-title').textContent = modoLogin ? 'Entrar no Mundo Pet' : 'Criar Nova Conta';
    document.getElementById('btn-auth-acao').textContent = modoLogin ? 'Entrar' : 'Cadastrar';
    document.getElementById('auth-text').textContent = modoLogin ? 'Não tem uma conta?' : 'Já possui conta?';
    linkAlternar.textContent = modoLogin ? 'Criar Conta' : 'Fazer Login';
});

formAuth.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const senha = document.getElementById('auth-senha').value.trim();

    if (email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    if (!modoLogin) {
        usuariosCadastrados.push({ email, senha });
        alert("Conta criada com sucesso! Agora faça login.");
        linkAlternar.click(); 
    } else {
        const usuarioExiste = usuariosCadastrados.find(u => u.email === email && u.senha === senha);
        if (usuarioExiste) {
            usuarioLogado = true;
            userGreeting.textContent = `Olá, ${email.split('@')[0]}!`;
            btnLoginTrigger.style.display = 'none';
            fecharModalAuth();
            showToast("Bem-vindo de volta!");
        } else {
            alert("Erro: E-mail ou senha incorretos!");
        }
    }
});

btnLoginTrigger.addEventListener('click', abrirModalAuth);
btnFecharAuth.addEventListener('click', fecharModalAuth);

// --- EVENTOS DE COMPRA E FINALIZAÇÃO ---

botoesComprar.forEach(botao => {
    botao.addEventListener('click', (e) => {
        validarAcesso(() => {
            const produto = e.target.closest('.produto');
            const nome = produto.querySelector('.nome-produto').textContent.trim();
            let precoTexto = produto.querySelector('.preco-produto').textContent;
            const preco = parseFloat(precoTexto.replace('R$', '').trim().replace(',', '.'));
            adicionarAoCarrinho(nome, preco);
            if (!carrinhoDiv.classList.contains('ativo')) carrinhoDiv.classList.add('ativo');
        });
    });
});

botaoFinalizar.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (carrinho.length === 0) return showToast('Carrinho vazio!');
    if (!usuarioLogado) return abrirModalAuth();

    const metodo = document.getElementById('metodo-pagamento').value;
    if (metodo === "") return alert("Selecione uma forma de pagamento!");

    // VALIDAÇÃO GIGANTESCA DE DADOS
    if (metodo === 'Pix') {
        const cpf = document.getElementById('pix-cpf').value.trim();
        if (cpf.length < 11) return alert("CPF inválido para o Pix!");
    } else if (metodo === 'Cartão') {
        const num = document.getElementById('cartao-numero').value.trim();
        const cvv = document.getElementById('cartao-cvv').value.trim();
        if (num.length < 13 || cvv.length < 3) return alert("Dados do cartão incompletos!");
    }

    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    alert(`🎉 Sucesso!\nPagamento via ${metodo} confirmado.\nTotal: R$ ${formatPrice(total)}`);
    
    carrinho = [];
    document.getElementById('metodo-pagamento').value = "";
    atualizarCarrinho();
    carrinhoDiv.classList.remove('ativo');
});

// Outros eventos atualizados
carrinhoDiv.addEventListener('click', (event) => {
    // Se o clique for em um input, select ou label, não faz nada (não fecha o carrinho)
    if (event.target.closest('input') || 
        event.target.closest('select') || 
        event.target.closest('label') || 
        event.target.closest('.btn-remover')) {
        return;
    }
    
    // Abre/Fecha apenas se clicar no título ou na área vazia (não em botões)
    if (!event.target.closest('button')) {
        carrinhoDiv.classList.toggle('ativo');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho();
});