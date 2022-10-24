# Pulumi Exchange Rate Express API Service - Lambda

An exchange rate API service using Pulumi's cloud.HttpServer built on AWS API Gateway and Lambda functions.

## Run

---

You wil need [Pulumi cli](https://www.pulumi.com/docs/get-started/install/), then:

```bash
# Deploy resources:
pulumi up

# Test the endpoint:
pulumi stack select
curl -H "Content-type: application/json" -d '{ GBP: 100 }' $(pulumi stack output url)/USD

# Clean up resources:
pulumi destroy
pulumi stack rm
```

## About

---

### Tooling

- Typescript
- [Express](https://expressjs.com/)
- Jest
- eslint
- Prettier

### CI/CD

- Pulumi
- Github Actions
- Gitpod

### Infrastructure

- Pulumi cloud.HttpServer
- AWS Lambda
- AWS API Gateway
