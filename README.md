# Form Mail Sender

This project is an Express.js application that processes form submissions, verifies reCAPTCHA, and sends form data via email using the Mailjet service.

## Features

- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **Multer**: Middleware for handling `multipart/form-data`, which is primarily used for uploading files.
- **Nodemailer**: A module for Node.js applications to allow easy email sending.
- **reCAPTCHA**: Protects the form submission from bots.
- **Rate Limiting**: Limits the number of requests to prevent abuse.
- **Axios**: Promise-based HTTP client for the browser and Node.js.

## Requirements

- Node.js
- npm (Node Package Manager)
- Mailjet account for sending emails
- Google reCAPTCHA keys

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/rborovina/form-mail-sender.git
   ```

2. Navigate to the project directory:

   ```sh
   cd form-mail-sender
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=3000
   MAILJET_API_KEY=your-mailjet-api-key
   MAILJET_API_SECRET=your-mailjet-api-secret
   EMAIL_FROM=your-email@example.com
   EMAIL_TO=recipient-email@example.com
   EMAIL_SUBJECT=Your Email Subject
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
   ```

## Usage

1. Start the server:

   ```sh
   npm start
   ```

2. The server will run on `http://localhost:3000`.

## API Endpoints

### POST /submit-form

- **Description**: Submits a form with attached photos, verifies reCAPTCHA, and sends the data via email.
- **Request Headers**: `Content-Type: multipart/form-data`
- **Request Body**:
  - `name`: String - Name of the submitter.
  - `email`: String - Email of the submitter.
  - `token`: String - reCAPTCHA token.
  - `photos`: Array - Photos to be uploaded (up to 5 photos, each not exceeding 3MB).

- **Response**:
  - `200 OK`: Form submitted successfully.
  - `400 Bad Request`: reCAPTCHA verification failed.
  - `500 Internal Server Error`: An error occurred during email sending.

### Example Request

```sh
curl -X POST http://localhost:3000/submit-form \
  -F "name=John Doe" \
  -F "email=johndoe@example.com" \
  -F "token=your-recaptcha-token" \
  -F "photos=@/path/to/photo1.jpg" \
  -F "photos=@/path/to/photo2.jpg"
```

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Author

Radmilo Borovina <radmiloborovina99@gmail.com>

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [Nodemailer](https://nodemailer.com/about/)
- [Mailjet](https://www.mailjet.com/)
- [Axios](https://axios-http.com/)
- [reCAPTCHA](https://www.google.com/recaptcha/intro/)
