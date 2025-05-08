// Acumuladora de orçamentos
let orcamentosGerados = [];

// Função para calcular a área de um cômodo
function calcularArea(largura, comprimento) {
    return largura * comprimento;
}

// Função para calcular a quantidade de cruzetas com base no tamanho do piso
function calcularCruzetas(area, tamanho) {
    const multiplicadores = { 1: 6, 2: 10, 3: 22 }; // Multiplicadores para tamanhos de piso
    return multiplicadores[tamanho] ? area * multiplicadores[tamanho] : 0;
}

// Referências aos elementos HTML
const comodosInput = document.getElementById('comodos');
const inputsDiv = document.getElementById('campos-nome-comodos');

// Adiciona event listeners aos inputs de nomeação
document.querySelectorAll('input[name="nomear"]').forEach(radio => {
    radio.addEventListener('change', atualizarCampos); // Chama atualizarCampos quando mudar a seleção
});

// Adiciona listener ao input de quantidade de cômodos
comodosInput.addEventListener('input', atualizarCampos);

// Função que atualiza os campos para nomear os cômodos
function atualizarCampos() {
    const desejaNomear = document.querySelector('input[name="nomear"]:checked').value === 'sim';
    const quantidade = parseInt(comodosInput.value);
    inputsDiv.innerHTML = ""; // Limpa os inputs anteriores
    inputsDiv.style.display = "block"; // Garante que apareça

    // Se o usuário deseja nomear os cômodos e a quantidade é maior que 1
    if (desejaNomear && quantidade > 1) {
        // Cria o botão de fechar
        const botaoFechar = document.createElement("button");
        botaoFechar.textContent = "X";
        botaoFechar.className = "fechar-botao";
        botaoFechar.onclick = () => {
            inputsDiv.style.display = "none"; // Esconde os campos ao clicar no botão
        };
        inputsDiv.appendChild(botaoFechar);

        // Título opcional
        const titulo = document.createElement("h3");
        titulo.textContent = "Nomeie os cômodos:";
        inputsDiv.appendChild(titulo);

        // Cria os campos para nomear os cômodos
        for (let i = 1; i <= quantidade; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Nome do Cômodo ${i}`;
            input.className = 'comodo-input';
            input.name = `comodo_${i}`;
            inputsDiv.appendChild(input);
            inputsDiv.appendChild(document.createElement('br'));
        }
    }
}

// Função para calcular o orçamento do assentamento de piso
function calcularOrcamento() {
    const nomeCliente = document.getElementById('nome').value;
    const comodos = parseInt(document.getElementById('comodos').value);
    const desejaNomear = document.querySelector('input[name="nomear"]:checked').value === 'sim';
    
    let totais = { area: 0, argamassa: 0, cruzetas: 0 };
    let detalhes = [];

    // Calcula os valores para cada cômodo
    for (let i = 0; i < comodos; i++) {
        let nomeComodo = `Cômodo ${i + 1}`; // Inicializa o nome do cômodo como "Cômodo X"
        
        // Verifica se o usuário nomeou o cômodo
        if (desejaNomear && comodos > 1) {
            const inputNome = document.querySelector(`input[name="comodo_${i + 1}"]`);
            if (inputNome && inputNome.value.trim() !== "") {
                nomeComodo = inputNome.value.trim(); // Atribui o nome digitado pelo usuário
            }
        }

        // Coleta as medidas e informações do usuário
        const largura = parseFloat(prompt(`Digite a largura do "${nomeComodo}" (em metros):`));
        const comprimento = parseFloat(prompt(`Digite o comprimento do "${nomeComodo}" (em metros):`));
        const tamanhoPiso = parseInt(prompt("Escolha o tamanho do piso (1 - 60x60, 2 - 45x45, 3 - 30x30):"));

        // Calcula os valores com as funções já definidas
        const area = calcularArea(largura, comprimento);
        totais.area += area;

        const argamassa = (area * 5) / 20.2;
        totais.argamassa += argamassa;

        const cruzetas = calcularCruzetas(area, tamanhoPiso);
        totais.cruzetas += cruzetas;

        // Adiciona os detalhes do orçamento para o cômodo
        detalhes.push(`
            ${nomeComodo}:
            Área: ${area.toFixed(2)} m²
            Argamassa: ${argamassa.toFixed(2)} sacos
            Cruzetas: ${cruzetas} unidades
        `);
    }

    // Adiciona o orçamento gerado à lista de orçamentos acumulados
    orcamentosGerados.push({
        servico: "Assentamento de Piso",
        nomeCliente: nomeCliente,
        detalhes: detalhes.join("\n"),
        totais: totais
    });

    // Exibe o orçamento gerado
    exibirResumoOrcamento(nomeCliente, totais, detalhes);

    // Pergunta se o usuário deseja continuar com outro orçamento
    const continuar = confirm("Deseja fazer outro orçamento?\nClique em OK para continuar ou Cancelar para finalizar.");
    if (continuar) {
        limparCampos(); // Limpa os campos e vai para o menu principal
    } else {
        mostrarResumoFinal(); // Mostra o resumo final dos orçamentos
    }
}

// Função para exibir o resumo do orçamento
function exibirResumoOrcamento(nomeCliente, totais, detalhes) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <h2>Resumo do Orçamento</h2>
        <p>Nome do Cliente: ${nomeCliente}</p>
        <p>Área Total: ${totais.area.toFixed(2)} m²</p>
        <p>Argamassa: ${totais.argamassa.toFixed(2)} sacos de 20Kg</p>
        <p>Cruzetas: ${totais.cruzetas} unidades</p>
        <h3>Detalhes:</h3>
        <pre>${detalhes.join("\n")}</pre>
    `;
}

// Função para mostrar o resumo final de todos os orçamentos
function mostrarResumoFinal() {
    let resumoFinal = "<h2>Resumo de Todos os Orçamentos:</h2>";
    orcamentosGerados.forEach((orcamento, index) => {
        resumoFinal += `
            <h3>Orçamento #${index + 1} - Cliente: ${orcamento.servico}</h3>
            <p>Área Total: ${orcamento.totais.area.toFixed(2)} m²</p>
            <p>Argamassa: ${orcamento.totais.argamassa.toFixed(2)} sacos de 20Kg</p>
            <p>Cruzetas: ${orcamento.totais.cruzetas} unidades</p>
            <h4>Detalhes:</h4>
            <pre>${orcamento.detalhes}</pre>
        `;
    });
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = resumoFinal;
}

// Função para limpar os campos e voltar ao menu principal
function limparCampos() {
    // Limpa o formulário sem afetar os orçamentos acumulados
    document.getElementById('orcamento-form').reset();
    inputsDiv.innerHTML = ""; // Limpa os campos de nomeação dos cômodos
}

// Função para gerar o PDF do orçamento

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const resultadoDiv = document.getElementById('resultado');

    html2canvas(resultadoDiv).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pageWidth - 40;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Logo (se quiser adicionar no topo)
        pdf.addImage('logoOrcaFacil.jpeg', 'JPEG', 10, 10, 40, 20);

        // Título
        pdf.setFontSize(16);
        pdf.text('Resumo de Orçamento - OrçaFácil', 55, 25);

        // Data e nome do cliente
        const nome = document.getElementById('nome').value || '---';
        const dataHora = new Date().toLocaleString();
        pdf.setFontSize(12);
        pdf.text(`Cliente: ${nome}`, 10, 40);
        pdf.text(`Data: ${dataHora}`, 10, 48);

        // Inserir a imagem do resumo do orçamento
        pdf.addImage(imgData, 'PNG', 10, 60, pdfWidth, pdfHeight);

        // Rodapé
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text('OrçaFácil - Todos os direitos reservados.', 10, 290);

        pdf.save('orcamento_orcafacil.pdf');
    });
}







// Seleção de serviços e exibição de formulários
document.querySelectorAll('.servico-card').forEach(card => {
    card.addEventListener('click', () => {
        // Remover seleção anterior
        document.querySelectorAll('.servico-card').forEach(c => c.classList.remove('selecionado'));
        card.classList.add('selecionado');

        const servicoSelecionado = card.dataset.servico;

        // Ocultar todos os formulários
        document.querySelectorAll('.servico-formulario').forEach(div => {
            div.classList.remove('ativo');
        });

        // Mostrar o formulário correspondente
        const form = document.getElementById(`form-${servicoSelecionado}`);
        if (form) {
            form.classList.add('ativo');
        } else {
            alert("Serviço ainda não implementado.");
        }
    });
});

// Função para voltar ao menu principal
function voltarAoMenu() {
    // Oculta todos os formulários
    document.querySelectorAll('.servico-formulario').forEach(div => {
        div.classList.remove('ativo');
    });

    // Remove seleção dos cards
    document.querySelectorAll('.servico-card').forEach(c => c.classList.remove('selecionado'));

    // Limpa o resultado se quiser
    document.getElementById('resultado').innerHTML = "";
}
