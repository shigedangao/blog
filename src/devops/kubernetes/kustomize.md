---
title: My little experience with Kustomize pt.1
date: 2021-01-02
lastUpdated: 2021-01-04
sidebar: 'auto'
categories:
  - devops
tags:
  - devops
  - kustomize
  - kubernetes
publish: true
---

# Context

One of the many problems that we had at work was that we didn't track the state of the clusters. In other words, we didn't have a snapshot of the state of what has been deployed on the cluster.

Most of the so called `state` is stored in the cloud provider. In our case Google Cloud Platform. GCP provide a yaml editor which allows developers to edit the kubernetes applications. While this is pretty handy the interface doesn't cover these uses cases:

- deleting the wrong applications
- rollback to an older application version, more than the GCP history
- previewing the changes

Moreover editing an entire application on this interface for tasks like add/delete environment variables could be tricky if the project already has a huge number of environment variables.

As a result there was a need to "track the state" of the kubernetes cluster.

# Searching for "something to store the state"

As a newcomer in the DevOps & the Kubernetes world. I didn't really had any idea on how to store the state of the cluster. Thankfully after extensive research. I founded out that DevOps use tools called Infrastructure as Code.

From my understanding it's a way of storing the state of the server/clusters throughout code. Usually, this code is stored on a repository such as Git. There are many IaC that exist, and each of them has their pros and cons. At that time I focus on IaC which was targeting the Kubernetes environment. 

In the end I came up with these lists of IaC: 

- Kustomize
- Helm

::: warning
At the time of my research, Helm was still in V2. Meaning that there still was the tiller component. So, the solution that was selected took into account the fact that Helm was still in V2.
:::

## Limitation

I think it's a good idea for you to understand what kind of Cluster the company use before jumping to the analysis itself. 

The company was pretty small. At that time we didn't really had the budget to pay a Kubernetes cluster with durable nodes. To maintain a low price tag, the cluster use a set of preemptible nodes. More details below.

::: details
Preemptible nodes are a set of instances that only last for 24h. The price is cheaper, but it does not guarantee stability.

To maintain stability, we have many nodes per zone. With multiple zones if an entire zone is in `create`/ `terminating` state. Other node pool in the other zone could take the load

For more information check the [google documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/preemptible-vms)
:::

Maybe Kubernetes wasn't the right tool at this time. But hey, it was already here and with the limited experience that I had I didn't want to break the whole thing...

## Helm V2

Helm V2 was the most used IaC on the kubernetes world. Like any solutions. It has pros and cons. The most important weaknesses were the tiller. The tiller is a component which run inside the kubernetes cluster. It has the responsibility to install the helm charts and maintain the history of these charts.

