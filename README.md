
# tensorflowjs-demo-web

Demonstração de detecção de poses de mãos usando TensorFlow para a Web.

## Visão Geral

Este projeto demonstra a detecção de poses de mãos utilizando TensorFlow.js, uma poderosa biblioteca de aprendizado de máquina para a web. Ele utiliza o modelo MediaPipe Hands para detectar e rastrear poses de mãos através da webcam em visões 2D e 3D.

## Funcionalidades

- Detecção de poses de mãos em tempo real usando a webcam.
- Renderização 2D dos pontos-chave das mãos e conexões.
- Visualização 3D de poses de mãos com scatter-gl.
- Rastreamento de FPS e contagem de quadros processados.

## Tecnologias Usadas

- [TensorFlow.js](https://www.tensorflow.org/js) - Biblioteca de aprendizado de máquina para a web.
- [MediaPipe Hands](https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/hands.md) - Modelo de rastreamento de mãos do Google.
- [scatter-gl](https://github.com/PAIR-code/scatter-gl) - Visualização 3D para gráficos de dispersão.
- [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces de usuário.
- [Next.js](https://nextjs.org/) - Framework React para renderização no lado do servidor.
- [Docker](https://www.docker.com/) - Plataforma de containers para construir e executar aplicações.

## Instalação

1. Clone o repositório:

   ```bash
   git clone git@github.com:tymaeusz/tensorflowjs-demo-web.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd tensorflowjs-demo-web
   ```

## Instruções de Execução

1. **Construa e inicie os containers do Docker**:

   ```bash
   docker-compose up --build
   ```

2. **Acesse a aplicação web**: Abra o seu navegador e vá para [http://localhost](http://localhost).

3. **Inicie a detecção de poses de mãos**: Conceda acesso à sua webcam quando solicitado. O aplicativo detectará e exibirá as poses das mãos em tempo real.

4. **Alternar visualização**: O aplicativo mostrará os pontos-chave das mãos e conexões em modos 2D e 3D.

## Contribuindo

Fique à vontade para fazer um fork do repositório, melhorar e criar pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
