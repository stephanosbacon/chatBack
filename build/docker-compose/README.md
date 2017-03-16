# Deploying with docker-compose

Do the following from the top-level chatback directory:
* `export JWT_SECRET=somefoo`
* `./build/docker-compose/docker-setup`

Once everything builds and starts up, from another shell in the chatback direcotry say:
* `export JWT_SECRET=somefoo`
* `./build/docker-compose/test`


