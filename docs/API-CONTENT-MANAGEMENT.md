# Content Management API Documentation

Complete REST API reference for the Content Management System that allows teachers to browse, clone, customize, and manage content templates.

## Table of Contents
- [Authentication](#authentication)
- [Topics API](#topics-api)
- [Templates API](#templates-api)
- [Version History API](#version-history-api)
- [Audit Log API](#audit-log-api)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

**Role-Based Access:**
- **Admin**: Full access to all operations
- **Teacher**: Can view templates, clone for their school, edit their school's content
- **Student**: Read-only access to published content

---

## Topics API

### List Topics

Get all topics with optional filters.

**Endpoint:** `GET /api/topics`

**Query Parameters:**
- `subject` (ObjectId) - Filter by subject
- `school` (ObjectId) - Filter by school
- `difficulty` (string) - Filter by difficulty: `mudah`, `sedang`, `sulit`
- `gradeLevel` (string) - Filter by grade level: `SMA`, `SMP`, `SD`
- `isTemplate` (boolean) - Filter platform templates vs school-specific
- `search` (string) - Search in name, description, tags

**Response:**
```json
{
  "success": true,
  "count": 23,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "subject": {
        "_id": "507f...",
        "name": "Matematika",
        "code": "MTK",
        "icon": "📐"
      },
      "topicCode": "ALG-01",
      "name": "Aljabar Dasar",
      "slug": "aljabar-dasar",
      "description": "Fundamental concepts of algebra...",
      "icon": "🔢",
      "color": "#3B82F6",
      "order": 1,
      "estimatedMinutes": 120,
      "difficulty": "sedang",
      "learningObjectives": [
        "Memahami variabel dan konstanta",
        "Menyelesaikan persamaan linear"
      ],
      "prerequisites": [],
      "isTemplate": true,
      "isActive": true,
      "metadata": {
        "gradeLevel": ["SMA"],
        "tags": ["algebra", "equations"]
      }
    }
  ]
}
```

---

### Get Single Topic

Get detailed information about a specific topic.

**Endpoint:** `GET /api/topics/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "subject": {
      "_id": "507f...",
      "name": "Matematika",
      "code": "MTK",
      "icon": "📐",
      "color": "#3B82F6"
    },
    "topicCode": "ALG-01",
    "name": "Aljabar Dasar",
    "prerequisites": [
      {
        "_id": "507f...",
        "name": "Aritmatika",
        "topicCode": "ARIT-01",
        "icon": "➕"
      }
    ]
  }
}
```

---

### Get Topic Quizzes

Get all quiz questions for a specific topic.

**Endpoint:** `GET /api/topics/:id/quizzes`

**Query Parameters:**
- `difficulty` (string) - Filter by difficulty
- `limit` (number) - Max results (default: 20)
- `offset` (number) - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 107,
  "data": [
    {
      "_id": "507f...",
      "question": "Berapa hasil dari 2x + 5 = 15?",
      "type": "multiple-choice",
      "options": ["x = 5", "x = 10", "x = 7.5", "x = 20"],
      "correctAnswer": "x = 5",
      "difficulty": "mudah",
      "hints": ["Isolate the variable"],
      "explanation": "Subtract 5 from both sides...",
      "tags": ["linear-equations"],
      "points": 10,
      "timeLimit": 60
    }
  ]
}
```

---

## Templates API

### List Templates

Browse all content templates with filters.

**Endpoint:** `GET /api/content/templates`

**Query Parameters:**
- `subject` (ObjectId) - Filter by subject
- `topic` (ObjectId) - Filter by topic
- `school` (ObjectId) - Filter by school
- `contentType` (string) - Filter by type: `quiz`, `lesson`, `assignment`, `exercise`
- `difficulty` (string) - Filter by difficulty
- `isDefault` (boolean) - Platform templates (true) vs customizations (false)
- `status` (string) - Filter by status: `draft`, `published`, `archived`
- `search` (string) - Search in title, description
- `limit` (number) - Max results (default: 20)
- `offset` (number) - Pagination offset (default: 0)

**Note:** Teachers automatically see only platform templates and their school's content.

**Response:**
```json
{
  "success": true,
  "count": 15,
  "total": 164,
  "data": [
    {
      "_id": "507f...",
      "subject": {
        "_id": "507f...",
        "name": "Matematika",
        "code": "MTK",
        "icon": "📐"
      },
      "topic": {
        "_id": "507f...",
        "name": "Aljabar",
        "topicCode": "ALG-01",
        "icon": "🔢"
      },
      "school": null,
      "contentType": "quiz",
      "templateCode": "MTK-ALG-QUIZ-001",
      "title": "Kuis Aljabar Dasar",
      "description": "Test your algebra fundamentals",
      "difficulty": "sedang",
      "tags": ["algebra", "equations"],
      "estimatedTime": 30,
      "xpReward": 100,
      "gemsReward": 10,
      "isDefault": true,
      "status": "published",
      "publishedAt": "2024-01-15T10:00:00Z",
      "usageCount": 245,
      "averageScore": 78.5,
      "createdBy": {
        "_id": "507f...",
        "name": "Platform Admin",
        "email": "admin@platform.com"
      }
    }
  ]
}
```

---

### Get Single Template

Get detailed template information.

**Endpoint:** `GET /api/content/templates/:id`

**Permission:** 
- Admins: All templates
- Teachers: Platform templates OR their school's templates only

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f...",
    "templateCode": "MTK-ALG-QUIZ-001",
    "title": "Kuis Aljabar Dasar",
    "content": {
      "questions": [
        {
          "id": "q1",
          "question": "Berapa hasil dari 2x + 5 = 15?",
          "options": ["x = 5", "x = 10"],
          "correctAnswer": "x = 5"
        }
      ]
    },
    "metadata": {
      "version": 3,
      "gradeLevel": ["SMA"],
      "language": "id",
      "imageUrl": "/images/algebra-cover.jpg"
    },
    "clonedFrom": null,
    "lastEditedBy": {
      "_id": "507f...",
      "name": "Admin"
    }
  }
}
```

**Error (403 - Access Denied):**
```json
{
  "success": false,
  "error": "Access denied"
}
```

---

### Create Template (Admin Only)

Create a new platform template.

**Endpoint:** `POST /api/content/templates`

**Permission:** Admin only

**Request Body:**
```json
{
  "subject": "507f1f77bcf86cd799439011",
  "topic": "507f1f77bcf86cd799439012",
  "contentType": "quiz",
  "templateCode": "MTK-GEOM-QUIZ-001",
  "title": "Kuis Geometri Dasar",
  "description": "Test your geometry knowledge",
  "content": {
    "questions": [
      {
        "question": "What is the area of a circle?",
        "options": ["πr²", "2πr", "πd", "r²"],
        "correctAnswer": "πr²"
      }
    ]
  },
  "difficulty": "sedang",
  "tags": ["geometry", "circle"],
  "estimatedTime": 25,
  "xpReward": 80,
  "gemsReward": 8,
  "status": "draft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f...",
    "templateCode": "MTK-GEOM-QUIZ-001",
    "title": "Kuis Geometri Dasar",
    "isDefault": true,
    "school": null,
    "status": "draft",
    "createdBy": "507f...",
    "createdAt": "2024-01-20T15:30:00Z"
  }
}
```

**Error (403 - Forbidden):**
```json
{
  "success": false,
  "error": "Only admins can create platform templates"
}
```

---

### Clone Template

Clone a platform template for school customization.

**Endpoint:** `POST /api/content/templates/:id/clone`

**Permission:** Teachers can clone for their school only

**Request Body:**
```json
{
  "schoolId": "507f1f77bcf86cd799439013",
  "customizations": {
    "title": "Kuis Aljabar - SMAN 1 Jakarta",
    "description": "Customized for our students",
    "content": {
      "questions": [
        /* Modified questions */
      ]
    },
    "xpReward": 120,
    "gemsReward": 12
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f...",
    "templateCode": "MTK-ALG-QUIZ-001-CLONE",
    "title": "Kuis Aljabar - SMAN 1 Jakarta",
    "isDefault": false,
    "school": "507f1f77bcf86cd799439013",
    "clonedFrom": "507f1f77bcf86cd799439011",
    "status": "draft",
    "createdBy": "507f...",
    "createdAt": "2024-01-20T16:00:00Z"
  }
}
```

**Error (403 - Forbidden):**
```json
{
  "success": false,
  "error": "Cannot clone template for another school"
}
```

**Error (404 - Not Found):**
```json
{
  "success": false,
  "error": "Template not found"
}
```

---

### Update Template

Update an existing template.

**Endpoint:** `PUT /api/content/templates/:id`

**Permission:** 
- Admins: All templates
- Teachers: Their school's templates only

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": {
    "questions": [/* updated questions */]
  },
  "difficulty": "sulit",
  "reason": "Added more challenging questions"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f...",
    "title": "Updated Title",
    "metadata": {
      "version": 4
    },
    "lastEditedBy": "507f..."
  }
}
```

**Note:** 
- Automatically increments version number
- Creates a version snapshot
- Logs all changes in audit trail

---

### Delete Template (Admin Only)

Permanently delete a template.

**Endpoint:** `DELETE /api/content/templates/:id`

**Permission:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

**Error (403 - Forbidden):**
```json
{
  "success": false,
  "error": "Only admins can delete templates"
}
```

---

### Publish Template

Change template status to published.

**Endpoint:** `PATCH /api/content/templates/:id/publish`

**Permission:** 
- Admins: All templates
- Teachers: Their school's templates only

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f...",
    "status": "published",
    "publishedAt": "2024-01-20T17:00:00Z"
  }
}
```

---

### Archive Template

Change template status to archived.

**Endpoint:** `PATCH /api/content/templates/:id/archive`

**Permission:** 
- Admins: All templates
- Teachers: Their school's templates only

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f...",
    "status": "archived"
  }
}
```

---

## Version History API

### Get Version History

Get all versions of a template.

**Endpoint:** `GET /api/content/templates/:id/versions`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f...",
      "contentTemplate": "507f...",
      "version": 5,
      "changes": [
        {
          "field": "title",
          "oldValue": "Old Title",
          "newValue": "New Title"
        },
        {
          "field": "difficulty",
          "oldValue": "sedang",
          "newValue": "sulit"
        }
      ],
      "editedBy": {
        "_id": "507f...",
        "name": "Teacher Name",
        "email": "teacher@school.com"
      },
      "reason": "Increased difficulty based on student feedback",
      "createdAt": "2024-01-20T18:00:00Z"
    },
    {
      "_id": "507f...",
      "version": 4,
      "changes": [/* ... */],
      "editedBy": {/* ... */},
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ]
}
```

