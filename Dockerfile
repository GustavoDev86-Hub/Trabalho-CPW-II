# Usa a imagem leve do Nginx
FROM nginx:alpine

# Copia os arquivos da pasta atual para o diretório do servidor Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80 do container
EXPOSE 80