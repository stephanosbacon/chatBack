# Deploying with Kompose using ../docker-compose/docker-compose.yml

From the top-level chatback directory, do the following:
* minishift start
* `echo 'somefoo' > ./keys/jwtsecret
* `./build/kompose/oc_setup ./keys/jwtsecret`

Once all the services are up and running, you can say `./build/kompose/test ./keys/jwtsecet`

A couple of things to note here.  Since this project doesn't use a default Dockerfile, we have to hack the generated yaml to point to the
correct file to use (there is an open issue to add this feature on kompose).  We also have to associate the secret with the chatback service.

In this case, we use a little javascript program to make these changes rather than oc patch since kompose is generating the yaml for the
artifacts (think of it as a kompose after burner - which wouldn't be a bad little feature by the way...)

