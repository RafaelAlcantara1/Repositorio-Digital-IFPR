import { useState, useEffect } from 'react';
import { artigoService } from '../services/artigoService';
import { cursoService } from '../services/cursoService';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useArtigos } from '../contexts/ArtigoContext';

function ArtigoForm() {
  const [formData, setFormData] = useState({
    titulo: '',
    ano: new Date().getFullYear(),
    tipo_curso: '',
    id_curso: '',
    palavra_chave: '',
    link: '',
    autores: [{ nome: '', tipo: 'orientando' }]
  });

  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { updateTotalArtigos } = useArtigos();

  useEffect(() => {
    async function fetchData() {
      try {
        const cursosData = await cursoService.getAll();
        if (Array.isArray(cursosData)) {
          setCursos(cursosData);
          
          try {
            const ultimoArtigo = await artigoService.getLast();
            if (ultimoArtigo) {
              const updates = {};
              
              if (ultimoArtigo.ano) {
                updates.ano = ultimoArtigo.ano;
              }
              
              if (ultimoArtigo.id_curso) {
                const curso = ultimoArtigo.id_curso;
                const tipoCurso = typeof curso === 'object' ? curso.tipo_curso : '';
                const cursoId = typeof curso === 'object' ? curso._id : curso;
                
                updates.tipo_curso = tipoCurso;
                updates.id_curso = cursoId;
              }
              
              if (Object.keys(updates).length > 0) {
                setFormData(prev => ({
                  ...prev,
                  ...updates
                }));
              }
            }
          } catch (err) {
            // Ignora se não houver artigos anteriores
          }
        } else {
          setError('Formato de dados inválido ao carregar cursos');
        }
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
        setError('Erro ao carregar a lista de cursos. Por favor, tente novamente.');
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.tipo_curso) {
      const filtrados = cursos.filter(curso => curso.tipo_curso === formData.tipo_curso);
      setCursosFiltrados(filtrados);
      
      if (formData.id_curso) {
        const cursoValido = filtrados.some(c => c._id === formData.id_curso);
        if (!cursoValido) {
          setFormData(prev => ({ ...prev, id_curso: '' }));
        }
      }
    } else {
      setCursosFiltrados([]);
      setFormData(prev => ({ ...prev, id_curso: '' }));
    }
  }, [formData.tipo_curso, cursos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAutorChange = (index, field, value) => {
    const newAutores = [...formData.autores];
    newAutores[index] = {
      ...newAutores[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      autores: newAutores
    }));
  };

  const addAutor = () => {
    setFormData(prev => ({
      ...prev,
      autores: [...prev.autores, { nome: '', tipo: 'orientando' }]
    }));
  };

  const removeAutor = (index) => {
    if (formData.autores.length <= 1) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      autores: prev.autores.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const autoresData = formData.autores.map(autor => ({
        nome: autor.nome,
        tipo: autor.tipo
      }));

      const artigoData = {
        titulo: formData.titulo,
        ano: parseInt(formData.ano),
        id_curso: formData.id_curso,
        palavra_chave: formData.palavra_chave,
        link: formData.link,
        autores: autoresData
      };

      const response = await artigoService.create(artigoData);

      setSuccess(true);
      
      setFormData({
        titulo: '',
        ano: formData.ano,
        tipo_curso: formData.tipo_curso,
        id_curso: formData.id_curso,
        palavra_chave: '',
        link: '',
        autores: [{ nome: '', tipo: 'orientando' }]
      });
      updateTotalArtigos();
    } catch (err) {
      console.error('Erro ao cadastrar artigo:', err);
      setError(err.response?.data?.error || 'Erro ao cadastrar artigo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section">
      <h2 className="section-title">Cadastrar Novo Artigo</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Artigo cadastrado com sucesso!</div>}

      <form onSubmit={handleSubmit} className="artigo-form">
        <div className="form-group">
          <label htmlFor="titulo">Título do Artigo *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Digite o título do artigo"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ano">Ano *</label>
            <input
              type="number"
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              required
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipo_curso">Tipo de Curso *</label>
            <select
              id="tipo_curso"
              name="tipo_curso"
              value={formData.tipo_curso}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo</option>
              <option value="TECNICO_INTEGRADO">Técnico</option>
              <option value="TECNICO_SUBSEQUENTE">Subsequente</option>
              <option value="SUPERIOR">Superior</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="id_curso">Curso *</label>
            <select
              id="id_curso"
              name="id_curso"
              value={formData.id_curso}
              onChange={handleChange}
              required
              disabled={!formData.tipo_curso}
            >
              <option value="">
                {formData.tipo_curso ? 'Selecione o curso' : 'Primeiro selecione o tipo'}
              </option>
              {cursosFiltrados.map(curso => (
                <option key={curso._id} value={curso._id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="palavra_chave">Palavras-chave</label>
          <input
            type="text"
            id="palavra_chave"
            name="palavra_chave"
            value={formData.palavra_chave}
            onChange={handleChange}
            placeholder="Digite as palavras-chave separadas por vírgula"
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">Link do Artigo</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label>Autores e Orientadores</label>
          {formData.autores.map((autor, index) => (
            <div key={index} className="autor-input-group">
              <input
                type="text"
                value={autor.nome}
                onChange={(e) => handleAutorChange(index, 'nome', e.target.value)}
                placeholder="Nome do autor"
                required
              />
              <select
                value={autor.tipo}
                onChange={(e) => handleAutorChange(index, 'tipo', e.target.value)}
                required
              >
                <option value="orientando">Orientando</option>
                <option value="orientador">Orientador</option>
                <option value="coorientador">Coorientador</option>
              </select>
              {formData.autores.length > 1 && (
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeAutor(index)}
                  title="Remover autor"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-button"
            onClick={addAutor}
          >
            <FaPlus /> Adicionar Autor
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Artigo'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArtigoForm;