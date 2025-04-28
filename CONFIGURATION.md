    # Configuração do Ambiente

    ## Frontend (.env)

    Crie um arquivo `.env` na raiz do diretório `frontend` com as seguintes variáveis:

    ```env
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id

    VITE_API_URL=http://localhost:3000/api
    ```

    ## Backend (.env)

    Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis:

    ```env
    PORT=3000

    # Firebase Admin
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_CLIENT_EMAIL=your_firebase_client_email
    FIREBASE_PRIVATE_KEY=your_firebase_private_key

    # OpenAI
    OPENAI_API_KEY=your_openai_api_key

    # Pinecone
    PINECONE_API_KEY=your_pinecone_api_key
    PINECONE_ENVIRONMENT=your_pinecone_environment

    # AssemblyAI
    ASSEMBLYAI_API_KEY=your_assemblyai_api_key

    # CloudConvert
    CLOUDCONVERT_API_KEY=your_cloudconvert_api_key

    # Google Calendar
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/callback
    ```

    ## Como Obter as Chaves de API

    ### Firebase
    1. Acesse o [Console do Firebase](https://console.firebase.google.com)
    2. Crie um novo projeto
    3. Vá para Configurações do Projeto > Geral
    4. Role até "Seus aplicativos" e clique em "Adicionar app"
    5. Escolha Web e siga as instruções

    ### OpenAI
    1. Acesse o [Console da OpenAI](https://platform.openai.com)
    2. Crie uma conta ou faça login
    3. Vá para API Keys
    4. Crie uma nova chave de API

    ### Pinecone
    1. Acesse o [Console do Pinecone](https://app.pinecone.io)
    2. Crie uma conta ou faça login
    3. Crie um novo projeto
    4. Obtenha a chave de API e o ambiente

    ### AssemblyAI
    1. Acesse o [Console da AssemblyAI](https://www.assemblyai.com)
    2. Crie uma conta ou faça login
    3. Obtenha sua chave de API

    ### CloudConvert
    1. Acesse o [Console do CloudConvert](https://cloudconvert.com)
    2. Crie uma conta ou faça login
    3. Vá para API Keys
    4. Crie uma nova chave de API

    ### Google Calendar
    1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
    2. Crie um novo projeto
    3. Ative a API do Google Calendar
    4. Vá para Credenciais
    5. Crie credenciais OAuth 2.0
    6. Configure as URIs de redirecionamento
