'use strict';

let Yaml = require('yamljs');
let fs = require('fs');

function writeObj(obj, file) {
  let str = Yaml.stringify(obj, 20, 2);
  fs.writeFile(file, str, (err) => {
    if (err) {
      return console.log(err);
    }
  });
}


// Workaround for https://github.com/kubernetes-incubator/kompose/issues/486
let buildConfig = Yaml.load('./converted/chatback-buildconfig.yaml');
buildConfig.spec.strategy
  .dockerStrategy.dockerfilePath = 'build/Dockerfiles/Dockerfile_server';
writeObj(buildConfig, './converted/chatback-buildconfig.yaml');


// Edit the buildconfig for chatback so it uses the jwtsecret secret
//
let dc = Yaml.load('./converted/chatback-deploymentconfig.yaml');
let env = dc.spec.template.spec.containers[0].env;
let secret = env.find((elt) => {
  return elt.name === 'JWT_SECRET';
});
delete secret.value;
secret.valueFrom = {
  'secretKeyRef': {
    'name': 'jwtsecret',
    'key': 'jwtsecret'
  }
};
writeObj(dc, './converted/chatback-deploymentconfig.yaml');
