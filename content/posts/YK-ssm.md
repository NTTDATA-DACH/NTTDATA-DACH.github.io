---
title: "Accessing private resources on AWS"
type: article
date: 2022-06-20
publishdate: 2022-06-20
image: "/posts/img/server.jpg"
draft: false
tags: ["development", "container", "aws", "ssm", "vpc", "ci", "ssh"]
authors:
- Yury Kornev
summary: "There are several ways to access private resources (located in private subnets within your VPC) on AWS. Let us discuss solutions based on Systems Manger (SSM) and SSH."
---
# Accessing private EKS cluster using Amazon Systems Manager

## Introduction

There are several ways to access private resources (located in private subnets within your VPC) on
AWS. Let us discuss solutions based on Systems Manger (SSM) and SSH. Though they are applicable for
all private resources, the focus is here on private Kubernetes clusters and *kubectl* as a client.

Both of solutions require a jump server, also called a bastion host. The usual approach is to put
the bastion host in public subnet and open the ssh port, so it can be accessed from Internet.

However, SSM offers infrastructure to accomplish this in a more secure way. The bastion host can be
placed into a private subnet, and there is no need to open the port 22 on the instance. In fact, you
can use the security group blocking every inbound port. SSM only uses outbound connections from a
ssm agent, and utilizes VPC endpoints to connect to services and resources. Session Manager as part
of this infrastructure allows tunneling ssh connections through ssm session to any resource within
VPC from your local machine.

The following diagram shows the mentioned components.
![bastion_host](/posts/img/ssm.png "Bastion Host")

## Prerequisites

In order to use ssm, the ssm agent needs to be installed on the bastion host (more information
[here][1]). Also, the hosts instance must have a relevant IAM policy attached. The
AmazonSSMManagedInstanceCore managed policy includes all the necessary access for SSM.

For your local machine, you have to install the [session manage plugin][2] and to enable ssh
connections through session manager. For that you need to edit the ~/.ssh/config and to add the
[following configuration][3]:

```shell
# SSH over Session Manager
host i-* mi-*
    ProxyCommand sh -c "aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters 'portNumber=%p'"
```

You also need to upload your ssh public key to the bastion host. Although, connecting to the jump
server using SSM does not require any key exchanges with the server, it is still needed for ssh. You
can do it my adding it directly to the ~/.ssh/authorized_keys or to temporarily send it for the
session via *ec2-instance-connect*.

## Local Port Forwarding

After you meet all the prerequisites, you can start setting up the local port forwarding in order to
access EKS using *kubectl*.

**Step 1:** Update your local ~/.kube/config with the private EKS cluster configuration. AWS CLI can
be used for this purpose. For example,

```shell
aws eks --region eu-central-1  update-kubeconfig --name <CLUSTER_NAME> --profile <AWS_PROFILE>  
#Replace <CLUSTER_NAME> with the name of your cluster. and <AWS_PROFILE> - with the profile name 
#you use to connect to AWS.
```

**Step 2:** Edit your local ~/.kube/config and replace the Kubernetes API server endpoint with your
localhost and some port you will use for port forwarding. For example,

```shell
server: https://127.0.0.1:6443
```

**Step 3:** Edit your /etc/hosts file and add host mapping for the API endpoint. For example,

```shell
127.0.1.1 XXXXXX.gr7.eu-central-1.eks.amazonaws.com
#Replace XXXXXX.gr7.eu-central-1.eks.amazonaws.com with your actual endpoint.
```

**Step 4:** At last you can start actual port forwarding. For example,

```shell
ssh  -N -L 6443:<XXXXXX.gr7.eu-central-1.eks.amazonaws.com>:443 ec2-user@<i-XXXXXX>
#Replace <XXXXXX.gr7.eu-central-1.eks.amazonaws.com> with your EKS API server endpoint. and
#<i-XXXXXX> - with the instance id of your bastion host.
```

**Step 5:** Enjoy using kubectl locally.

## Dynamic Port Forwarding

Another simpler and more elegant solution is to use dynamic port forwarding. This is the process to
create a socket on the local machine, which serves as a SOCKS proxy.

**Step 1:** Update your local ~/.kube/config with the private EKS cluster configuration. AWS CLI can
be used for this purpose. For example,

```shell
aws eks --region eu-central-1  update-kubeconfig --name <CLUSTER_NAME> --profile <AWS_PROFILE>  
```

**Step 2:** Start dynamic port forwarding. For example,

```shell
ssh -N -D 7777 ec2-user@<i-XXXXXX>
#Replace the <i-XXXXXX> with the instance id of your bastion host
```

**Step 3:** Force kubectl to use socks proxy. For example,

```shell
export HTTPS_PROXY=socks5://127.0.0.1:7777
```

**Step 4:** Enjoy using kubectl locally.

## Conclusion

AWS SSM is very useful and remarkable piece of technology. And in this article we only showed how to
use it for ssh tunneling. Utilising SSM will increase security posture of your infrastructure, and
still provide flexible option accessing private resources.


[1]: https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-agent.html

[2]: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html

[3]: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html
