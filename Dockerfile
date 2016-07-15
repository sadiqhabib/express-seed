# Extend base Dockerfile
FROM gcr.io/google_appengine/nodejs

# Install node
RUN /usr/local/bin/install_node '>=6.3.0'

# Copy app
COPY . /app/

# Install node packages
RUN npm install --production --unsafe-perm

# Start app
CMD npm start
