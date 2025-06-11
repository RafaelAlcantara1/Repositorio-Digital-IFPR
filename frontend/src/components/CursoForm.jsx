import { useState } from 'react';
import { cursoService } from '../services/cursoService';
import { FaPlus } from 'react-icons/fa';

function CursoForm() {
  const [formData, setFormData] = useState({
    nome: '',
    tipo_curso: 'TECNICO_INTEGRADO'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await cursoService.create(formData);
      setSuccess(true);
      setFormData({ nome: '', tipo_curso: 'TECNICO_INTEGRADO' });
    } catch (err) {
      console.error('Erro ao cadastrar curso:', err);
      setError(err.response?.data?.error || 'Erro ao cadastrar curso. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>Cadastrar Novo Curso</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Curso cadastrado com sucesso!</div>}

      <form onSubmit={handleSubmit} className="curso-form">
        <div className="form-group">
          <label htmlFor="nome">Nome do Curso *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Digite o nome do curso"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo_curso">Tipo do Curso *</label>
          <select
            id="tipo_curso"
            name="tipo_curso"
            value={formData.tipo_curso}
            onChange={handleChange}
            required
          >
            <option value="TECNICO_INTEGRADO">Curso Técnico Integrado ao Ensino Médio</option>
            <option value="TECNICO_SUBSEQUENTE">Curso Técnico Subsequente</option>
            <option value="SUPERIOR">Curso Superior</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : (
            <>
              <FaPlus /> Cadastrar Curso
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default CursoForm; 