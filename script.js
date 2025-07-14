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
  dnaAlienígena = gerarDNAAlienígena(12);
  document.getElementById("dna-alienigena").innerText = dnaAlienígena;
};

// Função para gerar novo DNA alienígena
function gerarNovoDNA() {
  dnaAlienígena = gerarDNAAlienígena(12);
  document.getElementById("dna-alienigena").innerText = dnaAlienígena;
  document.getElementById("mutacao").value = "";
  
  // Animação de highlight
  const dnaElement = document.getElementById("dna-alienigena");
  dnaElement.style.animation = "none";
  setTimeout(() => {
    dnaElement.style.animation = "glow 2s ease-in-out infinite alternate";
  }, 10);
}

function alinhar() {
  const mutacao = document.getElementById("mutacao").value.toUpperCase().trim();
  
  if (!mutacao) {
    alert("Por favor, insira uma sequência de mutação!");
    return;
  }
  
  // Mostrar loading
  document.getElementById("loading").style.display = "block";
  document.querySelector(".btn-analyze").disabled = true;
  
  // Simular delay de processamento
  setTimeout(() => {
    processarAlinhamento(mutacao);
  }, 1500);
}

function processarAlinhamento(mutacao) {
  const match = 2;
  const mismatch = -1;
  const gap = -2;

  const seq1 = dnaAlienígena;
  const seq2 = mutacao;
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

  const score = dp[n][m];
  const maxScore = Math.min(n, m) * match;
  const compatibilidade = Math.max(0, Math.round((score / maxScore) * 100));

  // Determinar o estado da criatura
  const estadoCriatura = determinarEstadoCriatura(score, alin1, alin2, mutacao);

  // Gerar feedback
  let feedback = "";
  if (score >= maxScore * 0.8) feedback = "🧠 Mutação altamente compatível! Evolução bem-sucedida.";
  else if (score >= maxScore * 0.5) feedback = "🧬 Mutação moderadamente compatível. Adaptação em progresso.";
  else if (score >= 0) feedback = "⚠️ Mutação instável. Sobrevivência incerta.";
  else feedback = "☠️ Mutação incompatível. Risco de falha genética.";

  // Colorir sequências alinhadas
  const coloredOriginal = colorirSequencia(alin1, alin2, true);
  const coloredMutant = colorirSequencia(alin2, alin1, false);

  // Ocultar loading
  document.getElementById("loading").style.display = "none";
  document.querySelector(".btn-analyze").disabled = false;

  // Atualizar modal
  document.getElementById("score-value").textContent = score;
  document.getElementById("compatibility-value").textContent = compatibilidade + "%";
  document.getElementById("progress-fill").style.width = compatibilidade + "%";
  
  document.getElementById("aligned-original").innerHTML = coloredOriginal;
  document.getElementById("aligned-mutant").innerHTML = coloredMutant;
  
  document.getElementById("modal-resultado").innerHTML = `
    <strong>Análise Detalhada:</strong><br><br>
    Pontuação de Alinhamento: ${score}<br>
    Compatibilidade Genética: ${compatibilidade}%<br>
    Comprimento DNA Original: ${seq1.length} bases<br>
    Comprimento DNA Mutante: ${seq2.length} bases<br>
    Comprimento Alinhamento: ${alin1.length} bases<br><br>
    <strong>Interpretação:</strong><br>
    ${feedback}<br><br>
    <strong>Parâmetros do Algoritmo:</strong><br>
    • Match: +${match} pontos<br>
    • Mismatch: ${mismatch} pontos<br>
    • Gap: ${gap} pontos
  `;

  // Atualizar imagem e status da criatura
  document.getElementById("creature-image").src = gerarImagemCriatura(estadoCriatura.tipo);
  document.getElementById("creature-status").innerHTML = `
    <h3>${estadoCriatura.estado}</h3>
    <p>${estadoCriatura.descricao}</p>
  `;

  abrirModal();
}

function colorirSequencia(seq1, seq2, isOriginal) {
  let resultado = "";
  for (let i = 0; i < seq1.length; i++) {
    const char1 = seq1[i];
    const char2 = seq2[i];
    
    if (char1 === '-') {
      resultado += `<span class="gap">${char1}</span>`;
    } else if (char1 === char2) {
      resultado += `<span class="match">${char1}</span>`;
    } else {
      resultado += `<span class="mismatch">${char1}</span>`;
    }
  }
  return resultado;
}

