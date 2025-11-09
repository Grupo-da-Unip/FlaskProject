// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // 1. Menu Hambúrguer
    // ===================================
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        menuToggle.classList.toggle('open');
    });

    // Fecha o menu ao clicar em um link (mobile)
    document.querySelectorAll('#sidebar .nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
                menuToggle.classList.remove('open');
            }
        });
    });
});







function bloquearSimbolos(e) {
  // Permite: backspace, delete, tab, setas
  if (["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key))
    return;

  // Bloqueia tudo que não for número
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
}

// Função genérica para limitar números e exibir aviso
function limitarInput(input, maximo, avisoId) {
  const aviso = document.getElementById(avisoId);
  const raw = input.value;

  // Remove tudo que não for número
  input.value = raw.replace(/\D/g, "");

  if (input.value === "") {
    aviso.classList.remove("mostrar");
    input.classList.remove("erro");
    return;
  }

  let num = parseInt(input.value, 10);

  if (isNaN(num)) {
    input.value = "";
    aviso.classList.remove("mostrar");
    input.classList.remove("erro");
    return;
  }

  // Limita valor máximo
  if (num > maximo) {
    num = maximo;
    aviso.classList.add("mostrar");
    input.classList.add("erro");
  } else {
    aviso.classList.remove("mostrar");
    input.classList.remove("erro");
  }

  input.value = num;

  // Garante no máximo 4 dígitos (para distância) ou 2 (para frequência)
  const limiteDigitos = maximo > 100 ? 5 : 2;
  if (input.value.length > limiteDigitos) {
    input.value = input.value.slice(0, limiteDigitos);
  }
}



document.addEventListener("DOMContentLoaded", function () {
  const tipoVeiculo = document.getElementById("tipoVeiculo");
  const combustivelSelect = document.getElementById("combustivel");
  const infoCombustivel = document.getElementById("infoCombustivel");

  if (!tipoVeiculo || !combustivelSelect) {
    console.error("Elementos não encontrados: verifique se os IDs estão corretos no HTML.");
    return;
  }

  tipoVeiculo.addEventListener("change", function () {
    const tipo = this.value;
    const opcoes = combustivelSelect.options;

    // Reabilita todas as opções antes de aplicar restrições
    for (let i = 0; i < opcoes.length; i++) {
      opcoes[i].disabled = false;
    }

    // Libera e limpa por padrão
    combustivelSelect.disabled = false;
    combustivelSelect.value = "";
    if (infoCombustivel) infoCombustivel.textContent = "";

    // Função para travar combustível fixo
    function travarCombustivel(valor, mensagem) {
      const opt = Array.from(combustivelSelect.options).find(o => o.value === valor);
      if (opt) {
        combustivelSelect.value = valor;
      } else {
        console.warn("Option de combustível não encontrada:", valor);
      }
      combustivelSelect.disabled = true;
      if (infoCombustivel) infoCombustivel.textContent = mensagem;
    }

    // 🔹 Restrições e travas por tipo de veículo
    if (tipo === "moto") {
      combustivelSelect.querySelector('option[value="gas_natural"]').disabled = true;
      combustivelSelect.querySelector('option[value="querosene_aviacao"]').disabled = true;
      combustivelSelect.querySelector('option[value="hibrido"]').disabled = true;
    } 
    else if (tipo === "carro") {
      combustivelSelect.querySelector('option[value="querosene_aviacao"]').disabled = true;
    } 
    else if (tipo === "aviao") {
      travarCombustivel("querosene_aviacao", "Combustível fixo: Querosene de Aviação ✈️");
    } 
    else if (tipo === "onibus") {
      travarCombustivel("diesel", "Combustível fixo: Diesel 🚌");
    }

    // Reseta a seleção se a opção atual ficou desabilitada
    if (combustivelSelect.selectedOptions[0]?.disabled) {
      combustivelSelect.selectedIndex = 0;
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const frequencia = document.getElementById("frequencia");
  const distancia = document.getElementById("distancia");

  // Bloqueia símbolos
  frequencia.addEventListener("keydown", bloquearSimbolos);
  distancia.addEventListener("keydown", bloquearSimbolos);

  // Limita valores
  frequencia.addEventListener("input", () => limitarInput(frequencia, 31, "aviso-frequencia"));
  distancia.addEventListener("input", () => limitarInput(distancia, 99999, "aviso-distancia"));
});



function calcular() {
    const veiculos = {
        carro: 0.1,
        moto: 0.04,
        onibus: 0.6,
        aviao: 4
    };

    const combustiveis = {
        gasolina: 2.28,
        etanol: 1.867,
        diesel: 3.2,
        gas_natural: 1.824,
        querosene_aviacao: 3.16,
        hibrido: 1.14
    };


    let veiculoTipo = document.getElementById("tipoVeiculo").value;
    let combustivelTipo = document.getElementById("combustivel").value;
    let veiculo = veiculos[veiculoTipo];
    let combustivel = combustiveis[combustivelTipo];


    let distancia = parseFloat(document.getElementById("distancia").value);
    let frequencia = parseFloat(document.getElementById("frequencia").value);


    const dict = { veiculo, combustivel, distancia, frequencia };
    const a = JSON.stringify(dict)
    console.log("JSON enviado:", a);
    //window.alert(a)

    $.ajax({
        url: "/calc",
        type: "POST",
        contentType: "application/json",
        data: a,
        success: function (response) {
            console.log("Resposta:", response)
            // window.alert(response)
            const label1 = document.getElementById("resultado");
            label1.style.display = "inline-block";
            label1.textContent = "Foram emitidas " + response[0] + " Toneladas de CO2 no mês, na qual são necessárias aproximadamente " + response[2] + " árvores adultas ou aproximadamente R$" + response[1] + " em credito de carbono"
          
        },
        error: function (xhr, status, error) {
            console.error("Erro:", status, error);
        }
    });

    fetch('/get_data')
    .then(response => response.json())
    .then(resultado => {
        console.log(resultado.message);
    })
    .catch(error => console.error('Error:', error));
    }



