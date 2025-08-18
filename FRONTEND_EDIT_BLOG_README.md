# Frontend Edit Blog Implementation

## Overview
This document describes the frontend implementation for editing blog posts in the Realtraspaces application. The edit functionality allows users to modify existing blog posts with a user-friendly interface.

## File Structure

```
realtraspaces_fe/src/
├── app/blog/
│   ├── edit/
│   │   └── [slug]/
│   │       ├── page.tsx          # Edit blog page component
│   │       └── layout.tsx        # Edit blog layout
│   ├── create/
│   │   └── page.tsx              # Create blog page (reference)
│   └── page.tsx                  # Blog listing page with edit links
├── types/
│   └── blog.ts                   # TypeScript interfaces for blog types
└── services/
    └── blogService.ts            # Blog API service utilities
```

## Features

### ✅ **Edit Blog Page (`/blog/edit/[slug]`)**
- **Dynamic Route**: Uses Next.js dynamic routing with slug parameter
- **Form Pre-population**: Automatically loads existing blog data
- **Image Management**: View, add, and remove images
- **Real-time Validation**: Client-side form validation
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error messages
- **Loading States**: Loading indicators during operations

### ✅ **Type Safety**
- **TypeScript Interfaces**: Strongly typed blog data structures
- **Form Validation**: Type-safe form handling
- **API Integration**: Type-safe API calls

### ✅ **Service Layer**
- **Centralized API Logic**: All blog API calls in one service
- **Error Handling**: Consistent error handling across the app
- **Helper Methods**: Utility functions for common operations

## Components

### 1. Edit Blog Page (`page.tsx`)

**Location**: `src/app/blog/edit/[slug]/page.tsx`

**Features**:
- Fetches blog data by slug on component mount
- Pre-populates form with existing data
- Handles image uploads and previews
- Form validation before submission
- Error handling and loading states

**Key Functions**:
```typescript
// Fetch blog data
const fetchBlog = async () => {
  const blogData = await BlogService.getBlogBySlug(slug);
  setBlog(blogData);
  setFormData({...});
};

// Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  // Validate form data
  const validationErrors = BlogService.validateBlogData(formData);
  
  // Update blog
  await BlogService.updateBlog(blog!.id, updateData, newImages);
  
  // Redirect to blog list
  router.push('/blog');
};
```

### 2. Blog Types (`blog.ts`)

**Location**: `src/types/blog.ts`

**Interfaces**:
```typescript
interface Blog {
  id: number;
  blogTitle: string;
  blogDescription: string;
  blogContent: string;
  blogImages: string[];
  writer: string;
  category: string;
  tags: string[];
  slug: string;
  likes: number;
  bookmarks: number;
  dynamicFields?: Record<string, any>;
  fieldSchema?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormData {
  blogTitle: string;
  blogDescription: string;
  blogContent: string;
  writer: string;
  category: string;
  tags: string;
  blogImages: string[];
}
```

### 3. Blog Service (`blogService.ts`)

**Location**: `src/services/blogService.ts`

**Key Methods**:
```typescript
// Get blog by slug
static async getBlogBySlug(slug: string): Promise<Blog>

// Update blog
static async updateBlog(id: number, blogData: UpdateBlogRequest, images?: File[]): Promise<Blog>

// Validate blog data
static validateBlogData(data: Partial<Blog>): string[]

// Format image URL
static getImageUrl(imagePath: string): string
```

## Usage

### 1. Accessing the Edit Page

From the blog listing page, click the edit icon on any blog card:
```typescript
<Link
  href={`/blog/edit/${blog.slug}`}
  className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
  title="Edit"
>
  <FiEdit2 size={16} />
</Link>
```

### 2. URL Structure

The edit page uses dynamic routing:
- **URL Pattern**: `/blog/edit/[slug]`
- **Example**: `/blog/edit/my-blog-post-title`
- **Parameter**: `slug` - The blog's slug identifier

### 3. Form Fields

The edit form includes all blog fields:
- **Blog Title** (required)
- **Blog Description** (required)
- **Blog Content** (required)
- **Writer** (required)
- **Category** (required)
- **Tags** (optional, comma-separated)
- **Images** (optional, multiple files)

### 4. Image Management

**Current Images**:
- Display existing images in a grid
- Hover to show remove button
- Click to remove from blog

**New Images**:
- Upload multiple images
- Preview before submission
- Remove from preview if needed

## API Integration

### Backend Endpoints Used

1. **GET `/api/blogs/slug/:slug`** - Fetch blog by slug
2. **PUT `/api/blogs/:id`** - Update blog with images

