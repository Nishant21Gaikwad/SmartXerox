# SmartXerox API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Admin routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Create Order (Upload File)

**POST** `/orders`

**Content-Type**: `multipart/form-data`

**Body (FormData)**:
```javascript
{
  student_name: "John Doe",
  phone_number: "9876543210",
  copies: 2,
  color_type: "B&W", // or "Color"
  file: <File Object>
}
```

**Response**:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "uuid",
    "student_name": "John Doe",
    "phone_number": "9876543210",
    "file_url": "https://...",
    "file_path": "orders/...",
    "copies": 2,
    "color_type": "B&W",
    "status": "In Queue",
    "created_at": "2025-11-06T10:30:00Z"
  }
}
```

**Validation**:
- File size: Max 10MB
- File types: PDF, JPG, PNG
- Phone: 10 digits
- Copies: 1-100
- Color type: "B&W" or "Color"

---

### 2. Get Orders by Phone Number

**GET** `/orders/:phoneNumber`

**Example**: `/orders/9876543210`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student_name": "John Doe",
      "phone_number": "9876543210",
      "file_url": "https://...",
      "copies": 2,
      "color_type": "B&W",
      "status": "In Queue",
      "created_at": "2025-11-06T10:30:00Z"
    }
  ]
}
```

---

### 3. Delete Order

**DELETE** `/orders/:id`

**Response**:
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

---

### 4. Admin Login

**POST** `/admin/login`

**Body**:
```json
{
  "email": "admin@smartxerox.com",
  "password": "admin123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "email": "admin@smartxerox.com",
    "role": "admin"
  }
}
```

---

### 5. Get All Orders (Admin)

**GET** `/admin/orders`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `status` (optional): Filter by status

**Examples**:
- `/admin/orders` - All orders
- `/admin/orders?status=In Queue` - Only queued orders

**Response**:
```json
{
  "success": true,
  "data": [...]
}
```

---

### 6. Update Order Status (Admin)

**PUT** `/admin/orders/:id/status`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "status": "Printing"
}
```

**Valid Statuses**:
- "In Queue"
- "Printing"
- "Ready"
- "Delivered"

**Response**:
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": "uuid",
    "status": "Printing",
    ...
  }
}
```

---

### 7. Get Statistics (Admin)

**GET** `/admin/stats`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "total": 15,
    "byStatus": {
      "In Queue": 5,
      "Printing": 3,
      "Ready": 4,
      "Delivered": 3
    },
    "byColorType": {
      "B&W": 10,
      "Color": 5
    },
    "totalCopies": 45
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Status Codes**:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not admin)
- `404` - Not Found
- `500` - Internal Server Error

---

## Example Usage (JavaScript)

### Upload Order with File

```javascript
const formData = new FormData();
formData.append('student_name', 'John Doe');
formData.append('phone_number', '9876543210');
formData.append('copies', 2);
formData.append('color_type', 'B&W');
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  body: formData
});

const data = await response.json();
```

### Admin Login & Fetch Orders

```javascript
// Login
const loginRes = await fetch('http://localhost:5000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@smartxerox.com',
    password: 'admin123'
  })
});

const { data } = await loginRes.json();
const token = data.token;

// Fetch orders
const ordersRes = await fetch('http://localhost:5000/api/admin/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const orders = await ordersRes.json();
```

---

## Rate Limiting (Future)

Not currently implemented, but recommended for production:
- Student routes: 10 requests/minute
- Admin routes: 100 requests/minute
- File uploads: 5 uploads/minute per IP

---

## CORS Configuration

Currently allows all origins in development.

For production, update `server/server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```