function determinarEstadoCriatura(score, alin1, alin2, mutacao) {
  const porcentagemCompatibilidade = score / Math.min(alin1.length, alin2.length);
  
  // Analisar padrões específicos na mutação
  const mutacaoLimpa = mutacao.replace(/-/g, '');
  
  // Verificar se morreu (pontuação muito baixa)
  if (score < -mutacaoLimpa.length * 0.8) {
    return {
      tipo: "morto",
      estado: "💀 Mutação Letal",
      descricao: "A criatura não sobreviveu às alterações genéticas. A incompatibilidade genética foi fatal para o organismo."
    };
  }
  
  // Verificar se congelou (muitas letras C, F, I)
  if ((mutacaoLimpa.match(/[CFI]/g) || []).length >= mutacaoLimpa.length * 0.4) {
    return {
      tipo: "congelado",
      estado: "🧊 Criatura Congelada",
      descricao: "A alta concentração de genes criogênicos causou uma redução drástica na temperatura corporal, resultando em hibernação forçada."
    };
  }
  
  // Verificar se pegou fogo (muitas letras F, H, R)
  if ((mutacaoLimpa.match(/[FHR]/g) || []).length >= mutacaoLimpa.length * 0.4) {
    return {
      tipo: "fogo",
      estado: "🔥 Criatura Inflamável",
      descricao: "Os genes termogênicos se manifestaram intensamente, causando combustão espontânea das células. A criatura agora emite calor extremo."
    };
  }
  
  // Verificar se derreteu (muitas letras D, L, M)
  if ((mutacaoLimpa.match(/[DLM]/g) || []).length >= mutacaoLimpa.length * 0.4) {
    return {
      tipo: "derretido",
      estado: "🌊 Criatura Derretida",
      descricao: "A estrutura molecular celular se tornou instável, resultando em liquefação parcial. A forma física não é mais sólida."
    };
  }
  
  // Verificar se duplicou (padrões repetidos ou sequências espelhadas)
  let padroesDuplicados = 0;
  
  // Verifica se há padrões de 2-3 letras que se repetem
  for (let tamanho = 2; tamanho <= 3; tamanho++) {
    for (let i = 0; i <= mutacaoLimpa.length - tamanho * 2; i++) {
      const padrao = mutacaoLimpa.substring(i, i + tamanho);
      const resto = mutacaoLimpa.substring(i + tamanho);
      if (resto.includes(padrao)) {
        padroesDuplicados++;
      }
    }
  }
  
  // Verifica sequências espelhadas (palindrômicas)
  for (let i = 0; i <= mutacaoLimpa.length - 4; i++) {
    const segmento = mutacaoLimpa.substring(i, i + 4);
    const reverso = segmento.split('').reverse().join('');
    if (segmento === reverso) {
      padroesDuplicados += 2;
    }
  }
  
  // Verifica se mais de 50% das letras aparecem mais de uma vez
  const contadorLetras = {};
  for (let letra of mutacaoLimpa) {
    contadorLetras[letra] = (contadorLetras[letra] || 0) + 1;
  }
  const letrasRepetidas = Object.values(contadorLetras).filter(count => count > 1).length;
  const porcentagemRepeticao = letrasRepetidas / Object.keys(contadorLetras).length;
  
  if (padroesDuplicados >= 2 || porcentagemRepeticao > 0.5) {
    return {
      tipo: "duplicado",
      estado: "👥 Criatura Duplicada",
      descricao: "Padrões genéticos duplicados causaram replicação celular descontrolada, resultando em múltiplas cópias da criatura com variações sutis."
    };
  }
  
  // Verificar se desenvolveu asas (muitas letras A, W, Y)
  if ((mutacaoLimpa.match(/[AWY]/g) || []).length >= mutacaoLimpa.length * 0.3) {
    return {
      tipo: "asas",
      estado: "🦅 Criatura Alada",
      descricao: "Desenvolveu estruturas aerodinâmicas similares a asas, ganhando a capacidade de voo. A adaptação permite maior mobilidade."
    };
  }
  
  // Verificar se desenvolveu escamas (muitas letras S, K, Z)
  if ((mutacaoLimpa.match(/[SKZ]/g) || []).length >= mutacaoLimpa.length * 0.3) {
    return {
      tipo: "escamas",
      estado: "🐍 Criatura Escamosa",
      descricao: "A pele desenvolveu escamas quitinosas resistentes, oferecendo proteção adicional contra ameaças externas e radiação."
    };
  }
  
  // Verificar se desenvolveu tentáculos (muitas letras T, U, V)
  if ((mutacaoLimpa.match(/[TUV]/g) || []).length >= mutacaoLimpa.length * 0.3) {
    return {
      tipo: "tentaculos",
      estado: "🐙 Criatura Tentacular",
      descricao: "Desenvolveu apêndices flexíveis semelhantes a tentáculos, aumentando sua capacidade de manipulação e movimento."
    };
  }
  
  // Verificar se desenvolveu cristais (muitas letras Q, X, Z)
  if ((mutacaoLimpa.match(/[QXZ]/g) || []).length >= mutacaoLimpa.length * 0.3) {
    return {
      tipo: "cristalino",
      estado: "💎 Criatura Cristalina",
      descricao: "A estrutura celular se mineralizou, formando cristais orgânicos que conferem resistência e capacidade de refração luminosa."
    };
  }
  
  // Verificar se desenvolveu características psíquicas (muitas letras P, N, O)
  if ((mutacaoLimpa.match(/[PNO]/g) || []).length >= mutacaoLimpa.length * 0.3) {
    return {
      tipo: "psiquico",
      estado: "🧠 Criatura Psíquica",
      descricao: "Desenvolveu capacidades mentais avançadas, incluindo telepatia e manipulação de energia psíquica."
    };
  }
  
  // Estado gigante (muitas letras G, J, B)
  if ((mutacaoLimpa.match(/[GJB]/g) || []).length >= mutacaoLimpa.length * 0.3) {
    return {
      tipo: "gigante",
      estado: "🦣 Criatura Gigante",
      descricao: "A mutação causou crescimento descontrolado, resultando em um aumento significativo no tamanho corporal."
    };
  }
  
  // Estado normal/compatível
  if (score >= 0) {
    return {
      tipo: "normal",
      estado: "✅ Criatura Estável",
      descricao: "A mutação foi bem-sucedida, mantendo a estabilidade genética da criatura com melhorias adaptativas."
    };
  }
  
  // Fallback para mutações instáveis
  return {
    tipo: "instavel",
    estado: "⚠️ Criatura Instável",
    descricao: "A criatura apresenta instabilidade genética significativa, mas conseguiu sobreviver temporariamente."
  };
}