---

### Get Specific Version

Get details of a specific version.

**Endpoint:** `GET /api/content/templates/:id/versions/:version`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f...",
    "contentTemplate": "507f...",
    "version": 3,
    "content": {
      "questions": [/* full content snapshot at version 3 */]
    },
    "changes": [
      {
        "field": "content.questions",
        "oldValue": [/* old questions */],
        "newValue": [/* new questions */]
      }
    ],
    "editedBy": {
      "_id": "507f...",
      "name": "Admin",
      "email": "admin@platform.com"
    },
    "reason": "Fixed typos in questions",
    "createdAt": "2024-01-10T09:00:00Z"
  }
}
```

**Error (404 - Not Found):**
```json
{
  "success": false,
  "error": "Version not found"
}
```

---

### Rollback to Version

Restore template to a previous version.

**Endpoint:** `POST /api/content/templates/:id/rollback`

**Permission:** 
- Admins: All templates
- Teachers: Their school's templates only

**Request Body:**
```json
{
  "version": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rolled back to version 3",
  "data": {
    "_id": "507f...",
    "title": "Original Title from v3",
    "metadata": {
      "version": 6
    }
  }
}
```

**Note:**
- Rollback creates a NEW version (doesn't delete history)
- New version contains snapshot from target version
- Audit log records rollback action with target version reference

**Error (404 - Not Found):**
```json
{
  "success": false,
  "error": "Template not found"
}
```

---

## Audit Log API

### Get Audit Logs

Query comprehensive audit trail for all content operations.

**Endpoint:** `GET /api/content/audit`

**Query Parameters:**
- `contentId` (ObjectId) - Filter by specific content
- `userId` (ObjectId) - Filter by user who made changes
- `action` (string) - Filter by action: `create`, `update`, `delete`, `publish`, `unpublish`, `clone`, `rollback`, `archive`
- `school` (ObjectId) - Filter by school
- `startDate` (ISO date) - Filter from date
- `endDate` (ISO date) - Filter to date
- `limit` (number) - Max results (default: 50)
- `offset` (number) - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "count": 25,
  "total": 156,
  "data": [
    {
      "_id": "507f...",
      "action": "update",
      "contentType": "quiz",
      "contentId": "507f...",
      "userId": {
        "_id": "507f...",
        "name": "Teacher Name",
        "email": "teacher@school.com"
      },
      "userRole": "teacher",
      "school": {
        "_id": "507f...",
        "name": "SMAN 1 Jakarta"
      },
      "changes": [
        {
          "field": "difficulty",
          "oldValue": "sedang",
          "newValue": "sulit"
        }
      ],
      "metadata": {
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "previousVersion": 4,
        "newVersion": 5
      },
      "timestamp": "2024-01-20T18:30:00Z"
    },
    {
      "_id": "507f...",
      "action": "clone",
      "contentType": "quiz",
      "contentId": "507f...",
      "userId": {/* ... */},
      "userRole": "teacher",
      "school": {/* ... */},
      "metadata": {
        "ipAddress": "192.168.1.50",
        "userAgent": "Mozilla/5.0...",
        "originalTemplateId": "507f1f77bcf86cd799439011"
      },
      "timestamp": "2024-01-20T16:00:00Z"
    },
    {
      "_id": "507f...",
      "action": "rollback",
      "contentType": "quiz",
      "contentId": "507f...",
      "userId": {/* ... */},
      "userRole": "admin",
      "metadata": {
        "previousVersion": 5,
        "newVersion": 6,
        "rolledBackTo": 3
      },
      "timestamp": "2024-01-20T19:00:00Z"
    }
  ]
}
```

