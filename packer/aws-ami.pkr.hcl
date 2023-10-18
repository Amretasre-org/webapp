packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "region" {
  type = string  
  default = "us-east-1"
}

variable "source-ami" {
  type = string   
  default = "ami-06db4d78cb1d3bbf9"
}

variable "username" {
  type = string
  default = "admin"
}

variable "subnetId" {
  type = string 
  default = "subnet-048db4a1f0b8d276c"
}

source "amazon-ebs" "csye6225_ami" {
  # profile = "ami-creation" # have to come from github actions
  ami_name      = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  instance_type = "t2.micro"
  region        = "${var.region}"
  ami_description = "CSYE6225 AMI Creation for Debian server"

  ami_regions = [
    "us-east-1"
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts = 50
  }

  source_ami = "${var.source-ami}"
  ssh_username = "${var.username}"
  subnet_id = "${var.subnetId}"

  # access_key = "${var.aws_access_key}"  
  # secret_key = "${var.aws_secret_key}"

  tags = {
    "Name" = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}",
  }

  ami_users = ["109192051301"]

  launch_block_device_mappings {
    delete_on_termination = true # to terminate all the resouces(snapshots) when the VM is terminated
    device_name = "/dev/xvda"
    volume_size = 8
    volume_type = "gp2"
  }

}

build {
  sources = [
    "source.amazon-ebs.csye6225_ami",
  ]

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
    ]
    script = "./debian-initial-setup.sh"
  }

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/home/admin/webapp.zip"
  }

  provisioner "shell" {
    script = "./debian-build-node-app.sh"
  }
}
  # provisioner "shell" {
  #   environment_vars = [
  #     "DEBIAN_FRONTEND=noninteractive",
  #     "CHECKPOINT_DISABLE=1"
  #   ]
  #   script = "./debian-initial-setup.sh"
  # }
# }