Aside from the security issues that arise by installing the tiller. There are other like HA issue with the tiller which made the choice of Helm V2 less likely. Because of multiples issues there was some article that even do not recommended to use Helm. For instance: [article](https://medium.com/virtuslab/think-twice-before-using-helm-25fbb18bc822)

Considering that there are HA issues with the tiller, the fact that we're using a set of `unstable` node pool. This increase the probability that the tiller could be unavailable. As such I didn't consider Helm until Helm V3 where I reevaluated the solution.

## Kustomize

As Helm was pretty popular. A new project from Google was getting some light. Kustomize was pretty new and not very known. However from articles, videos that I saw it felt much more simpler to use than Helm. Furthermore,  Kustomize does not use an operator like Helm to deploy applications.

Indeed, Kustomize provide a simpler way of handling the code. It's actually a tool to just merge & template a set of YAML to generate a valid K8S spec with every specificity.

Kustomize is simpler for these reasons:
- No go templating syntax
- No tiller
- Simple YAML syntax
- Close to K8S specs
- Integrate with Kubectl (also a drawback)

Note that compare with Helm, Kustomize is very much a templating tool whereas Helm will provide additional features on top of the templating such as `rollback`. 

# Convert raw K8S spec to Kustomize

## Folder structure

A typical Kustomize folder structure begins with a `base` folder and it's `overlays`. The base folder contains a very much K8S spec such as a:
- deployment.yaml
- service.yaml

The `overlays` folder contain the `override` template which could be use to override the base template for a targeted environment. The folder structure could be like below:

```shell
|- project 1
|---- base
|------ x.yaml
|---- overlays
|------ <env name i.e: demo>
|--------- override.yaml
```

When applying a configuration for a targeted overlay. Kustomize will take the base template and merge the base template with its override. It's alike to `inheritance` in programming.

At that time the number of applications to convert from raw kubernetes spec to kustomize wasn't important. As such the conversion went pretty quick. However, there was some challenge that I want to expose below.

## Convert environment variables to configmap

Previously with the raw kubernetes spec. Environment variable was handles in the deployment.yaml spec. This isn't a very big issue as long as we have a limited number of environment variables. However, for one application the number of environment variables was quite big. (~40 environment variable w/o counting sensible keys...)

Because of this huge, amount I took the time to seperate them into [configmap](https://kubernetes.io/docs/concepts/configuration/configmap/). Because of this amount of environment variables even by being very careful typo error, copy paste error happened :cold_sweat:

Kustomize allow you to define & override configmap by using a special operator name `configMapGenerator`. It could be use like so in the `kustomization.yaml` in your overrides:

```yaml
# base deployment.yaml located at base/deployment.yaml
envFrom:
  - configMapRef:
      name: app-configmap
        
# overlays overlays/<env>/kustomization.yaml
configMapGenerator:
  - name: project1-app-configmap
    literals:
      - NODE_ENV=preproduction
      - BACKEND_API_PROTOCOL=http://
      - BACKEND_API_DOMAIN=foo.fr
```

I think that this is a pretty powerful system which gives a clearer way of handling the environment variables. Define once, override what you need to override.

::: warning
By default, Kustomize add a generated suffix to the configmap. This could be problematic as Kustomize won't delete previous configmap. As a result, you might ended up with multiple configmap.

:warning: To avoid this situation, you can disable the `disableNameSuffixHash` but I learned later that this didn't trigger an update of the deployment so use it with caution.
:::

## Convert api keys to secretmap

Same as with the ConfigMap I store API key (which are sensible values) to secretMap. This is a more secure way of storing credentials & API Keys. Indeed, previously these values would be available in the GCP interface. While only the dev team would be able to saw these values. 

This is a security threat as if someone outside of the dev team could access to that interface they could just be able to get these values. Note that they would be able to get the secretMap from kubectl if they have the permissions to do so.

Using SecretMap works the same way as using the ConfigMap. With Kustomize you would use the `secretGenerator` and set the name in the base template.

```yaml
# base deployment.yaml located at base/deployment.yaml
envFrom:
  - secretRef:
    name: demo-database-credentials
        
# in a different kustomization.yaml file
secretGenerator:
- name: demo-database-credentials
  literals:
    - DATABASE_HOST=""
    - DATABASE_USER=""
    - DATABASE_PASSWORD=""
```

However, with secrets one problem arises. Indeed, the secrets values can't be store on a repository without being encrypted. As a result I recommend you to separate the secret from the overlays themselves. By separating the secrets from the applications overlays this will allow you to only encrypt the secrets overlays by using a tool like [SOPS](https://github.com/mozilla/sops).

By using SOPS, you would then be able to store the secrets in a repository like Git.

For the secrets I store them this way:

```shell
|- secrets
|---- <environment>
|------ kustomization.yaml
```

# Applying Kustomize configuration

It's pretty easy to apply kustomize with kubectl. I usually use two commands. For an existing configuration I recommend to using

```shell
kustomize diff -k <..path>
```

This command allows you to check the diff between the cluster and your local kustomize template files (This can help to avoid huge mistake). Then when you are happy with the changes you can apply the configuration.

```shell
kustomize apply -k
```

::: tip
Always commit your changes before deploying to the cluster. This allow other users to be aware of the changes that you will apply.
:::

# In part 2

In part 2 we will take a look in how communication is important and how the developer team at the company used Kustomize.