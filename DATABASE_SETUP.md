# Database Setup Instructions

## Prerequisites

1. Create a Neon database account at https://neon.tech
2. Create a new project and database
3. Copy your connection string

## Setup Steps

1. **Environment Variables**
   Create a `.env` file in the project root:

   ```
   DATABASE_URL="postgresql://username:password@host:5432/database_name"
   ```

2. **Generate and Push Schema**

   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Seed Database with Sample Data**
   ```bash
   npm run db:seed
   ```

## Available Scripts

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema directly to database
- `npm run db:seed` - Seed database with sample products

## Database Schema

### Products Table

- `id`: Primary key (CUID)
- `title`: Product name
- `description`: Product description
- `productCode`: Unique product code
- `colours`: JSON array of available colors
- `sizes`: JSON array of available sizes
- `gender`: Target gender (unisex, men, women, kids)
- `priceLow`: Minimum price
- `priceHigh`: Maximum price
- `imgSrc`: Main product image URL
- `secondaryImages`: JSON array of additional image URLs
- `category`: Product category
- `brand`: Product brand
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Usage

Once set up, visit `/products` to see the product listing with filtering capabilities.

### URL Parameters for Filtering

- `?category=apparel` - Filter by category
- `?brand=Nike` - Filter by brand
- `?gender=unisex` - Filter by gender
- `?minPrice=10&maxPrice=50` - Price range
- `?search=shirt` - Text search
- `?colour=red&colour=blue` - Multiple colors
- `?size=M&size=L` - Multiple sizes
