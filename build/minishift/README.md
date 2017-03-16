# Minishift with local docker build
In order to run this example, in addition to node you will need to install [minishift](https://github.com/minishift/minishift).

Run the following commands from the top level chatback directory:
* 'echo 'somefoo' > ./keys/jwtsecret' - this is the secret that that chatback service will use for creating json web tokens
* `minishift start` - and then wait for it to start up
* `eval $(minishift docker-env) - this will set up your environment so you use the docker running inside the minishift vm
* `./build/minishift/docker_build_minishift` - this will build 2 images:  chatback and cbtest.  cbtest runs the test suite from inside
  the cluster.  You can scale up the number of chatbacks and cbtests and let 'em rip.
* `./build/minishift/oc_setup ./keys/jwtsecret` - this creates all the requisite resources inside openshift.  Give it a bit to make sure all the pods start up
. `./build/minsihift/test ./keys/jwtsecret` - this will run the tests