### Request Format

**Update Blog Request**:
```typescript
// FormData with fields and images
const formData = new FormData();
formData.append('blogTitle', 'Updated Title');
formData.append('blogDescription', 'Updated description');
formData.append('blogContent', 'Updated content');
formData.append('writer', 'Updated Writer');
formData.append('category', 'Updated Category');
formData.append('tags', JSON.stringify(['tag1', 'tag2']));

// Add images
images.forEach(image => {
  formData.append('images', image);
});
```

### Response Handling

**Success Response**:
```typescript
{
  status: 'success',
  data: {
    id: 1,
    blogTitle: 'Updated Title',
    // ... other blog fields
  }
}
```

**Error Response**:
```typescript
{
  status: 'error',
  message: 'Error description'
}
```

## Styling

### Color Scheme
```typescript
const colors = {
  primary: '#2D5F7D',
  secondary: '#5B9CBD',
  accent: '#E8A75D',
  light: '#F5F9FC',
  dark: '#1A3A4A',
  success: '#4CAF50',
  error: '#F44336'
};
```

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: Two-column grid for form fields
- **Desktop**: Full-width layout with proper spacing

### Form Styling
- **Input Fields**: Rounded corners, focus states
- **Textareas**: Resizable, proper line height
- **Buttons**: Gradient backgrounds, hover effects
- **Images**: Grid layout with hover effects

## Error Handling

### Validation Errors
- **Client-side**: Form validation before submission
- **Server-side**: API error responses
- **Display**: Red border and error messages

### Network Errors
- **Fetch Errors**: Network connectivity issues
- **API Errors**: Server response errors
- **Fallback**: User-friendly error messages

### Loading States
- **Initial Load**: Spinner while fetching blog data
- **Form Submission**: Loading button with spinner
- **Image Upload**: Progress indicators

## Security

### Protected Routes
- **Authentication**: Edit page requires user authentication
- **Authorization**: Users can only edit their own blogs (if implemented)

### Input Validation
- **Client-side**: Form validation before submission
- **Server-side**: API validation and sanitization
- **File Upload**: Image type and size validation

## Performance

### Optimization
- **Lazy Loading**: Images loaded on demand
- **Form Validation**: Real-time validation without API calls
- **Image Preview**: Client-side image preview using URL.createObjectURL

### Caching
- **Blog Data**: Fetched once on component mount
- **Image URLs**: Cached for better performance

## Testing

### Manual Testing
1. **Navigation**: Click edit button from blog list
2. **Form Loading**: Verify form pre-population
3. **Validation**: Test required field validation
4. **Image Upload**: Test image upload and preview
5. **Form Submission**: Test successful update
6. **Error Handling**: Test error scenarios

### Automated Testing
```typescript
// Example test structure
describe('Edit Blog Page', () => {
  it('should load blog data by slug', async () => {
    // Test blog data fetching
  });
  
  it('should validate form data', () => {
    // Test form validation
  });
  
  it('should update blog successfully', async () => {
    // Test form submission
  });
});
```

## Future Enhancements

### Planned Features
1. **Rich Text Editor**: WYSIWYG editor for blog content
2. **Image Cropping**: Client-side image editing
3. **Auto-save**: Automatic form saving
4. **Version History**: Track blog changes
5. **Collaborative Editing**: Multiple users editing

### Technical Improvements
1. **React Hook Form**: Better form management
2. **Image Optimization**: WebP conversion, lazy loading
3. **Offline Support**: Service worker for offline editing
4. **Real-time Collaboration**: WebSocket integration

## Troubleshooting

### Common Issues

1. **Blog Not Found**
   - Check if slug exists in database
   - Verify API endpoint is working
   - Check network connectivity

2. **Image Upload Failures**
   - Verify file size limits (5MB per image)
   - Check file type (images only)
   - Ensure proper FormData format

3. **Form Validation Errors**
   - Check required fields are filled
   - Verify data format (tags as comma-separated)
   - Ensure proper field names

4. **API Errors**
   - Check API server status
   - Verify authentication tokens
   - Review server logs for details

### Debug Mode
Enable debug logging in development:
```typescript
// Add to component for debugging
console.log('Form Data:', formData);
console.log('Blog Data:', blog);
console.log('API Response:', response);
```

## Related Documentation

- [Backend Edit Blog API](../Realtraspaces_be/EDIT_BLOG_API_README.md)
- [Blog Types](../src/types/blog.ts)
- [Blog Service](../src/services/blogService.ts)
- [Protected Route Component](../src/components/ProtectedRoute.tsx)
