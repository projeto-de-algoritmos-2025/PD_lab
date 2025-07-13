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

  // Feedback baseado na pontuação final
  let feedback = "";
  const score = dp[n][m];
  if (score >= Math.min(n, m) * match * 0.8) feedback = "🧠 Mutação altamente compatível!";
  else if (score >= 0) feedback = "🧬 Mutação moderada. Risco aceitável.";
  else feedback = "⚠️ Mutação instável. Rejeitada pelo organismo.";

  document.getElementById("resultado").innerText =
    `DNA Original Alinhado:\n${alin1}\nMutação Alinhada:\n${alin2}\n\nPontuação: ${score}\n${feedback}`;
}
