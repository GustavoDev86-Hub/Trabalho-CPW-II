# Trabalho-CPW-II - Site Estático com Docker

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)

* **Tecnologias Utilizadas**

Para a construção desta página e sua infraestrutura, foram utilizadas as seguintes ferramentas:

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JAVASCRIPT](https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![DOCKER](https://img.shields.io/badge/DOCKER-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![NGINX](https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white)
![DEBIAN](https://img.shields.io/badge/DEBIAN-A81D33?style=for-the-badge&logo=debian&logoColor=white)

* **Linguagem:** HTML5, CSS3 e JavaScript (ES6+)
* **Servidor:** Nginx Alpine (Servidor de alta performance)
* **Infraestrutura:** Docker & Docker Compose
* **Ambiente:** Debian 13 (Trixie)

Este projeto é uma aplicação web estática desenvolvida para a disciplina de **Construção de Páginas Web II**. O objetivo principal foi aplicar conceitos de estruturação de páginas e garantir que o ambiente de execução seja replicável através do uso de containers.

* **Como funciona?** O projeto utiliza um `Dockerfile` que configura um servidor Nginx para servir os arquivos estáticos na porta **8082**. Isso elimina a necessidade de instalar servidores web manualmente na máquina local.

O sistema é dividido em duas partes principais:

**Frontend:** Contém toda a interface do usuário (HTML), a estilização (CSS) e a lógica de interação (JavaScript).

**Infraestrutura Docker:** Gerencia o servidor que hospeda os arquivos de forma isolada, garantindo que o site rode da mesma forma em qualquer máquina.

* **Pré-requisitos** Antes de rodar, você precisará de:

* Docker instalado.
* Docker Compose configurado.
* Git para clonagem.

---

## 🚀 Como Executar

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/GustavoDev86-Hub/Trabalho-CPW-II.git](https://github.com/GustavoDev86-Hub/Trabalho-CPW-II.git)

2. Entrar na pasta do projeto:
   ```bash
   cd Trabalho-CPW-II

3. Subir o container:
   ```bash
   docker compose up -d

4. Acessar o projeto:
   ```bash
   Abra o navegador em: http://localhost:8082

* Gerenciamento do Container
- Parar o site: docker compose stop

- Remover tudo: docker compose down

- Atualizar código (Build): docker compose up -d --build
