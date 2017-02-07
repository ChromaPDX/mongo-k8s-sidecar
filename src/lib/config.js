var getMongoPodLabels = function() {
  return process.env.MONGO_SIDECAR_POD_LABELS || false;
};

var getMongoPodLabelCollection = function() {
  var podLabels = getMongoPodLabels();
  if (!podLabels) {
    return false;
  }
  var labels = process.env.MONGO_SIDECAR_POD_LABELS.split(',');
  for (var i in labels) {
    var keyAndValue = labels[i].split('=');
    labels[i] = {
      key: keyAndValue[0],
      value: keyAndValue[1]
    };
  }

  return labels;
};

var getKubernetesROServiceAddress = function() {
  return process.env.KUBERNETES_SERVICE_HOST + ":" + process.env.KUBERNETES_SERVICE_PORT
};

module.exports = {
  loopSleepSeconds: process.env.MONGO_SIDECAR_SLEEP_SECONDS || 5,
  unhealthySeconds: process.env.MONGO_SIDECAR_UNHEALTHY_SECONDS || 15,
  mongoSSLEnabled: ( process.env.MONGO_SSL_ENABLED === 'true' ),
  mongoSSLValidate: ( process.env.MONGO_SSL_VALIDATE === 'true' ),
  env: process.env.NODE_ENV || 'local',
  mongoPodLabels: getMongoPodLabels(),
  mongoPodLabelCollection: getMongoPodLabelCollection(),
  kubernetesROServiceAddress: getKubernetesROServiceAddress()
};