**Use Cases:**
- Track who made changes and when
- Audit compliance for content modifications
- Debugging: trace history of a template
- Analytics: most active teachers, popular actions
- Security: detect unauthorized access attempts

---

## Error Handling

All endpoints follow consistent error response format:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Access denied"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Template not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to fetch templates"
}
```

---

## Examples

### Example 1: Teacher Clones and Customizes Template

```javascript
// Step 1: Browse platform templates
const templates = await fetch('/api/content/templates?isDefault=true&subject=507f...', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Step 2: Clone a template
const cloned = await fetch('/api/content/templates/507f.../clone', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    schoolId: '507f...',
    customizations: {
      title: 'Kuis Aljabar - SMAN 1 Jakarta',
      xpReward: 120
    }
  })
});

// Step 3: Edit the clone
const updated = await fetch(`/api/content/templates/${cloned.data._id}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: {
      questions: [/* modified questions */]
    },
    reason: 'Added context-specific examples'
  })
});

// Step 4: Publish
const published = await fetch(`/api/content/templates/${cloned.data._id}/publish`, {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### Example 2: Admin Views Audit Trail

```javascript
// Get all changes made by a specific teacher in last 30 days
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

const audit = await fetch(
  `/api/content/audit?userId=507f...&startDate=${thirtyDaysAgo}&limit=100`,
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);

console.log(`Teacher made ${audit.data.total} changes in last 30 days`);
audit.data.data.forEach(log => {
  console.log(`${log.timestamp}: ${log.action} on ${log.contentType}`);
});
```

---

### Example 3: Rollback After Mistake

```javascript
// Step 1: Get version history
const versions = await fetch('/api/content/templates/507f.../versions', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Step 2: Find desired version (e.g., version 3)
const targetVersion = versions.data.find(v => v.version === 3);

// Step 3: Rollback
const rolledBack = await fetch('/api/content/templates/507f.../rollback', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    version: 3
  })
});

console.log(`Rolled back to version 3, now at version ${rolledBack.data.metadata.version}`);
```

---

## Rate Limiting

API endpoints are rate-limited:
- **Read operations:** 100 requests/minute
- **Write operations:** 30 requests/minute
- **Admin operations:** 50 requests/minute

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1642684800
```

---

## Best Practices

1. **Pagination**: Always use `limit` and `offset` for large datasets
2. **Caching**: Cache GET responses for topics (1 hour TTL)
3. **Version Control**: Always provide `reason` when updating templates
4. **Error Handling**: Check `success` field before accessing `data`
5. **Permissions**: Verify user permissions before showing edit/delete buttons
6. **Audit Compliance**: Log all content modifications for compliance
7. **Optimistic Updates**: Show changes immediately, rollback on error

---

## Support

For API issues or questions:
- Email: support@platform.com
- Documentation: https://docs.platform.com/api
- Slack: #api-support
