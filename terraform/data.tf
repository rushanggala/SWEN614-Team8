data "aws_ami" "amazonlinux" {
    most_recent = true
    owners     = ["amazon"]

    filter {
        name="name"
        values = ["al2023-ami-2023*"]
    }
    filter {
        name="virtualization-type"
        values = ["hvm"]
    }
    filter {
        name="root-device-type"
        values = ["ebs"]
    }
    filter {
        name="architecture"
        values = ["x86_64"]
    }
}

data "aws_iam_policy_document" "amplify_assume_role" {
    statement {
        effect = "Allow"

        principals {
            type        = "Service"
            identifiers = ["amplify.amazonaws.com"]
        }
        actions = ["sts:AssumeRole"]
		}
}