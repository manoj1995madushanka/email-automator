# AWS Lambda Function for Sending Emails with Dynamic PDF Attachments

This project is an AWS Lambda function written in Node.js that sends emails with dynamically generated PDF attachments. 
The PDF is created by modifying a template PDF file, replacing placeholders with current dates and other dynamic content.

---

## **Features**
- Dynamically generates PDF files by modifying a template PDF.
- Sends emails using Gmail via Node.js `nodemailer` library.
- Stores Gmail App Password securely in AWS Secrets Manager.
- Fully configurable and deployable to AWS Lambda.

---

## **Setup Instructions**

### **1. Prerequisites**
- Node.js installed locally.
- An AWS account with access to Lambda and Secrets Manager.
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833?hl=en) set up.

---

### **2. Configuration**

#### **2.1 Upload the Template PDF**
Include the `template.pdf` file in the root directory of your Lambda function before zipping the project for deployment. This file will serve as the template for generating dynamic PDFs.

#### **2.2 Setup AWS Secrets Manager**
1. Go to the **AWS Secrets Manager** console.
2. Create a new secret with the following key-value pairs:
   - `gmailAppPassword`: The Gmail App Password for the sender email address.

3. Note the **Secret ARN** for use in the Lambda function.

#### **3.3 Create an IAM Role**
1. Create an IAM role for the Lambda function with the following policies:
   - **SecretsManagerReadWriteAccess**: To fetch Gmail App Password from AWS Secrets Manager.
   - **AWSLambdaBasicExecutionRole**: To allow logging to CloudWatch.

2. Attach this role to your Lambda function.

---

### **4. Deployment**

#### **4.1 Install Dependencies**
Run the following command to install required dependencies:
```bash
npm install
