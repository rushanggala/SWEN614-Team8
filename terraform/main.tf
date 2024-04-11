provider "aws" {
  region = "${var.aws_region}"
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_access_key}"
}

resource "aws_security_group" "news_sg" {
  name        = "news_sg"
  description = "security group for EC2 instance"

  # To allow all Inbound SSH Traffic
  ingress {
    from_port = 22
    to_port = 22
    protocol = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # To allow all Outbound Traffic
  egress {
      from_port = 0
      to_port = 0
      protocol = "-1"
      cidr_blocks = ["0.0.0.0/0"]
  } 
  
}



resource "aws_eip" "acr_eip" {
    domain = "vpc"
}

resource "aws_instance" "fetect_news_data" {

  ami           = data.aws_ami.amazonlinux.id
  instance_type = var.instance_type
  key_name      = "${local.aws_key_value_pair}"
  security_groups = [aws_security_group.news_sg.name]
  user_data = <<-EOF
              #!/bin/bash
              echo "Installing git and python..."
              sudo yum install python3 -y
              sudo yum install -y git
              echo "Cloning the git repo..."
              git clone https://${var.github_username}:${var.github_pat}@github.com/${var.github_username}/SWEN614-Team8.git
              cd SWEN614-Team8/backend
              echo "creating and activating python environment"
              python3 -m venv env
              source env/bin/activate
              python -m pip install --upgrade pip
              pip install yfinance
              pip install boto3
              pip list
              echo "Running The python script"
              python fetch_latest_news.py
              aws configure set aws_access_key_id "${var.aws_access_key}"
              aws configure set aws_secret_access_key "${var.aws_secret_access_key}"
              aws configure set default.region "${var.aws_region}"  
              aws s3 cp latest_articles.json s3://fetch-latest-news
              EOF
}


# To Associate Elastic IP with EC2
resource "aws_eip_association" "acr_eip_backend_association" {
    instance_id = aws_instance.fetect_news_data.id
    allocation_id = aws_eip.acr_eip.id

    depends_on = [ aws_instance.fetect_news_data ]
}


# To start the amplify app, API and Lambda


resource "aws_iam_role" "iam_for_amplify" {
    name = "iam_for_amplify"
    assume_role_policy = data.aws_iam_policy_document.amplify_assume_role.json
}

resource "aws_iam_role_policy_attachment" "amplify_policy" {
    policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess-Amplify"
    role = aws_iam_role.iam_for_amplify.name
}

resource "aws_amplify_app" "example" {
  name          = "example-amplify-app"
  repository    = "https://github.com/rushanggala/SWEN614-Team8"
  oauth_token   = "${var.github_pat}"
  iam_service_role_arn = aws_iam_role.iam_for_amplify.arn
  build_spec = <<EOF
version: 1
applications:
  - backend:
      phases:
        build:
          commands:
            - '# Execute Amplify CLI with the helper script'
            - amplifyPush --simple
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci --cache .npm --prefer-offline
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: build
        files:
          - '**/*'
      cache:
        paths:
          - .npm/**/*
    appRoot: frontend/stock_sentiment_analysis
EOF
}

resource "aws_amplify_branch" "main" {
  app_id     = aws_amplify_app.example.id
  branch_name = "main"
}

resource "aws_lambda_function" "my_lambda" {
  function_name = "fetch_stock_price"

  # The S3 bucket and object key that contains your Lambda function's deployment package
  s3_bucket = "fetch-latest-news"
  s3_key    = "lambda.zip"

  # Lambda function configuration
  handler = "lambda_function.lambda_handler" 
  runtime = "python3.12"

  # IAM role that the Lambda function assumes
  role = aws_iam_role.lambda_exec.arn
  timeout = 60
  layers = [
    "arn:aws:lambda:us-east-1:336392948345:layer:AWSSDKPandas-Python312:7"
  ]
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      }
    }
  ]
}
EOF
}

# Attach the AWSLambdaBasicExecutionRole policy to the IAM role
resource "aws_iam_role_policy_attachment" "lambda_exec_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_cloudwatch_log_group" "my_lambda" {
  name = "/aws/lambda/${aws_lambda_function.my_lambda.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowMyDemoAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.my_api.execution_arn}/*/*/*"
}

resource "aws_api_gateway_rest_api" "my_api" {
  name        = "FetchStock"
  description = "API to fetch Stock Prices"
}

resource "aws_api_gateway_resource" "my_api_resource" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
  path_part   = "stock-price"
}

resource "aws_api_gateway_method" "my_api_method" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.my_api_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "my_api_integration" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.my_api_resource.id
  http_method = aws_api_gateway_method.my_api_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri = aws_lambda_function.my_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.my_api_resource.id
  http_method = aws_api_gateway_method.my_api_method.http_method
  status_code = "200"

  //cors section
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

}

resource "aws_api_gateway_deployment" "my_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.my_api_integration,
	aws_api_gateway_integration.options_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.my_api.id
  stage_name  = "prod"
}

resource "aws_api_gateway_method" "options" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.my_api_resource.id
  http_method = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.my_api_resource.id
  http_method             = aws_api_gateway_method.options.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

output "api_endpoint" {
  value = "${aws_api_gateway_deployment.my_api_deployment.invoke_url}/stock-price"
}
