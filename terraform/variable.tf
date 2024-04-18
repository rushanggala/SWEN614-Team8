variable "instance_type" {
 type        = string
 description = "Instance type for the EC2 instance"
 default     = "t2.micro"
}

locals {
    aws_key_value_pair = "SWEN_614_KEY"
  }

variable "github_username" {
    type        = string
    description = "GitHub Username"
    default     = "rushanggala"
}

variable "github_pat" {
    type        = string
    description = "GitHub Personal Access Token"
    default     = "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" # Change this to Repositoy Admin's Personal Access Token
}

variable "aws_region" {
    type        = string
    description = "AWS Region"
    default     = "us-east-1" # Change this to your desired region e.g 'us-east-1'
}

variable "aws_access_key" {
    type        = string
    description = "AWS Access Keys"
    default     = "AKIAVRUVSEAOE2ORAXIX" # Change this to your Root Access Key
}

variable "aws_secret_access_key" {
    type        = string
    description = "AWS Secret Access Keys"
    default     = "CAaXxKR8+h2za1JZZvaVxz8DimozN/yfo8wHE4Yo" # Change this to your Root Secret Access Key
}

variable "bucket_name" {
    default = "cloud-project-team8"
}

variable "database_engine" {
  type    = string
  default = "mysql"
}

variable "database_identifier" {
  type    = string
  default = "rds_instance"
}

variable "database_engine_version" {
  type    = string
  default = "8.0.36"
}

variable "database_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "database_username" {
  type    = string
  default = "admin"
}

variable "database_password" {
  type    = string
  default = "adminPassword"
}

variable "database_name" {
  type    = string
  default = "HistoricalStockPrices"
}
