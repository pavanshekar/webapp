packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-2"
}

variable "PORT" {
  type        = string
  default     = env("PORT")
  description = "Port"
  sensitive   = true
}

variable "SECRET_KEY" {
  type        = string
  default     = env("SECRET_KEY")
  description = "Secret key"
  sensitive   = true
}

variable "DB_PASSWORD" {
  type        = string
  default     = env("DB_PASSWORD")
  description = "Database password"
  sensitive   = true
}

variable "DB_USER" {
  type        = string
  default     = env("DB_USER")
  description = "Database user"
  sensitive   = true
}

variable "DB_DATABASE" {
  type        = string
  default     = env("DB_DATABASE")
  description = "Database name"
  sensitive   = true
}

variable "DB_HOST" {
  type        = string
  default     = env("DB_HOST")
  description = "Database host"
  sensitive   = true
}

variable "DB_PORT" {
  type        = string
  default     = env("DB_PORT")
  description = "Database port"
  sensitive   = true
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "source_ami" {
  type    = string
  default = "ami-0ddf7dfd13a83d8c8"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-042be8838576f2e10"
}

source "amazon-ebs" "my-ami" {
  region          = var.aws_region
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for csye 6225"

  ami_regions = [
    "us-east-2",
  ]

  ami_users = ["656935817935", "565864190124"]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = var.instance_type
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username
  subnet_id     = var.subnet_id
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
    source      = "app.zip"
    destination = "/tmp/app.zip"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
      "PORT=${var.PORT}",
      "DB_PASSWORD=${var.DB_PASSWORD}",
      "DB_USER=${var.DB_USER}",
      "DB_DATABASE=${var.DB_DATABASE}",
      "DB_HOST=${var.DB_HOST}",
      "DB_PORT=${var.DB_PORT}",
      "SECRET_KEY=${var.SECRET_KEY}",
    ]
    script = "./setup.sh"
  }

  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }

}