// Função auxiliar para codificar SVG Unicode em base64
function base64EncodeUnicode(str) {
  // Primeiro, converte para UTF-8, depois para base64
  return btoa(unescape(encodeURIComponent(str)));
}

function gerarImagemCriatura(tipo) {
  // Tente usar uma imagem personalizada se existir para o tipo
  const tiposComImagem = [
    "morto", "congelado", "fogo", "derretido", "duplicado",
    "asas", "escamas", "tentaculos", "cristalino", "psiquico", "gigante", "instavel", "normal"
  ];
  if (tiposComImagem.includes(tipo)) {
    return `assets/${tipo}.jpeg`;
  }

  const cores = {
    normal: "#667eea",
    morto: "#6c757d",
    congelado: "#17a2b8",
    fogo: "#dc3545",
    derretido: "#28a745",
    duplicado: "#ffc107",
    asas: "#6f42c1",
    escamas: "#20c997",
    tentaculos: "#fd7e14",
    cristalino: "#e83e8c",
    psiquico: "#6610f2",
    gigante: "#795548",
    instavel: "#f8d7da"
  };

  const emojis = {
    normal: "🙂",
    morto: "💀",
    congelado: "🧊",
    fogo: "🔥",
    derretido: "🌊",
    duplicado: "👥",
    asas: "🦅",
    escamas: "🐍",
    tentaculos: "🐙",
    cristalino: "💎",
    psiquico: "🧠",
    gigante: "🦣",
    instavel: "⚠️"
  };

  const cor = cores[tipo] || "#667eea";
  const emoji = emojis[tipo] || "🙂";
  
  // Usar base64EncodeUnicode para suportar Unicode no SVG
  return `data:image/svg+xml;base64,${base64EncodeUnicode(`
    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="creature" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${cor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${cor}CC;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#bg)"/>
      <circle cx="150" cy="150" r="90" fill="url(#creature)" stroke="${cor}" stroke-width="3"/>
      <circle cx="125" cy="130" r="12" fill="white" stroke="${cor}" stroke-width="2"/>
      <circle cx="175" cy="130" r="12" fill="white" stroke="${cor}" stroke-width="2"/>
      <circle cx="125" cy="130" r="6" fill="${cor}"/>
      <circle cx="175" cy="130" r="6" fill="${cor}"/>
      <ellipse cx="150" cy="170" rx="20" ry="8" fill="white" stroke="${cor}" stroke-width="2"/>
      <text x="150" y="250" text-anchor="middle" fill="${cor}" font-family="Arial" font-size="16" font-weight="bold">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</text>
      <text x="150" y="90" text-anchor="middle" font-size="30">${emoji}</text>
    </svg>
  `)}`;
}

// Funções do modal
function abrirModal() {
  document.getElementById("modal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
  document.body.style.overflow = "auto";
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

// Permitir Enter no campo de input
document.getElementById("mutacao").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    alinhar();
  }
});

// Validação do input em tempo real
document.getElementById("mutacao").addEventListener("input", function(event) {
  let value = event.target.value.toUpperCase();
  // Remove caracteres não permitidos
  value = value.replace(/[^A-Z]/g, '');
  event.target.value = value;
});

// Funções para controlar o modal do manual
function abrirManual() {
  document.getElementById('manual-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function fecharManual() {
  document.getElementById('manual-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Fechar modal do manual ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById('modal');
  const manualModal = document.getElementById('manual-modal');
  
  if (event.target === modal) {
    fecharModal();
  }
  
  if (event.target === manualModal) {
    fecharManual();
  }
}

//  animações
document.addEventListener('DOMContentLoaded', function() {
  const elements = document.querySelectorAll('.dna-section, .mutation-section');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'all 0.6s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 200);
  });
});