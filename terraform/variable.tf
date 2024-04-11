variable "instance_type" {
 type        = string
 description = "Instance type for the EC2 instance"
 default     = "t2.micro"
}

locals {
    aws_key_value_pair = "<Your EC2 Key-Value Pair>" # Change this to your Key-Value Pair
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