# chatBack

The goals for this little project are multifold:
* Learn/hack around with node
* Learn/hack around with various runtime technologies (mongo, redis, a-mq, ...)
* Learn/hack around with various auth technologies
* Learn/hack aound with various deployment technologies - specifically docker-compose and OpenShift

The code is the back end for a little chat server.  It exposes rest APIs for registering users, logging in, creating channels, adding users
to channels, posting messages, and so on.  It also uses websockets to publish messages back to clients.  The back-end is stateless and
uses Redis to publish posted messages since each process maintains an in-memory user/channel/websocket mapping.  This could probably move to
Redis at some point.

Now for the deplooyment stuff.  Initially, this was developed to run simply on a laptop - run a mongo process, run redis, npm start the node
server, and then npm test. The tests themselves exercise the model classes which talk direclty to mongo, as well as the api.  Thus they need
to be able to connect to mongo directly as well as the chat server over http.

The goal w.r.t. deployment is to script the deployment such that one can run npm test from the laptop and have the tests pass.  The various
deployment options are under "build":

* [docker-compose](./build/docker-compose/README.md)
* [minishift using a local docker build](./build/minishift/README.md)
* [minishift using s2i](./build/minishift-s2i/README.md)
* [minishift using kompose to convert docker-compose to openshift artifacts](./build/kompose/README.md)
  This ends up using the docker-build strategy in openshift
