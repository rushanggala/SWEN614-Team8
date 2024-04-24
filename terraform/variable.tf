variable "instance_type" {
 type        = string
 description = "Instance type for the EC2 instance"
 default     = "t2.micro"
}

locals {
    aws_key_value_pair = "<Your Key Value Pair>"   # Change this to your desired AWS Key-Value pair
  }

variable "github_username" {
    type        = string
    description = "GitHub Username"
    default     = "<Repositoy Admin's Username>" # Change this to Repositoy Admin's Username
}
 
variable "github_pat" {
    type        = string
    description = "GitHub Personal Access Token"
    default     = "<Repositoy Admin's Personal Access Token>" # Change this to Repositoy Admin's Personal Access Token
}

variable "aws_region" {
    type        = string
    description = "AWS Region"
    default     = "us-east-1" # Change this to your desired region e.g 'us-east-1'
}

variable "aws_access_key" {
    type        = string
    description = "AWS Access Keys"
    default     = "<Your Root Access Key>" # Change this to your Root Access Key
}

variable "aws_secret_access_key" {
    type        = string
    description = "AWS Secret Access Keys"
    default     = "<Your Root Secret Access Key>" # Change this to your Root Secret Access Key
}

variable "bucket_name" {
    default = "<Your Bucket Name>" # you can change this to your desired unique bucket name that you want to create
}

variable "public_bucket_name" {
    default = "cloud-project-team8"
}

variable "database_engine" {
  type    = string
  default = "mysql"
}

variable "database_identifier" {
  type    = string
  default = "rds-instance"
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