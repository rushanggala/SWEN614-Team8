resource "aws_security_group" "news_sg" {
  name        = "news_sg"
  description = "security group for EC2 instance"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

resource "aws_eip" "acr_eip" {
  domain = "vpc"
}

resource "aws_instance" "fetch_news_data" {

  ami             = data.aws_ami.amazonlinux.id
  instance_type   = var.instance_type
  key_name        = local.aws_key_value_pair
  security_groups = [aws_security_group.news_sg.name]
  user_data       = <<-EOF
              #!/bin/bash
              aws configure set aws_access_key_id "${var.aws_access_key}"
              aws configure set aws_secret_access_key "${var.aws_secret_access_key}"
              aws configure set default.region "${var.aws_region}"
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
              pip install -r requirements.txt
              pip list
              echo "Running The python script"
              python fetch_latest_news.py ${var.bucket_name} ${var.database_identifier}
              EOF
  depends_on      = [aws_db_instance.rds_instance, aws_s3_bucket.news_bucket]
}

resource "aws_eip_association" "acr_eip_backend_association" {
  instance_id   = aws_instance.fetch_news_data.id
  allocation_id = aws_eip.acr_eip.id

  depends_on = [aws_instance.fetch_news_data]
}

resource "aws_iam_role" "iam_for_amplify" {
  name               = "iam_for_amplify"
  assume_role_policy = data.aws_iam_policy_document.amplify_assume_role.json
}

resource "aws_iam_role_policy_attachment" "amplify_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess-Amplify"
  role       = aws_iam_role.iam_for_amplify.name
}

resource "aws_lambda_layer_version" "lambda_layer" {
  layer_name          = "api_packages"
  s3_bucket           = var.public_bucket_name
  s3_key              = "python.zip"
  compatible_runtimes = ["python3.12"]
  depends_on = [aws_s3_bucket.news_bucket]
}

resource "aws_lambda_function" "api_lambda" {
  function_name = "fetch_stock_price"

  # The S3 bucket and object key that contains your Lambda function's deployment package
  s3_bucket = var.public_bucket_name
  s3_key    = "lambda_function.zip"

  # Lambda function configuration
  handler = "lambda_function.lambda_handler"
  runtime = "python3.12"

  # IAM role that the Lambda function assumes
  role    = aws_iam_role.lambda_exec.arn
  timeout = 60
  layers  = [
    "arn:aws:lambda:us-east-1:336392948345:layer:AWSSDKPandas-Python312:7",
    aws_lambda_layer_version.lambda_layer.arn
  ]
  depends_on = [time_sleep.wait_60_seconds]
  environment {
    variables = {
      PG_HOST     = aws_db_instance.rds_instance.address
      PG_DATABASE = aws_db_instance.rds_instance.db_name
      PG_USER     = aws_db_instance.rds_instance.username
      PG_PASSWORD = aws_db_instance.rds_instance.password
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow",
      },
    ]
  })
}

# Attach the AWSRDSDataFullAccess policy to the IAM role
resource "aws_iam_role_policy_attachment" "lambda_exec_rds" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonRDSDataFullAccess"
}


# Attach the AWSLambdaBasicExecutionRole policy to the IAM role
resource "aws_iam_role_policy_attachment" "lambda_exec_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_comprehend_policy_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/ComprehendFullAccess"
}

resource "aws_cloudwatch_log_group" "my_lambda" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowMyDemoAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.stock_api.execution_arn}/*/*/*"
}

resource "aws_api_gateway_rest_api" "stock_api" {
  name        = "StockAPI"
  description = "API to fetch stock data"
}

resource "aws_api_gateway_resource" "sentiment_analysis_resource" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  parent_id   = aws_api_gateway_rest_api.stock_api.root_resource_id
  path_part   = "sentiment-analysis"
}

