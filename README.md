# Book Bank

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

Before running the project locally, ensure you have the following installed on your system:

- **Node.js** (v20)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** database instance (e.g., Neon)
- A Pinata account for image uploads
- A Gmail account for email notifications

---

### Setting Up the Environment Variables

1. Create a `.env.local` file in the root directory of the project.
2. Add the following environment variables to the file:

```env
# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=123

# JWT secret
JWT_SECRET=your_jwt_secret_key

# Database configuration
DATABASE_URL=your_postgresql_connection_string

# Pinata API credentials
PINATA_API_Key=your_pinata_api_key
PINATA_API_Secret=your_pinata_api_secret
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token

# Email bot credentials
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```
