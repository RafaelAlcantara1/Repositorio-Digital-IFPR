import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { artigoService } from '../services/artigoService';
import { cursoService } from '../services/cursoService';
import './ArtigoEditModal.css';

function ArtigoEditModal({ isOpen, onClose, artigo }) {
  const [formData, setFormData] = useState({
    titulo: '',
    ano: new Date().getFullYear(),
    id_curso: '',
    palavra_chave: '',
    link: '',
    autores: [{ nome: '', tipo: 'orientando' }]
  });

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && artigo) {
      // Preencher o formulário com os dados do artigo
      setFormData({
        titulo: artigo.titulo || artigo.title || '',
        ano: artigo.ano || artigo.year || new Date().getFullYear(),
        id_curso: artigo.id_curso?._id || artigo.id_curso || artigo.curso?._id || artigo.curso || artigo.curso_id || artigo.curso || artigo.id_curso || '',
        palavra_chave: artigo.palavra_chave || artigo.palavras_chave || '',
        link: artigo.link || artigo.url || '',
        autores: (artigo.autores || artigo.autor) && (artigo.autores || artigo.autor).length > 0 
          ? (artigo.autores || artigo.autor).map(autor => ({
              nome: autor.nome || autor.name || autor.nome_autor || '',
              tipo: autor.tipo || autor.type || autor.tipo_autor || 'orientando'
            }))
          : [{ nome: '', tipo: 'orientando' }]
      });
    }
  }, [isOpen, artigo]);

  useEffect(() => {
    if (isOpen) {
      // Carregar cursos quando o modal abrir
      const fetchCursos = async () => {
        try {
          const data = await cursoService.getAll();
          if (Array.isArray(data)) {
            setCursos(data);
          }
        } catch (err) {
          console.error('Erro ao carregar cursos:', err);
        }
      };
      fetchCursos();
    }
  }, [isOpen]);

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

      console.log('Artigo a ser editado:', artigo);
      console.log('ID do artigo:', artigo._id);
      console.log('ID do curso no formData:', formData.id_curso);
      console.log('Dados para atualização:', artigoData);

      const artigoId = artigo._id;
      await artigoService.update(artigoId, artigoData);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Recarregar a página para mostrar as alterações
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Erro ao atualizar artigo:', err);
      setError(err.response?.data?.error || 'Erro ao atualizar artigo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content artigo-edit-modal">
        <div className="modal-header">
          <h2>Editar Artigo</h2>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Artigo atualizado com sucesso!</div>}

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

            <div className="form-group">
              <label htmlFor="id_curso">Curso *</label>
              <select
                id="id_curso"
                name="id_curso"
                value={formData.id_curso}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o curso</option>
                {cursos.map(curso => (
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
              <FaSave /> {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ArtigoEditModal;