resource "aws_api_gateway_method" "sentiment_analysis_method" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.sentiment_analysis_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "sentiment_analysis_integration" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.sentiment_analysis_resource.id
  http_method = aws_api_gateway_method.sentiment_analysis_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "sentiment_analysis_proxy" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.sentiment_analysis_resource.id
  http_method = aws_api_gateway_method.sentiment_analysis_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_method" "options_sentiment_analysis" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.sentiment_analysis_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration_sentiment_analysis" {
  rest_api_id             = aws_api_gateway_rest_api.stock_api.id
  resource_id             = aws_api_gateway_resource.sentiment_analysis_resource.id
  http_method             = aws_api_gateway_method.options_sentiment_analysis.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates       = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_resource" "stock_price_resource" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  parent_id   = aws_api_gateway_rest_api.stock_api.root_resource_id
  path_part   = "stock-price"
}

resource "aws_api_gateway_method" "stock_price_method" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.stock_price_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "stock_price_integration" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.stock_price_resource.id
  http_method = aws_api_gateway_method.stock_price_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "stock_price_proxy" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.stock_price_resource.id
  http_method = aws_api_gateway_method.stock_price_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_method" "options_stock_price" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.stock_price_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration_stock_price" {
  rest_api_id             = aws_api_gateway_rest_api.stock_api.id
  resource_id             = aws_api_gateway_resource.stock_price_resource.id
  http_method             = aws_api_gateway_method.options_stock_price.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates       = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_resource" "stock_info_resource" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  parent_id   = aws_api_gateway_rest_api.stock_api.root_resource_id
  path_part   = "stock-info"
}

resource "aws_api_gateway_method" "stock_info_method" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.stock_info_resource.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.querystring.ticker" = true
  }
}

resource "aws_api_gateway_integration" "stock_info_integration" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.stock_info_resource.id
  http_method = aws_api_gateway_method.stock_info_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "stock_info_proxy" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.stock_info_resource.id
  http_method = aws_api_gateway_method.stock_info_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_method" "options_stock_info" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.stock_info_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration_stock_info" {
  rest_api_id             = aws_api_gateway_rest_api.stock_api.id
  resource_id             = aws_api_gateway_resource.stock_info_resource.id
  http_method             = aws_api_gateway_method.options_stock_info.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates       = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_resource" "stock_historical_price_resource" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  parent_id   = aws_api_gateway_rest_api.stock_api.root_resource_id
  path_part   = "stock-historical-price"
}

resource "aws_api_gateway_method" "stock_historical_price_method" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.stock_historical_price_resource.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.querystring.ticker" = true
  }
}

resource "aws_api_gateway_integration" "stock_historical_price_integration" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.stock_historical_price_resource.id
  http_method = aws_api_gateway_method.stock_historical_price_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "stock_historical_price_proxy" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.stock_historical_price_resource.id
  http_method = aws_api_gateway_method.stock_historical_price_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_method" "options_stock_historical_price" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.stock_historical_price_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration_stock_historical_price" {
  rest_api_id             = aws_api_gateway_rest_api.stock_api.id
  resource_id             = aws_api_gateway_resource.stock_historical_price_resource.id
  http_method             = aws_api_gateway_method.options_stock_historical_price.http_method
  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates       = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_resource" "fetch_news_resource" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  parent_id   = aws_api_gateway_rest_api.stock_api.root_resource_id
  path_part   = "stock-news"
}

resource "aws_api_gateway_method" "fetch_news_method" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.fetch_news_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "fetch_news_integration" {
  rest_api_id             = aws_api_gateway_rest_api.stock_api.id
  resource_id             = aws_api_gateway_resource.fetch_news_resource.id
  http_method             = aws_api_gateway_method.fetch_news_method.http_method
  integration_http_method = "GET"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:${var.aws_region}:s3:path/${var.bucket_name}/latest_articles.json"
  credentials             = aws_iam_role.api_gateway_role.arn
}

