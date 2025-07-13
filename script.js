// Função para gerar DNA alienígena aleatório
function gerarDNAAlienígena(tamanho) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let dna = "";
  
  for (let i = 0; i < tamanho; i++) {
    dna += letras[Math.floor(Math.random() * letras.length)];
  }
  
  return dna;
}

// Gerar DNA do alienígena quando a página carregar
let dnaAlienígena = "";
window.onload = function() {
  dnaAlienígena = gerarDNAAlienígena(10);
  document.getElementById("dna-alienigena").innerText = dnaAlienígena;
};

// Função para gerar novo DNA alienígena
function gerarNovoDNA() {
  dnaAlienígena = gerarDNAAlienígena(10);
  document.getElementById("dna-alienigena").innerText = dnaAlienígena;
  document.getElementById("resultado").innerText = ""; // Limpar resultado anterior
}

function alinhar() {
  const match = 1;
  const mismatch = -1;
  const gap = -2;

  const seq1 = dnaAlienígena; // Usar o DNA do alienígena gerado
  const seq2 = document.getElementById("mutacao").value.toUpperCase();
  const n = seq1.length;
  const m = seq2.length;

  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const traceback = Array.from({ length: n + 1 }, () => Array(m + 1).fill(''));

  // Inicialização
  for (let i = 0; i <= n; i++) {
    dp[i][0] = i * gap;
    traceback[i][0] = 'U';
  }
  for (let j = 0; j <= m; j++) {
    dp[0][j] = j * gap;
    traceback[0][j] = 'L';
  }
  traceback[0][0] = '0';

  // Preenchimento da matriz
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const diag = dp[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? match : mismatch);
      const up = dp[i - 1][j] + gap;
      const left = dp[i][j - 1] + gap;

      dp[i][j] = Math.max(diag, up, left);

      if (dp[i][j] === diag) traceback[i][j] = 'D';
      else if (dp[i][j] === up) traceback[i][j] = 'U';
      else traceback[i][j] = 'L';
    }
  }

  // Reconstrução do alinhamento
  let alin1 = "";
  let alin2 = "";
  let i = n, j = m;

  while (i > 0 || j > 0) {
    if (traceback[i][j] === 'D') {
      alin1 = seq1[i - 1] + alin1;
      alin2 = seq2[j - 1] + alin2;
      i--; j--;
    } else if (traceback[i][j] === 'U') {
      alin1 = seq1[i - 1] + alin1;
      alin2 = "-" + alin2;
      i--;
    } else {
      alin1 = "-" + alin1;
      alin2 = seq2[j - 1] + alin2;
      j--;
    }
  }

  // Função para determinar o estado da criatura baseado no resultado
  function determinarEstadoCriatura(score, alin1, alin2) {
    const porcentagemCompatibilidade = score / Math.min(n, m);
    
    // Analisar padrões específicos na mutação
    const mutacao = alin2.replace(/-/g, ''); // Remove gaps para análise
    
    // Verificar se morreu (pontuação muito baixa)
    if (score < -Math.min(n, m) * 0.8) {
      return {
        imagem: "morto.jpeg",
        estado: "💀 Mutação Letal",
        descricao: "A criatura não sobreviveu às alterações genéticas. A incompatibilidade foi fatal."
      };
    }
    
    // Verificar se congelou (muitas letras C, F, I)
    if ((mutacao.match(/[CFI]/g) || []).length >= mutacao.length * 0.4) {
      return {
        imagem: "congelou.jpeg",
        estado: "🧊 Criatura Congelada",
        descricao: "A alta concentração de genes frios causou uma redução drástica na temperatura corporal."
      };
    }
    
    // Verificar se pegou fogo (muitas letras F, H, R)
    if ((mutacao.match(/[FHR]/g) || []).length >= mutacao.length * 0.4) {
      return {
        imagem: "fogo.jpeg",
        estado: "🔥 Criatura Inflamável",
        descricao: "Os genes de calor se manifestaram intensamente, causando combustão espontânea."
      };
    }
    
    // Verificar se derreteu (muitas letras D, L, M)
    if ((mutacao.match(/[DLM]/g) || []).length >= mutacao.length * 0.4) {
      return {
        imagem: "derreteu.jpeg",
        estado: "🌊 Criatura Derretida",
        descricao: "A estrutura molecular se tornou instável, resultando em liquefação parcial."
      };
    }
    
    // Verificar se duplicou (muitas letras repetidas)
    const letrasDuplicadas = mutacao.match(/(.)\1+/g);
    if (letrasDuplicadas && letrasDuplicadas.length >= 2) {
      return {
        imagem: "duplicado.jpeg",
        estado: "👥 Criatura Duplicada",
        descricao: "A repetição genética causou uma divisão celular anômala, criando múltiplas formas."
      };
    }
    
    // Verificar se desenvolveu asas (muitas letras A, W, Y)
    if ((mutacao.match(/[AWY]/g) || []).length >= mutacao.length * 0.3) {
      return {
        imagem: "asas.jpeg",
        estado: "🦅 Criatura Alada",
        descricao: "Desenvolveu estruturas similares a asas, ganhando a capacidade de voo."
      };
    }
    
    // Verificar se desenvolveu escamas (muitas letras S, K, Z)
    if ((mutacao.match(/[SKZ]/g) || []).length >= mutacao.length * 0.3) {
      return {
        imagem: "escamas.jpeg",
        estado: "🐍 Criatura Escamosa",
        descricao: "A pele desenvolveu escamas resistentes, oferecendo proteção adicional."
      };
    }
    
    // Estado normal/compatível
    if (score >= 0) {
      return {
        imagem: "normal.jpeg",
        estado: "✅ Criatura Estável",
        descricao: "A mutação foi bem-sucedida, mantendo a estabilidade genética da criatura."
      };
    }
    
    // Fallback para mutações instáveis
    return {
      imagem: "normal.jpeg",
      estado: "⚠️ Mutação Instável",
      descricao: "A criatura apresenta instabilidade genética, mas conseguiu sobreviver."
    };
  }
  const score = dp[n][m];

  // Determinar o estado da criatura
  const estadoCriatura = determinarEstadoCriatura(score, alin1, alin2);

  let feedback = "";
  if (score >= Math.min(n, m) * match * 0.8) feedback = "🧠 Mutação altamente compatível!";
  else if (score >= 0) feedback = "🧬 Mutação moderada. Risco aceitável.";
  else feedback = "⚠️ Mutação instável. Rejeitada pelo organismo.";

  // Mostrar resultado no modal
  const resultadoTexto = `DNA Original Alinhado:\n${alin1}\nMutação Alinhada:\n${alin2}\n\nPontuação: ${score}\n${feedback}`;
  
  document.getElementById("modal-resultado").innerText = resultadoTexto;
  document.getElementById("creature-image").src = `assets/${estadoCriatura.imagem}`;
  document.getElementById("creature-image").alt = estadoCriatura.estado;
  
  // Adicionar informações do estado da criatura
  document.getElementById("creature-status").innerHTML = `
    <h3>${estadoCriatura.estado}</h3>
    <p>${estadoCriatura.descricao}</p>
  `;
  
  abrirModal();
}

// Funções do modal
function abrirModal() {
  document.getElementById("modal").style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// Fechar modal clicando fora dele
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    fecharModal();
  }
}

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    fecharModal();
  }
});
