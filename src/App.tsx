import { useState } from 'react'

const API_URL = "https://api-depoimentos.onrender.com";

async function acordarEEnviarDados(dados: any) {
  let acordou = false;
  let tentativas = 0;
  const maxTentativas = 12; // 12 * 5 segundos = 60 segundos de espera máxima

  console.log("Verificando se o servidor está acordado...");

  while (!acordou && tentativas < maxTentativas) {
    try {
      // Tenta acessar a rota leve
      const resposta = await fetch(`${API_URL}/health_check`, { method: 'GET' });

      if (resposta.ok) {
        acordou = true;
        console.log("Servidor acordou! Enviando dados...");
      }
    } catch (erro) {
      tentativas++;
      console.log(`Servidor dormindo. Tentativa ${tentativas} de ${maxTentativas}...`);
      // Aguarda 5 segundos antes de tentar de novo
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (!acordou) {
    throw new Error("O servidor demorou muito para responder (Timeout).");
  }

  // AGORA SIM: Envia a requisição real com os dados seguros
  const respostaFinal = await fetch(`${API_URL}/depoimentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  if (!respostaFinal.ok) {
    throw new Error("Erro ao enviar depoimento.");
  }

  return await respostaFinal.json();
}

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    depoimento: '',
    avaliacao: 5,
    setor: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    // Prepare payload mapping local state to API requirements
    const payload = {
      nome: formData.nome,
      data_hora: new Date().toISOString(),
      texto: formData.depoimento,
      nota: formData.avaliacao,
      nicho: formData.setor
    }

    try {
      await acordarEEnviarDados(payload);

      setStatus('success')
      setFormData({ nome: '', depoimento: '', avaliacao: 5, setor: '' })
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        <h2>Deixe aqui seu depoimento</h2>
        <p>Compartilhe sua experiência conosco.</p>
      </div>

      {loading ? (
        <div>
          <div></div> {/* Spinner */}
          <p>
            Aguarde<span></span>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required placeholder="Como podemos te chamar?" />
          </div>
          <div>
            <label>Depoimento</label>
            <textarea value={formData.depoimento} onChange={e => setFormData({...formData, depoimento: e.target.value})} required placeholder="O que você achou de nós?" />
          </div>
          <div>
            <div>
              <label>Avaliação</label>
              <select value={formData.avaliacao} onChange={e => setFormData({...formData, avaliacao: parseInt(e.target.value)})}>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Estrela' : 'Estrelas'}</option>)}
              </select>
            </div>
            <div>
              <label>Setor</label>
              <input type="text" value={formData.setor} onChange={e => setFormData({...formData, setor: e.target.value})} required placeholder="Ex: Vendas" />
            </div>
          </div>
          <button type="submit">
            Enviar Depoimento
          </button>
        </form>
      )}

      {(status === 'success' || status === 'error') && (
        <div>
          {status === 'success' ? 'Depoimento registrado com sucesso! Obrigado.' : 'Ops, algo deu errado. Tente novamente mais tarde.'}
        </div>
      )}
      
      <p>
        Ao enviar este formulário, você concorda que o preenchimento está em total conformidade com o nosso contrato de uso e privacidade.
      </p>
    </div>
  )
}

export default App