resource "aws_api_gateway_method_response" "fetch_news_proxy" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.fetch_news_resource.id
  http_method = aws_api_gateway_method.fetch_news_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_method" "options_fetch_news" {
  rest_api_id   = aws_api_gateway_rest_api.stock_api.id
  resource_id   = aws_api_gateway_resource.fetch_news_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration_fetch_news" {
  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  resource_id = aws_api_gateway_resource.fetch_news_resource.id
  http_method = aws_api_gateway_method.options_fetch_news.http_method

  integration_http_method = "OPTIONS"
  type                    = "MOCK"
  request_templates       = {
    "application/json" = "{\"statusCode\": 200}"
  }
}


resource "aws_iam_role" "api_gateway_role" {
  name               = "api_gateway_role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = {
          Service = "apigateway.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "s3_access_policy" {
  name        = "s3_access_policy"
  description = "Policy for accessing S3 bucket"

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:*",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::fetch-latest-news",
          "arn:aws:s3:::fetch-latest-news/*"
        ]

      }
    ]
  })
}

resource "aws_iam_policy_attachment" "s3_access_attachment" {
  name       = "s3_access_attachment"
  roles      = [aws_iam_role.api_gateway_role.name]
  policy_arn = aws_iam_policy.s3_access_policy.arn
}

resource "aws_api_gateway_deployment" "stock_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.sentiment_analysis_integration,
    aws_api_gateway_integration.stock_price_integration,
    aws_api_gateway_integration.stock_info_integration,
    aws_api_gateway_integration.stock_historical_price_integration,
    aws_api_gateway_integration.fetch_news_integration,

    aws_api_gateway_integration.options_integration_sentiment_analysis,
    aws_api_gateway_integration.options_integration_stock_price,
    aws_api_gateway_integration.options_integration_stock_info,
    aws_api_gateway_integration.options_integration_stock_historical_price,
    aws_api_gateway_integration.options_integration_fetch_news,

    aws_api_gateway_method_response.sentiment_analysis_proxy,
    aws_api_gateway_method_response.stock_price_proxy,
    aws_api_gateway_method_response.stock_info_proxy,
    aws_api_gateway_method_response.stock_historical_price_proxy,
    aws_api_gateway_method_response.fetch_news_proxy,

    aws_api_gateway_method.options_sentiment_analysis,
    aws_api_gateway_method.options_stock_price,
    aws_api_gateway_method.options_stock_info,
    aws_api_gateway_method.options_stock_historical_price,
    aws_api_gateway_method.options_fetch_news
  ]

  rest_api_id = aws_api_gateway_rest_api.stock_api.id
  stage_name  = "prod"
}


resource "aws_amplify_app" "sentiment_analysis_app" {
  name                  = "sentiment_analysis_app"
  environment_variables = {
    REACT_APP_API_GATEWAY_URL = aws_api_gateway_deployment.stock_api_deployment.invoke_url
  }
  enable_branch_auto_build = true
  depends_on               = [aws_api_gateway_deployment.stock_api_deployment]
  repository               = "https://github.com/rushanggala/SWEN614-Team8"
  oauth_token              = var.github_pat
  iam_service_role_arn     = aws_iam_role.iam_for_amplify.arn
  build_spec               = <<EOF
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
            - echo "REACT_APP_API_GATEWAY_URL = $REACT_APP_API_GATEWAY_URL" >> .env
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
  app_id      = aws_amplify_app.sentiment_analysis_app.id
  branch_name = "main"
}

resource "aws_security_group" "rds_sg" {
  name = "rds_sg"
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "rds_instance" {
  engine                 = var.database_engine
  identifier             = var.database_identifier
  allocated_storage      = 20
  engine_version         = var.database_engine_version
  instance_class         = var.database_instance_class
  username               = var.database_username
  password               = var.database_password
  db_name                = var.database_name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot    = true
  publicly_accessible    = true
  depends_on = [aws_security_group.rds_sg, aws_s3_bucket.news_bucket]
}

resource "time_sleep" "wait_60_seconds" {
  depends_on      = [aws_instance.fetch_news_data]
  create_duration = "60s"
}

resource "aws_s3_bucket" "news_bucket" {
  bucket = var.bucket_name
  force_destroy = true
}