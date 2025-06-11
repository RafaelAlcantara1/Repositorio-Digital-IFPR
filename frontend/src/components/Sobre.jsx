import React from 'react';
import './Sobre.css';

function Sobre() {
  return (
    <div className="sobre-container">
      <h1>Sobre o Repositório Digital</h1>
      
      <section className="sobre-section">
        <h2>Objetivo</h2>
        <p>
          O Repositório Digital do IFPR Campus Assis Chateaubriand tem como objetivo principal 
          armazenar, preservar e disponibilizar os trabalhos finais de curso desenvolvidos pelos 
          estudantes da instituição. Este espaço serve como um acervo digital que valoriza a 
          produção acadêmica e facilita o acesso ao conhecimento gerado em nossa instituição.
        </p>
      </section>

      <section className="sobre-section">
        <h2>Missão</h2>
        <p>
          Nossa missão é promover a disseminação do conhecimento científico e tecnológico 
          produzido pelos estudantes do IFPR Campus Assis Chateaubriand, contribuindo para o 
          desenvolvimento acadêmico e profissional da comunidade.
        </p>
      </section>

      <section className="sobre-section">
        <h2>Benefícios</h2>
        <ul>
          <li>Preservação digital dos trabalhos acadêmicos</li>
          <li>Facilidade de acesso à produção científica</li>
          <li>Visibilidade para os trabalhos dos estudantes</li>
          <li>Contribuição para o desenvolvimento da pesquisa</li>
          <li>Integração com a comunidade acadêmica</li>
        </ul>
      </section>

      <section className="sobre-section">
        <h2>Contato</h2>
        <p>
          Para mais informações sobre o Repositório Digital, entre em contato com a coordenação 
          do campus através do email: contato@ifpr.edu.br
        </p>
      </section>
    </div>
  );
}

export default Sobre; 