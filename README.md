# Mongo Kubernetes Replica Set Sidecar

This project is as a PoC to setup a mongo replica set using Kubernetes. It should handle resizing of any type and be
resilient to the various conditions both mongo and kubernetes can find themselves in.

## How to use it

The docker image is hosted on docker hub and can be found here:
https://hub.docker.com/r/cvallance/mongo-k8s-sidecar/

An example kubernetes replication controller can be found in the examples directory on github here:
https://github.com/cvallance/mongo-k8s-sidecar

There you will also find some helper scripts to test out creating the replica set and resizing it.

### Settings

- MONGO_SIDECAR_POD_LABELS
  Required: YES
  This should be a be a comma separated list of key values the same as the podTemplate labels. See above for example.
- MONGO_SIDECAR_SLEEP_SECONDS
  Required: NO
  Default: 5
  This is how long to sleep between work cycles.
- MONGO_SIDECAR_UNHEALTHY_SECONDS
  Required: NO
  Default: 15
  This is how many seconds a replica set member has to get healthy before automatically being removed from the replica set.

### SSL

#### Options
- MONGO_SSL_ENABLED
  Required: NO (Required to enable SSL)
  This should be true or false
- MONGO_SSL_ALLOW_INVALID_CERTIFICATES
  Required: NO
  This should be true or false and should be set to true if you want to use self signed certificates
- MONGO_SSL_ALLOW_INVALID_HOSTNAMES
  Required: NO
  This should be true or false and should be set to true if your certificates FQDN's do not match the host name set in your replset

#### MongoDB Command
The following is an example of how you would update the mongo command enabling ssl and using a certificate obtained from a secret and mounted at /data/ssl/mongodb.pem

Command
```
        - name: my-mongo
          image: mongo
          command:
            - mongod
            - "--replSet"
            - heroku
            - "--smallfiles"
            - "--noprealloc"
            - "--sslMode"
            - "requireSSL"
            - "--sslPEMKeyFile"
            - "/data/ssl/mongodb.pem"
            - "--sslAllowConnectionsWithoutCertificates"
            - "--sslAllowInvalidCertificates"
            - "--sslAllowInvalidHostnames"
```

Volume & Volume Mount
```
          volumeMounts:
            - name: mongo-persistent-storage
              mountPath: /data/db
            - name: mongo-ssl
              mountPath: /data/ssl
        - name: mongo-sidecar
          image: cvallance/mongo-k8s-sidecar:latest
          env:
            - name: MONGO_SIDECAR_POD_LABELS
              value: "role=mongo,environment=prod"
            - name: MONGO_SSL_ENABLED
              value: 'true'
            - name: MONGO_SSL_ALLOW_INVALID_CERTIFICATES
              value: 'true'
            - name: MONGO_SSL_ALLOW_INVALID_HOSTNAMES
              value: 'true'
      volumes:
        - name: mongo-ssl
          secret:
            secretName: mongo
```

Creating Secret
```
kube create secret generic mongo --from-file=./keys
```
where `keys` is a directory containing your SSL pem file named `mongodb.pem`

## Debugging

TODO: Instructions for cloning, mounting and watching

## Still to do

- Add tests!
- Add to circleCi
- Alter k8s call so that we don't have to filter in memory
