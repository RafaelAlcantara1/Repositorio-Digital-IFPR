import React from 'react';
import './Sobre.css';
import { FaEnvelope } from 'react-icons/fa';
import samuelImg from '../assets/samuel.jpg';
import matheusImg from '../assets/matheus.jpg';
import rafaelImg from '../assets/rafael.jpg';
import michelliImg from '../assets/michelli.jpg';

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
          <li>Preservação digital dos trabalhos acadêmicos;</li>
          <li>Facilidade de acesso à produção científica;</li>
          <li>Visibilidade para os trabalhos dos estudantes;</li>
          <li>Contribuição para o desenvolvimento da pesquisa;</li>
          <li>Integração com a comunidade acadêmica.</li>
        </ul>
      </section>

      <section className="sobre-section">
        <h2>Equipe de Desenvolvimento</h2>
        <div className="autores-grid">
          <div className="autor-card" style={{ '--animation-order': 0 }}>
            <div className="autor-foto">
              <img src={matheusImg} alt="Foto do Matheus" />
            </div>
            <h3>Matheus Lucas da Palma Oliveira</h3>
            <p>Estudante de Informática</p>
            <div className="autor-email">
              <FaEnvelope className="email-icon" />
              <a href="mailto:matheuslucasteu57@gmail.com">matheuslucasteu57@gmail.com</a>
            </div>
          </div>

          <div className="autor-card" style={{ '--animation-order': 1 }}>
            <div className="autor-foto">
              <img src={rafaelImg} alt="Foto do Rafael" />
            </div>
            <h3>Rafael Henrique Rodrigues de Alcantara</h3>
            <p>Estudante de Informática</p>
            <div className="autor-email">
              <FaEnvelope className="email-icon" />
              <a href="mailto:rafinha009990@gmail.com">rafinha009990@gmail.com</a>
            </div>
          </div>

          <div className="autor-card" style={{ '--animation-order': 2 }}>
            <div className="autor-foto">
              <img src={michelliImg} alt="Foto da Michelli" />
            </div>
            <h3>Michelli Cristina Galli</h3>
            <p>Professora Orientadora</p>
            <p>Doutora em Estudos da Linguagem</p>
            <div className="autor-email">
              <FaEnvelope className="email-icon" />
              <a href="mailto:michelli.gali@ifpr.edu.br">michelli.gali@ifpr.edu.br</a>
            </div>
          </div>

          <div className="autor-card" style={{ '--animation-order': 3 }}>
            <div className="autor-foto">
              <img src={samuelImg} alt="Foto do Samuel" />
            </div>
            <h3>Samuel Stephan Milczuk</h3>
            <p>Professor Orientador</p>
            <p>Mestre em Ciência da Computação</p>
            <div className="autor-email">
              <FaEnvelope className="email-icon" />
              <a href="mailto:samuel.miczuk.ifpr.edu.br">samuel.miczuk.ifpr.edu.br</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sobre; 